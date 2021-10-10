export class SPListWrapper {
    private _listId;
    private _list;
    private _clientContext;
    private _getFieldsPromise;
    constructor(listId, webUrl?) {
        this._listId = listId;
        this._clientContext = (webUrl) ? new SP.ClientContext(webUrl) : SP.ClientContext.get_current();
        const web = this._clientContext.get_web();
        this._list = web.get_lists().getById(this._listId);
        this._clientContext.load(this._list);
    }
    public getFields() {
        if (!this._getFieldsPromise)
            this._getFieldsPromise = this._getFields();
        return this._getFieldsPromise;
    }
    private _getFields() {
        let listFields = this._list.get_fields();
        this._clientContext.load(listFields);
        return new Promise((resolve, reject) => {
            this._clientContext.executeQueryAsync(() => {
                resolve(listFields);
            }, (error) => {
                console.log(error);
                reject();
            });
        });
    }
}