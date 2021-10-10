export class SPListItemWrapper {
    private listId;
    private listItem;
    private clientContext;
    private _getItemPromise;
    private _getFieldValuesAsTextPromise;

    constructor(listId, itemId, webUrl?) {
        this.listId = listId;
        this.clientContext = (webUrl) ? new SP.ClientContext(webUrl) : SP.ClientContext.get_current();
        const web = this.clientContext.get_web();
        let list = web.get_lists().getById(this.listId);
        this.listItem = list.getItemById(itemId);
        this.clientContext.load(this.listItem);
    }

    public getItem() {
        if (!this._getItemPromise)
            this._getItemPromise = this._getItem();
        return this._getItemPromise;
    }
    private _getItem() {
        return new Promise((resolve, reject) => {
            this.clientContext.executeQueryAsync(() => {
                resolve(this.listItem);
            }, (error) => {
                console.log(error);
                reject();
            });
        });
    }

    public getFieldValuesAsText() {
        if (!this._getFieldValuesAsTextPromise)
            this._getFieldValuesAsTextPromise = this._getFieldValuesAsText();
        return this._getFieldValuesAsTextPromise;
    }
    private _getFieldValuesAsText() {
        let fieldValuesAsText = this.listItem.get_fieldValuesAsText();
        this.clientContext.load(fieldValuesAsText);
        return new Promise((resolve, reject) => {
            this.clientContext.executeQueryAsync((x) => {
                resolve(fieldValuesAsText);
            }, (error) => {
                console.log(error);
                reject();
            });
        });
    }
}