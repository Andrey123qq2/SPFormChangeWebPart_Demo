import { FormFieldWrappersManager } from 'spform-field-wrapper';
import { FormFieldWrapper } from 'spform-field-wrapper';
import { IWebPartComponent } from "./IWebPartComponent";
import { IDictionary } from "../helpers/interfaces/IDictionary";

interface IShowElementsBySelectSettings {
    ShowElementsBySelectMode: number;
    ShowElementsBySelectTag: string;
    ShowElementsBySelectFields: Array<ISelectToFieldsParams>
}

interface ISelectToFieldsParams {
    SelectField: string;
    Option: string;
    Fields: Array<string>;
    Elements: Array<string>;
}

export class ShowElementsBySelect implements IWebPartComponent {
    private _ffwManager: FormFieldWrappersManager;
    private _settings: IShowElementsBySelectSettings;
    private _selectsTitles: Array<string>;
    private _selectsToSelectedFieldsMap: IDictionary<Array<string>> = {};
    private _selectsToSelectedElementsMap: IDictionary<Array<string>> = {};
    private _allFieldsToManage: Array<string>;
    private _allElementsToManage: Array<string>;

    constructor(settings: IShowElementsBySelectSettings) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        console.log("ShowElementsBySelect loaded");
        this.init();
        this._addHandlerOnSelects();
        this._modifyFields();
        this._modifyElements();
    }

    private init(): void {
        let $this = this;
        this._allFieldsToManage = Array.prototype.concat.apply(
            [],
            this._settings.ShowElementsBySelectFields
                .map(s => s.Fields)
                .filter(s => typeof s != "undefined")
        );
        this._allElementsToManage = Array.prototype.concat.apply(
            [],
            this._settings.ShowElementsBySelectFields
                .map(s => s.Elements)
                .filter(s => typeof s != "undefined")
        );
        this._selectsTitles = this._settings.ShowElementsBySelectFields
            .map(s => s.SelectField)
            .filter((v, i, a) => a.indexOf(v) === i);
        this._selectsTitles
            .map(t => this._ffwManager.getField(t))
            .filter(w => w)
            .forEach(w => {
                $this._selectsToSelectedFieldsMap[w.fieldName] = $this._getFieldsBySelectedOptions(w, "Fields");
                $this._selectsToSelectedElementsMap[w.fieldName] = $this._getFieldsBySelectedOptions(w, "Elements");
            });
    }

    private _addHandlerOnSelects(): void {
        let $this = this;
        this._selectsTitles
            .map(t => this._ffwManager.getField(t))
            .filter(w => w)
            .forEach(w => w.fieldElement.addEventListener("change", this._selectChangeHandler.bind({ _this: $this, fieldWrapper: w })))
    }

    private _selectChangeHandler(event: any): void {
        let selectWrapper = (this as any).fieldWrapper as FormFieldWrapper;
        let $this = (this as any)._this as ShowElementsBySelect;
        $this._selectsToSelectedFieldsMap[selectWrapper.fieldName] = $this._getFieldsBySelectedOptions(selectWrapper, "Fields");
        $this._selectsToSelectedElementsMap[selectWrapper.fieldName] = $this._getFieldsBySelectedOptions(selectWrapper, "Elements");
        $this._modifyFields();
        $this._modifyElements();
    }

    private _getFieldsBySelectedOptions(selectWrapper: FormFieldWrapper, propName: string): Array<string> {
        let selectValue = selectWrapper.value;
        let selectedOptions: Array<string> = Array.isArray(selectValue) ? selectValue : [selectValue.toString()];
        let selectedFields = selectedOptions
            .reduce((prev, cur) => {
                let selectedParam = this._settings.ShowElementsBySelectFields
                    .filter(s => s.SelectField == selectWrapper.fieldName && s.Option == cur);
                let optionFields = selectedParam[0] && selectedParam[0][propName];
                return prev.concat(optionFields);
            }, [])
            .filter(a => typeof a != "undefined");
        return selectedFields;
    }

    private _modifyFields() {
        let fieldsToShow = ShowElementsBySelect
            ._getArrayFromDictionaryOfArrays<string>(this._selectsToSelectedFieldsMap)
            .filter(e => !!e);
        let fieldsToHide = this._allFieldsToManage.filter(f => fieldsToShow.indexOf(f) == -1);
        if (this._settings.ShowElementsBySelectMode == 0) {
            this._fieldsShowHide(fieldsToShow, fieldsToHide);
        }
        if (this._settings.ShowElementsBySelectMode == 1) {
            this._fieldsDisableEnable(fieldsToShow, fieldsToHide);
        }
    }

    private _modifyElements() {
        let selectorsToShow = ShowElementsBySelect
            ._getArrayFromDictionaryOfArrays<string>(this._selectsToSelectedElementsMap)
            .filter(e => !!e);
        let selectorsToHide = this._allElementsToManage.filter(f => selectorsToShow.indexOf(f) == -1);
        if (this._settings.ShowElementsBySelectMode == 0) {
            this._elementsShowHide(selectorsToShow, selectorsToHide);
        }
    }

    private static _getArrayFromDictionaryOfArrays<T>(dictionary: IDictionary<Array<T>>): Array<T> {
        let resultArray = Object.keys(dictionary)
            .map(key => dictionary[key])
            .reduce((prev, cur) => {
                return prev.concat(cur)
            })
            .filter((v, i, a) => a.indexOf(v) === i);
        return resultArray;
    }

    private _elementsShowHide(elementsToShow: Array<string>, elementsToHide: Array<string>): void {
        elementsToShow.forEach(selector => {
            (<HTMLElement>document.querySelector(selector)).style.display = '';
        });
        elementsToHide.forEach(selector => {
            (<HTMLElement>document.querySelector(selector)).style.display = 'none';
        });
    }

    private _fieldsShowHide(fieldsToShow: Array<string>, fieldsToHide: Array<string>): void {
        let tag = this._settings.ShowElementsBySelectTag;
        fieldsToShow
            .map(f => this._ffwManager.getField(f))
            .filter(w => w)
            .forEach(w => w.show(tag));
        fieldsToHide
            .map(f => this._ffwManager.getField(f))
            .filter(w => w)
            .forEach(w => w.hide(tag));
    }

    private _fieldsDisableEnable(fieldsToEnable: Array<string>, fieldsToDisable: Array<string>) {
        fieldsToEnable
            .map(f => this._ffwManager.getField(f))
            .filter(w => w)
            .forEach(w => w.enable());
        fieldsToDisable
            .map(f => this._ffwManager.getField(f))
            .filter(w => w)
            .forEach(w => w.disable());
    }
}