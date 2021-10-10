import { IWebPartComponent } from "./components/IWebPartComponent";
import { IDictionary } from "./helpers/interfaces/IDictionary";

export class WebPartComponentsManager {
    private _webPartSettings: IDictionary<any>;

    public constructor(webPartSettings: IDictionary<any>) {
        this._webPartSettings = webPartSettings;
    }

    public LoadComponents(params: { new(settings: IDictionary<any>): IWebPartComponent; }[]): void {
        params.map((component) => {
            let compName = component.name;
            let compSettings = this.getComponentSettings(compName);
            let enableProperty = compName + "Enable";
            if (compSettings[enableProperty]) {
                try {
                    delete compSettings[enableProperty];
                    let comp = new component(compSettings);
                    comp.Load();
                } catch (err) {
                    console.log(err);
                }
            }
        }, this);
    }

    private getComponentSettings(compName: string): any {
        let _compSettings = {};
        Object.keys(this._webPartSettings)
            .filter(k => k.match(compName))
            .forEach(k => {
                if (k.match("JSON")) {
                    if (!this._webPartSettings[k])
                        return;
                    let jsonObject = JSON.parse(this._webPartSettings[k]);
                    let propName = k.replace("JSON", "");
                    if (Array.isArray(jsonObject))
                        _compSettings[propName] = jsonObject;
                    else
                        Object.keys(jsonObject)
                            .forEach(jsonKey => _compSettings[jsonKey] = jsonObject[jsonKey]);
                } else
                    _compSettings[k] = this._webPartSettings[k];
            })
        return _compSettings;
    }
}