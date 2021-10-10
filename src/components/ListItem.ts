import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { FormFieldWrapper } from 'spform-field-wrapper';
import { SPFormHelpers } from '../helpers/SPFormHelpers';
import { IWebPartComponent } from "./IWebPartComponent";

enum ListItemMode {
    Create,
    Update
}

export interface IListItemSettings {
    ListItemOnlyUpdate: boolean;
    ListItemUrlFieldDescription: string;
    ListItemWebUrl: string;
    ListItemListId: string;
    ListItemFieldsMap: Array<Array<string>>;
    ListItemDstUrlFieldName?: string;
    ListItemDstUrlFieldSrcFieldName?: string;
}

export class ListItem implements IWebPartComponent {
    private _ffwManager: FormFieldWrappersManager;
    private _settings: IListItemSettings;
    private readonly _buttonId = "ListItemButton";
    private readonly _warnAfterCreate = "Элемент успешно создан."
    private readonly _warnAfterUpdate = "Элемент успешно обновлен."
    private readonly _buttonTitleCreate = "Создать";
    private readonly _buttonTitleUpdate = "Обновить";
    private readonly _buttonHTMLTemplate = '<input type="button" name="ListItemButton" value="{0}" id="{1}" class="" target="_self"></input>';
    private _listItemInputWrapper: FormFieldWrapper;
    private _listItemUrlInputs: NodeListOf<Element>;
    private _listItemUrlValue;
    private _buttonTitle;

    constructor(settings: IListItemSettings) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        if (!window.location.href.match(/DispForm\.aspx/i)) {
            console.log("ListItem loaded");
            this.init();
            this.addButton();
            this.addHandlerToButton();
        }
    }

    private init(): void {
        this._listItemInputWrapper = this._ffwManager.getField(this._settings.ListItemUrlFieldDescription);
        this._listItemUrlInputs = this._listItemInputWrapper.fieldElement.querySelectorAll("input[type=text]");
        this._listItemUrlValue = this._listItemInputWrapper.value.get_url();
        this._buttonTitle = (this._listItemUrlValue || this._settings.ListItemOnlyUpdate) ? this._buttonTitleUpdate : this._buttonTitleCreate;
    }

    private addButton() {
        let buttonWrapper = document.createElement("div");
        let newbuttonHTML = String.format(this._buttonHTMLTemplate, this._buttonTitle, this._buttonId);
        buttonWrapper.innerHTML = newbuttonHTML;
        this._listItemInputWrapper.fieldElement.appendChild(document.createElement("p"));
        this._listItemInputWrapper.fieldElement.appendChild(buttonWrapper);
    }

    private addHandlerToButton() {
        document.querySelector("#" + this._buttonId).addEventListener("click", this._buttonCreateListItem_ClickHandler.bind(this));
    }

    private _buttonCreateListItem_ClickHandler(): void {
        let listItemUrlValue = (<HTMLInputElement>this._listItemUrlInputs[0]).value.replace(/http:\/\//, '');
        let listItemMode = (listItemUrlValue || this._settings.ListItemOnlyUpdate)
            ? ListItemMode.Update
            : ListItemMode.Create;
        if (listItemMode == ListItemMode.Update && !listItemUrlValue)
            return;
        let listItemId = (listItemMode == ListItemMode.Update)
            ? listItemUrlValue.split(/ID=|&/)[1].replace(/^.*-/, "")
            : 0;
        this.setUrlInputDescription();
        let listItemProperties = this.getListItemPropertiesValues();
        this.createListItem(<number>listItemId, listItemProperties, listItemMode);
        
    }

    private setUrlInputDescription(): void {
        let urlInputsDescriptionValue = (<HTMLInputElement>this._listItemUrlInputs[1]).value;
        let fieldsMapFilterByTitle = this._settings.ListItemFieldsMap.filter(pair => pair[0] == "Title");
        if (!urlInputsDescriptionValue && fieldsMapFilterByTitle.length != 0) {
            let formFieldForDstTitle = fieldsMapFilterByTitle[0][1];
            let titleFieldValue = this._ffwManager.getField(formFieldForDstTitle).value;
            (<HTMLInputElement>this._listItemUrlInputs[1]).value =  titleFieldValue;
        }
    }

    private getListItemPropertiesValues(): any {
        let properties = {};
        this._settings.ListItemFieldsMap.forEach(fieldsMap => {
            let formFieldName = fieldsMap[1];
            let dstFieldName = fieldsMap[0];
            let fieldValue = this._ffwManager.getField(formFieldName).value;
            if (fieldValue)
                properties[dstFieldName] = fieldValue;
        });
        properties["Title"] = (<HTMLInputElement>this._listItemUrlInputs[1]).value;
        if (this._settings.ListItemDstUrlFieldName && this._settings.ListItemDstUrlFieldSrcFieldName) {
            let urlDescription = this._ffwManager.getField(this._settings.ListItemDstUrlFieldSrcFieldName).value;
            properties[this._settings.ListItemDstUrlFieldName] = SPFormHelpers.getCurrentItemSPFieldUrlValue(urlDescription);
        }
        return properties;
    }

    private createListItem(itemId: number, properties: any, mode: ListItemMode): void {
        // define context for CSOM query
        let $this = this;
        let ctx = new SP.ClientContext(this._settings.ListItemWebUrl);
        let list = ctx.get_web().get_lists().getById(this._settings.ListItemListId);
        ctx.load(list);
        let listItem = (mode == ListItemMode.Create)
            ? list.addItem(new SP.ListItemCreationInformation())
            : list.getItemById(itemId);
        if (properties != null) {
            for (let property in properties) {
                if (properties.hasOwnProperty(property) === true) {
                    listItem.set_item(property, properties[property]);
                }
            }
        };
        listItem.update();
        ctx.load(listItem);
        ctx.load(list, "DefaultDisplayFormUrl");
        ctx.executeQueryAsync(
            () => {
                $this.afterSuccessCreateListItem(listItem, list, mode);
            },
            $this.onQueryFailed
        );
    }

    private afterSuccessCreateListItem(item: SP.ListItem, list: SP.List, mode: ListItemMode): void {
        if (mode == ListItemMode.Create) {
            let itemUrl = _spPageContextInfo.siteAbsoluteUrl + list.get_defaultDisplayFormUrl() + "?ID=" + item.get_fieldValues().ID;
            this._listItemUrlInputs[0].setAttribute("value", itemUrl);
            var alertTitle = this._warnAfterCreate;
        } else {
            var alertTitle = this._warnAfterUpdate;
        };
        alert(alertTitle);
    }

    private onQueryFailed(sender, args): void {
        alert('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
    }
}