import { IWebPartComponent } from "./IWebPartComponent";
import { FormFieldWrappersManager, FormFieldWrapperSPFieldUser } from 'spform-field-wrapper';

interface ISetTitleSettings {
    SetTitleField: string;
    SetTitleSourceFields: Array<string>;
    SetTitleFormat: string;
}

export class SetTitle implements IWebPartComponent {
    private _ffwManager: FormFieldWrappersManager;
    private _settings: ISetTitleSettings;

    constructor(settings: ISetTitleSettings) {
        this._settings = settings;
        this._ffwManager = FormFieldWrappersManager.getInstance();
    }

    public Load(): void {
        console.log("SetTitle loaded");
        if (this._settings.SetTitleField && this._settings.SetTitleFormat) {
            this._addHandlersToFields();
        }
    }

    private _addHandlersToFields(): void {
        let $this = this;
        this._settings.SetTitleSourceFields
            .map(f => this._ffwManager.getField(f))
            .filter(w => w)
            .forEach(w => {
                w.addEventListener("click", $this._setTitleValue.bind($this));
                w.addEventListener("focusout", $this._setTitleValue.bind($this));
            })
    }

    private _setTitleValue(): void {
        let titleFieldWrapper = this._ffwManager.getField(this._settings.SetTitleField);
        let currentTitleFieldValue = titleFieldWrapper.value;
        let newTitleFieldValue = this._getTitleNewValue();
        if (currentTitleFieldValue != newTitleFieldValue)
            titleFieldWrapper.value = newTitleFieldValue;
    }

    private _getTitleNewValue(): string {
        let sourcesValues = this._settings.SetTitleSourceFields
            .map(f => this._ffwManager.getField(f)?.toString())
            .filter(v => v && v != "");
        let newTitleFieldValue = this._settings.SetTitleFormat
            .formatWithArray(sourcesValues)
            .replace(/( - )?\{\d\}/g, "");
        return newTitleFieldValue;
    }
}