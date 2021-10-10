import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { IWebPartComponent } from "./IWebPartComponent";
import { PrincipalsHelper } from "./../helpers/PrincipalsHelper";

interface IShowElementsByGroupsSettings {
    ShowElementsByGroupsFields: Array<IFieldsToGroupsParams>,
    ShowElementsByGroupsSelectOptions: Array<ISelectOptionsToGroupsParams>,
    ShowElementsByGroupsSelectors: Array<ISelectorsToGroupsParams>
}

interface IFieldsToGroupsParams {
    Field: string;
    Groups: Array<string>,
    Mode: string,
    Selector: string
}

interface ISelectOptionsToGroupsParams {
    Field: string;
    Option: string;
    Groups: Array<string>,
}

interface ISelectorsToGroupsParams {
    Selector: string
    Groups: Array<string>,
}

interface IHideFieldsOptions {
    fields: Array<string>,
    hide?: boolean,
    selector: string
}

interface IDisableFieldsOptions {
    fields: Array<string>,
    disable?: boolean,
}

export class ShowElementsByGroups implements IWebPartComponent {
    private _settings: IShowElementsByGroupsSettings;
    private _ffwManager: FormFieldWrappersManager;

    constructor(settings: IShowElementsByGroupsSettings) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        console.log("ShowElementsByGroups loaded");
        if (this._settings.ShowElementsByGroupsFields)
            this._modifyFieldsByGroups(this._settings.ShowElementsByGroupsFields);
        if (this._settings.ShowElementsByGroupsSelectOptions)
            this._modifySelectOptionsByGroups(this._settings.ShowElementsByGroupsSelectOptions);
        if (this._settings.ShowElementsByGroupsSelectors)
            this._modifySelectosByGroups(this._settings.ShowElementsByGroupsSelectors);
    }

    private _modifySelectosByGroups(options: Array<ISelectorsToGroupsParams>) {
        options.forEach(selectorParams => {
            let groups = selectorParams.Groups;
            if (
                groups.length == 0 ||
                !groups.some(gr => PrincipalsHelper.isCurrentUserMemberOfGroup(gr))
            ) {
                let selectorElement = document.querySelector(selectorParams.Selector);
                selectorElement.remove();
            }
        })
    }

    private _modifySelectOptionsByGroups(options: Array<ISelectOptionsToGroupsParams>) {
        options.forEach(fieldParams => {
            let fieldElement = this._ffwManager.getField(fieldParams.Field).fieldElement.querySelector("[title]");
            let groups = fieldParams.Groups;
            if (
                groups.length == 0 ||
                !groups.some(gr => PrincipalsHelper.isCurrentUserMemberOfGroup(gr))
            ) {
                let optionElement = fieldElement.querySelector("option[value='" + fieldParams.Option + "']");
                fieldElement.removeChild(optionElement);
            }
        })
    }

    private _modifyFieldsByGroups(options: Array<IFieldsToGroupsParams>): void {
        options.forEach(fieldParams => {
            let groups = fieldParams.Groups;
            if (
                groups.length == 0 ||
                !groups.some(gr => PrincipalsHelper.isCurrentUserMemberOfGroup(gr))
            ) {
                if (fieldParams.Mode == "hide")
                    this.hideFields({ fields: [fieldParams.Field], selector: fieldParams.Selector });
                if (fieldParams.Mode == "disable")
                    this.disableFields({ fields: [fieldParams.Field], disable: true });
            }
        })
    }

    private hideFields({ fields, hide = true, selector = "tr"} : IHideFieldsOptions): void {
        fields.forEach((fieldTitle) => {
            let fieldElement = this._ffwManager.getField(fieldTitle);
            if (hide)
                fieldElement.hide(selector);
            else
                fieldElement.show(selector);
        });
    }

    private disableFields({ fields, disable = true }: IDisableFieldsOptions) {
        fields.forEach((fieldTitle) => {
            let fieldElement = this._ffwManager.getField(fieldTitle);
            if (disable)
                fieldElement.disable();
            else
                fieldElement.enable();
        });
    }
}