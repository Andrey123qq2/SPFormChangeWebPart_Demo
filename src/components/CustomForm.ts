import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { FormFieldWrapper } from 'spform-field-wrapper';
import { IWebPartComponent } from "./IWebPartComponent";
import { TabsManager } from '../helpers/TabsManager/TabsManager';
import { SPListWrapper } from '../helpers/SPListWrapper';
import { SPListItemWrapper } from '../helpers/SPListItemWrapper';
import { TabItemCollapse } from '../helpers/TabsManager/TabItemCollapse';
import { Util } from '../helpers/Util';
import { SPFormHelpers } from '../helpers/SPFormHelpers';

interface ICustomFormSettings {
    CustomFormInitTabs?: boolean;
    CustomFormSelectorsMap?: Array<Array<string>>;
    CustomFormFieldsSelector?: string;
    CustomFormFullFormSelector?: string;
    CustomFormTabsRootSelector?: string;
    CustomFormTabItemSelector?: string;
    CustomFormTabContentItemSelector?: string;
}

export class CustomForm implements IWebPartComponent {
    private _ffwManager: FormFieldWrappersManager;
    private _settings: ICustomFormSettings;
    private _fieldsPlaceholders: Array<Element>;
    private _fieldsPlaceholdersMoveTimeout: Array<Element>;
    private _fieldsPlaceholdersCalculated: Array<Element>;
    private _allFieldsPlaceholders: Array<Element>;
    private _originalSaveButtonClickHandler: Function;
    private _tabsManager: TabsManager;
    private _moveTimeout = 2300
    private requiredWaringText = "* Необходимо задать значение для этого обязательного поля..";
    private alertRequiredWarning = "Незаполнены обязательные поля";
    private _fullTabContentSelector = "div#tabDefaultFormContent";
    private _fullTabElement;
    private _msFormTable: HTMLElement;
    private currentListWrapper: SPListWrapper;
    private _pickers2010: Array<Element>;
    private _moveTimeoutSelector = ".moveTimeout";
    private _calculatedFieldsSelector = ".calculated";

    constructor(settings: ICustomFormSettings) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        console.log("CustomForm loaded");
        this.moveSelectors();
        TabItemCollapse.factory();
        if (!this._settings.CustomFormInitTabs) {
            (<HTMLElement>document.querySelector(".ms-formtable")).style.display = "table";
            return;
        }
        this.init();
        this._tabsManager.activate();
        this.moveFields();
        this._tabsManager.show();
        this.hideFieldsByHiddenClass();
        this.moveMSTableToFullTab();
        this.addTabsEventListener();
        this.tabsLinksRemoveTarget();
        this.showAndDisablePickers2010();
        if (Util.isIE())
            SPFormHelpers.resizeModalDialog();
        if (!window.location.href.match(/DispForm\.aspx/i)) {
            this.setEditFormCalculatedFieldsAsync();
            this.disableFieldsByDisabledClass();
            this.updateFieldsByRequiredClass();
            this.setFormWrappersRequiredByListSettingsAsync();
            this.moveSaveCancelButtons();
            this.addSaveButtonEventListener();
        }
    }

    private init(): void {
        this._settings.CustomFormFieldsSelector = ".customFormField";
        this._tabsManager = new TabsManager({
            tabsRootSelector: this._settings.CustomFormTabsRootSelector,
            tabItemSelector: this._settings.CustomFormTabItemSelector,
            tabContentItemSelector: this._settings.CustomFormTabContentItemSelector
        });
        this._fieldsPlaceholders = Array.prototype.slice.call(
            document.querySelectorAll(
                this._settings.CustomFormFieldsSelector +
                ":not(" + this._moveTimeoutSelector + ")" +
                ":not(" + this._calculatedFieldsSelector + ")"
            )
        );
        this._fieldsPlaceholdersCalculated = Array.prototype.slice.call(
            document.querySelectorAll(this._calculatedFieldsSelector + ":not(" + this._moveTimeoutSelector + ")")
        );
        if (window.location.href.match(/DispForm\.aspx/i) && this._fieldsPlaceholdersCalculated.length > 0)
            this._fieldsPlaceholders = Array.prototype.concat.call(
                this._fieldsPlaceholders,
                this._fieldsPlaceholdersCalculated
            );
        this._fieldsPlaceholdersMoveTimeout = Array.prototype.slice.call(
            document.querySelectorAll(this._moveTimeoutSelector)
        );
        this._allFieldsPlaceholders = Array.prototype.concat.call(
            this._fieldsPlaceholders,
            this._fieldsPlaceholdersMoveTimeout
        );
        this._fullTabElement = document.querySelector(this._fullTabContentSelector);
        this._msFormTable = document.querySelector("table.ms-formtable");
        this.currentListWrapper = new SPListWrapper(_spPageContextInfo.pageListId);
        this._pickers2010 = Array.prototype.slice.call(document.querySelectorAll("span.ms-usereditor"));
    }

    // #region Move form elements
    private moveSaveCancelButtons(): void {
        let customSaveButtonSelector = ".customFormSave";
        let customCancelButtonSelector = ".customFormCancel";
        let placeholerSaveButton = document.querySelector(customSaveButtonSelector);
        let placeholerCustomButton = document.querySelector(customCancelButtonSelector);
        if (placeholerSaveButton) {
            let saveButtons = document.querySelectorAll("input[type = 'button'][value = 'Сохранить']");
            let saveButton = saveButtons[saveButtons.length - 1];
            placeholerSaveButton.appendChild(saveButton);
        }
        if (placeholerCustomButton) {
            let cancelButtons = document.querySelectorAll("input[type='button'][value='Отмена']");
            let cancelButton = cancelButtons[cancelButtons.length - 1];
            placeholerCustomButton.appendChild(cancelButton);
        }
    }

    private moveSelectors(): void {
        this._settings.CustomFormSelectorsMap?.forEach(pair => {
            let srcElement = document.querySelector(pair[0]);
            let dstElement = document.querySelector(pair[1]);
            dstElement.appendChild(srcElement);
        });
    }

    private moveFields(moveTimeout = this._moveTimeout): void {
        this._fieldsPlaceholders.forEach(p => {
            this.moveFieldToPlaceHolder(p);
        });
        setTimeout(() => {
            this._fieldsPlaceholdersMoveTimeout.forEach(p => {
                this.moveFieldToPlaceHolder(p);
            });
        }, moveTimeout)
    }

    private moveFieldToPlaceHolder(fieldPlaceholder: Element): void {
        let fieldName = fieldPlaceholder.getAttribute("data-displayName");
        let fieldWrapper = this._ffwManager.getField(fieldName);
        if (!fieldWrapper) {
            console.log("Error getting field " + fieldName);
            return;
        }
        Array.prototype.slice.call(fieldWrapper.fieldElement.parentNode.childNodes).forEach(c => {
            fieldPlaceholder.appendChild(c);
        })
    }

    private moveMSTableToFullTab(): void {
        setTimeout(() => {
            this._fullTabElement?.appendChild(this._msFormTable);
            this._msFormTable.style.display = "table";
        }, 0)
    }

    private addTabsEventListener(): void {
        this._tabsManager.tabs.forEach(t => t.addEventListener(this.moveFieldsByFullTab.bind(this)));
    }

    private moveFieldsByFullTab(): void {
        if (this._tabsManager.activeTab.id == "tabDefaultForm" && this._tabsManager.prevActiveTab.id != "tabDefaultForm") {
            this.moveFieldsToFullTab();
            this.hideDatePickers();
        }
        if (this._tabsManager.activeTab.id != "tabDefaultForm" && this._tabsManager.prevActiveTab.id == "tabDefaultForm") {
            this.moveFields(0);
            this.hideDatePickers();
        }
    }

    private hideDatePickers(): void {
        setTimeout(() =>
            Array.prototype.slice.call(document.querySelectorAll("[title='Выберите дату в календаре.']"))
                .forEach(p => (<HTMLElement>p).style.display = "none"),
            600);
    }

    private moveFieldsToFullTab(): void {
        Array.prototype.slice.call(this._msFormTable.querySelectorAll("td.ms-formlabel"))
            .forEach(e => {
                let tdElement = e.nextElementSibling;
                if (!tdElement.innerHTML) {
                    this.moveFieldToMSTablePlaceHolder(e, tdElement);
                }
            });
    }

    private moveFieldToMSTablePlaceHolder(tdlable: Element, tdField: Element): void {
        let fieldName = tdlable.textContent.trim().replace(" *", "");
        let fieldWrapper = this._ffwManager.getField(fieldName);
        if (!fieldWrapper) {
            console.log("Error getting field " + fieldName);
            return;
        }
        Array.prototype.slice.call(fieldWrapper.fieldElement.parentNode.childNodes).forEach(c => {
            tdField.appendChild(c);
        })
    }

    private showAndDisablePickers2010(): void {
        setTimeout(() => {
            this._pickers2010.forEach(p => {
                (<HTMLElement>p).style.display = "";
                let pickerEditor = p.querySelector("[contenteditable]");
                pickerEditor.setAttribute("contenteditable", "false");
            })
        }, 3000);
    }

    private tabsLinksRemoveTarget(): void {
        setTimeout(() => 
            Array.prototype.slice.call(document.querySelectorAll("a.cf-tabs-anchor")).forEach(link => link.removeAttribute("target")),
            500
        );
    }
    // #endregion

    // #region Process custom fields classes
    private hideFieldsByHiddenClass(): void {
        this._allFieldsPlaceholders.forEach(f => {
            if ((<HTMLElement>f).classList.contains("hidden")) {
                let fieldName = f.getAttribute("data-displayName");
                let fieldWrapper = this._ffwManager.getField(fieldName);
                fieldWrapper.hide("div");
            }
        });
    }

    private updateFieldsByRequiredClass(): void {
        this._allFieldsPlaceholders.forEach(f => {
            if ((<HTMLElement>f).classList.contains("required")) {
                let fieldName = f.getAttribute("data-displayName");
                let fieldWrapper = this._ffwManager.getField(fieldName);
                fieldWrapper.required = true;
            }
        });
    }

    private disableFieldsByDisabledClass(): void {
        this._allFieldsPlaceholders.forEach(f => {
            if ((<HTMLElement>f).classList.contains("disabled")) {
                let fieldName = f.getAttribute("data-displayName");
                let fieldWrapper = this._ffwManager.getField(fieldName);
                fieldWrapper.disable();
            }
        });
    }
    // #endregion

    // #region SaveButton related methods
    private addSaveButtonEventListener(): void {
        let saveButtons = document.querySelectorAll("[name$='diidIOSaveItem']");
        if (saveButtons.length > 0) {
            let saveButton0 = (<HTMLElement>saveButtons[0]);
            this._originalSaveButtonClickHandler = saveButton0.onclick;
            Array.prototype.slice.call(saveButtons).forEach(button => {
                (<HTMLElement>button).onclick = this.saveButoonCustomHandler.bind(this);
            })
        };
    }

    private saveButoonCustomHandler(): void {
        console.log("saveButoonCustomHandler");
        this.clearAllRequiredWarnings();
        let emptyRequiredFields = this.getEmptyRequiredFields();
        if (emptyRequiredFields.length == 0)
            this._originalSaveButtonClickHandler();
        else {
            this.addWarnToFields(emptyRequiredFields);
            alert(this.alertRequiredWarning);
        }
    }

    private getEmptyRequiredFields(): Array<FormFieldWrapper> {
        let emptyRequiredFields = this._ffwManager.allFieldsWrappers
            .filter(f => (<FormFieldWrapper>f).required && !(<FormFieldWrapper>f).toString());
        return emptyRequiredFields;
    }

    private addWarnToFields(fields: Array<FormFieldWrapper>): void {
        console.log("addWarnToFields" + fields);
        fields.forEach(f => this.setRequiredWaring(f));
    }

    private async setEditFormCalculatedFieldsAsync() {
        if (!window.location.href.match(/EditForm\.aspx/i))
            return;
        let listFields = await this.currentListWrapper.getFields();
        JSRequest.EnsureSetup();
        var currentItemId = JSRequest.QueryString["ID"];
        let itemWrapper = new SPListItemWrapper(_spPageContextInfo.pageListId, currentItemId);
        let fieldValuesAsText = await itemWrapper.getFieldValuesAsText();
        this.setFormCalculatedFields(listFields, fieldValuesAsText);
    }

    private setFormCalculatedFields(fields, fieldValuesAsText): void {
        let calculatedFields = this.getListFieldsByType(fields, "calculated");
        Object.keys(calculatedFields).forEach(fieldName => {
            let fieldInternalName = calculatedFields[fieldName];
            let itemFieldValue = fieldValuesAsText.get_item(fieldInternalName);
            let fieldPlaceHolder = this._fieldsPlaceholdersCalculated.filter(p => p.getAttribute("data-displayName") == fieldName);
            if (fieldPlaceHolder && fieldPlaceHolder.length > 0)
                fieldPlaceHolder[0].textContent = itemFieldValue;
        })
    }

    private getListFieldsByType(listFields, type) {
        let fieldsByType = {};
        let fieldEnumerator = listFields.getEnumerator();
        while (fieldEnumerator.moveNext()) {
            let oField = fieldEnumerator.get_current();
            let fType = oField.get_fieldTypeKind();
            if (fType === SP.FieldType[type]) {
                fieldsByType[oField.get_title()] = oField.get_internalName();
            }
        };
        return fieldsByType;
    }

    private async setFormWrappersRequiredByListSettingsAsync() {
        let listFields = await this.currentListWrapper.getFields();
        this.setFormWrappersRequiredByListSettings(listFields);
    }

    private setFormWrappersRequiredByListSettings(listFields): void {
        let fieldEnumerator = (<SP.FieldCollection>listFields).getEnumerator();
        while (fieldEnumerator.moveNext()) {
            let oField = fieldEnumerator.get_current();
            let fRequired = oField.get_required();
            if (fRequired) {
                let fieldName = oField.get_title();
                let fieldType = oField.get_typeAsString();
                if (fieldType.match("User")) {
                    let fieldInternalName = oField.get_internalName();
                    let fieldNamePicker2013 = fieldInternalName + "_ClientPeoplePicker";
                    let fieldWrapperPicker2013 = this._ffwManager.getField(fieldNamePicker2013);
                    if (fieldWrapperPicker2013) {
                        setTimeout(() => this.setFieldRequired(fieldWrapperPicker2013), this._moveTimeout);
                    } else {
                        // default user field (non classic forms)
                        let fieldWrapper = this._ffwManager.getField(fieldName);
                        this.setFieldRequired(fieldWrapper);
                    }
                } else {
                    let fieldWrapper = this._ffwManager.getField(fieldName);
                    this.setFieldRequired(fieldWrapper);
                }
            }
        }
    }
    // #endregion

    // #region Set/Unset fields required marks
    public setFieldRequired(fieldWrapper: FormFieldWrapper): void {
        let elementHeader = this._getElementHeader(fieldWrapper);
        if (elementHeader?.tagName.match(/^H\d+/) && !elementHeader.querySelector("requiredSpan")) {
            elementHeader.appendChild(this._getRequiredSpan());
        };
        fieldWrapper.required = true;
    }

    public unsetFieldRequired(fieldWrapper: FormFieldWrapper): void {
        if (fieldWrapper.required) {
            let elementHeader = this._getElementHeader(fieldWrapper);
            if (elementHeader?.tagName.match(/^H\d+/)) {
                let requiredSpan = elementHeader.querySelector("requiredSpan");
                requiredSpan?.remove();
            }
            fieldWrapper.required = false;
        }
    }

    private _getElementHeader(fieldWrapper: FormFieldWrapper): Element {
        return (<Element>fieldWrapper.fieldElement.parentNode).previousElementSibling;
    }

    private _getRequiredSpan(): any {
        let spanElement = document.createElement("span");
        spanElement.setAttribute("title", "This field is required.");
        spanElement.classList.add("ms-accentText", "requiredSpan");
        spanElement.innerHTML = " *";
        return spanElement
    }

    public setRequiredWaring(fieldWrapper: FormFieldWrapper): void {
        let spanElement = document.createElement("span");
        spanElement.setAttribute("role", "alert");
        spanElement.setAttribute("style", "display:block");
        spanElement.classList.add("ms-formvalidation");
        spanElement.classList.add("custom-formvalidation");
        spanElement.innerText = this.requiredWaringText;
        fieldWrapper.fieldElement.after(spanElement);
    }

    public clearAllRequiredWarnings(): void {
        let allRequiredSpans = document.querySelectorAll("span.custom-formvalidation");
        Array.prototype.slice.call(allRequiredSpans).forEach(s => s.remove());
    }
    // #endregion
}