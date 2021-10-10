import 'element-closest-polyfill';
import './polyfills/nodeAfter';
import './polyfills/nodePrepend';
import './polyfills/nodeRemove';
import './polyfills/newEvent';
import './polyfills/functionNameIE';
import './prototypes/formatWithArray';
import 'autocompleter/autocomplete.min.css';
import "es6-promise/auto";
import { WebPartComponentsManager } from "./WebPartComponentsManager";
import { WebPartManager } from "./WebPartManager";
import { componentsToLoad } from "./ComponentsListToLoad";

document.addEventListener('DOMContentLoaded', function () {
    SP.SOD.executeOrDelayUntilScriptLoaded(function () {
        SP.SOD.executeOrDelayUntilScriptLoaded(
            function () {
                if (!window.location.href.match(/DispForm\.aspx/i)) {
                    SP.SOD.executeFunc('clientpeoplepicker.js', 'SPClientPeoplePicker', Main)
                } else { Main(); }
            }, 'SP.js');
    }, 'SP.RunTime.js');
});

function Main() {
    var wpManager = new WebPartManager();
    wpManager.GetSettingsAsync("FormChangeVisualWebPart", loadComponents)
}

function loadComponents(webPartSettings) {
    console.log("FormChangeWebpart: loadComponents started");
    var webPartComponentsManager = new WebPartComponentsManager(webPartSettings);
    webPartComponentsManager.LoadComponents(componentsToLoad);
}