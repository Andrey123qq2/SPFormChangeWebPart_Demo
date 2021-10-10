export class WebPartManager {
    private _context: any;
    private _webPartManager: any;
    constructor() {
        this._context = SP.ClientContext.get_current();
        let pageFile = this._context.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
        this._webPartManager = pageFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
    }

    public GetSettingsAsync(webPartName: string, onGetSettings: Function) {
        let $this = this;
        var webPartDefs = this._webPartManager.get_webParts();
        this._context.load(webPartDefs, 'Include(WebPart.Properties, WebPart.Title)');
        this._context.executeQueryAsync(function () {
            let wpSettings = $this._getProperties(webPartName, webPartDefs)
                onGetSettings(wpSettings);
            },
            function (sender, args) {
                console.log(args.get_message());
            }
        );
    }

    private _getProperties(webPartName: string, webPartDefs: any): any {
        let outSettings = {};
        if (webPartDefs.get_count()) {
            for (var i = 0; i < webPartDefs.get_count(); i++) {
                var webPart = webPartDefs.getItemAtIndex(i).get_webPart();
                if (!webPart.get_title().match(webPartName)) {
                    continue;
                };
                var propertiesValues = webPart.get_properties().get_fieldValues();
                Object.keys(propertiesValues).forEach(function (key) {
                    outSettings[key] = propertiesValues[key];
                });
            }
        } else {
            console.log("No web parts found.");
            return {};
        };
        return outSettings;
    }
}