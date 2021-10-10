import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { FormFieldWrapper } from 'spform-field-wrapper';
import { ListItem } from "./ListItem";
import { IListItemSettings } from "./ListItem";
import { IWebPartComponent } from "./IWebPartComponent";
import { IDictionary } from "../helpers/interfaces/IDictionary";
import autocomplete from 'autocompleter';
import { SPFormHelpers } from '../helpers/SPFormHelpers';

interface IAutoCompleteSettings {
    ListId: string;
    WebUrl: string;
    ListFieldIntName: string;
    Folder?: string;
    FieldsMap: Array<Array<string>>;
    UpdateButton: boolean;
}

interface IGetItemsParams {
    ListFieldIntName: string;
    Folder?: string;
    Filter: string;
}

interface IItemForAutoComplete {
    label: string;
    value: string;
    listItem: SP.ListItem;
}

export class AutoCompleteInputs implements IWebPartComponent {
    private _ffwManager: FormFieldWrappersManager;
    private _settings: IDictionary<IAutoCompleteSettings>;
    private readonly _cAMLQueryTemplateInit = "<Contains><FieldRef Name='{0}'/><Value Type='Text'>{1}</Value></Contains>";
    private readonly _cAMLQueryTemplateInitWithFolder = "<And>{0}<Contains><FieldRef Name='FileDirRef'/><Value Type='Text'>{1}</Value></Contains></And>";
    private readonly _cAMLQueryTemplateRoot = "<View Scope='RecursiveAll'>" +
        "<QueryOptions><ViewAttributes Scope='Recursive'/></QueryOptions>" +
        "<Query><Where>{1}</Where></Query></View>";

    constructor(settings: IDictionary<IAutoCompleteSettings>) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        console.log("AutoCompleteInputs loaded");
        this._setAllInputsAutocomplete();
    }

    private _setAllInputsAutocomplete(): void {
        let $this = this;
        Object.keys(this._settings).forEach(k => {
            let inputWrapper = this._ffwManager.getField(k);
            let inputParams = this._settings[k];
            $this._setAutocomplete(inputWrapper, inputParams);
            if (inputParams.UpdateButton)
                $this._addUpdateButton(inputWrapper, inputParams);
        });
    }

    private _addUpdateButton(inputWrapper: FormFieldWrapper, params: IAutoCompleteSettings): void {
        let listItemSettings: IListItemSettings = {
            ListItemOnlyUpdate: true,
            ListItemUrlFieldDescription: inputWrapper.fieldName,
            ListItemWebUrl: params.WebUrl,
            ListItemListId: params.ListId,
            ListItemFieldsMap: params.FieldsMap,
        }
        new ListItem(listItemSettings).Load();
    }

    private _setAutocomplete(inputWrapper: FormFieldWrapper, params: IAutoCompleteSettings): void {
        let $this = this;
        let inputForAutoComplete = (inputWrapper.fieldType == "SPFieldURL")
            ? inputWrapper.fieldElement.querySelector("input[id$=UrlFieldDescription]")
            : inputWrapper.fieldElement.querySelector("input");
        autocomplete<IItemForAutoComplete>({
            input: inputForAutoComplete as any,
            emptyMsg: "No items found",
            minLength: 4,
            fetch: function (text, update) {
                $this._getItemsForAutoCompleteAsync(params, text, update);
            },
            onSelect: item => {
                $this._setInputValue(item, inputWrapper);
                SPFormHelpers.setFieldsBySPListItem(item.listItem, params.FieldsMap);
            },
            disableAutoSelect: true
        });
    }

    private _setInputValue(item: IItemForAutoComplete, inputWrapper: FormFieldWrapper): void {
        let fieldValue;
        if (inputWrapper.fieldType == "SPFieldURL") {
            fieldValue = new SP.FieldUrlValue();
            fieldValue.set_url(item.value);
            fieldValue.set_description(item.label);
        } else {
            fieldValue = item.label
        }
        inputWrapper.value = fieldValue;
    }

    private _getItemsForAutoCompleteAsync(params: IAutoCompleteSettings, filter: string, onSuccess: Function): void {
        let $this = this;
        let getItemsParams = { ListFieldIntName: params.ListFieldIntName, Filter: filter, Folder: params.Folder };
        let spCamlQuery = this._getSPCamlQuery(getItemsParams);
        let clientContext = new SP.ClientContext(params.WebUrl);
        let sourceList = clientContext.get_web().get_lists().getById(params.ListId);
        let collListItems = sourceList.getItems(spCamlQuery);
        clientContext.load(collListItems);
        clientContext.executeQueryAsync(
            () => {
                let itemsForAutoComplete = $this._getItemsFromCAMLResponse(collListItems, params.ListFieldIntName);
                onSuccess(itemsForAutoComplete);
            },
            (sender, args) => {
                console.log('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
            });
    }

    private _getItemsFromCAMLResponse(collListItem: SP.ListItemCollection, fieldName): Array<IItemForAutoComplete> {
        let itemsForAutoComplete = [];
        let listItemEnumerator = collListItem.getEnumerator();
        while (listItemEnumerator.moveNext()) {
            let listItem = listItemEnumerator.get_current();
            let itemDocIdUrlAttr;
            try {
                itemDocIdUrlAttr = listItem.get_item('_dlc_DocIdUrl');
            } catch (err) {}
            let itemAbsUrl = _spPageContextInfo.siteAbsoluteUrl + listItem.get_item("FileRef").replace(/\/\d.*$/, '/DispForm.aspx?ID=') + listItem.get_id();
            let itemDispUrl = itemDocIdUrlAttr ? itemDocIdUrlAttr.get_url() : itemAbsUrl;
            let itemTitle = listItem.get_item("Title") || listItem.get_item('FileLeafRef');
            itemsForAutoComplete.push({
                label: itemTitle,
                value: itemDispUrl,
                listItem: listItem
            });
        }
        return itemsForAutoComplete;
    }

    private _getSPCamlQuery(params: IGetItemsParams): SP.CamlQuery {
        let camlQueryText = this._getCAMLQueryText(params);
        let spCamlQuery = new SP.CamlQuery();
        spCamlQuery.set_viewXml(camlQueryText);
        return spCamlQuery;
    }

    private _getCAMLQueryText(params: IGetItemsParams): string {
        let cAMLQueryTextBase = String.format(this._cAMLQueryTemplateInit, params.ListFieldIntName, params.Filter);
        if (params.Folder) {
            cAMLQueryTextBase = String.format(this._cAMLQueryTemplateInitWithFolder, cAMLQueryTextBase, params.Folder);
        };
        let cAMLQueryText = String.format(this._cAMLQueryTemplateRoot, params.ListFieldIntName, cAMLQueryTextBase);
        return cAMLQueryText;
    }
}