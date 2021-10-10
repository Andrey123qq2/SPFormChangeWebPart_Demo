import { TabItem } from "./TabItem";

export class TabsManager {
    public tabs: Array<TabItem>;
    public activeTab: TabItem;
    public prevActiveTab: TabItem;
    private _navRootNode;
    private _headers;
    private _contents;
    private readonly _mainTabsContainerSelector = "#mainTabsContainer";
    constructor({ tabsRootSelector = "div#tabs-container", tabItemSelector = "li.tab-header", tabContentItemSelector = "div.content-tab" }) {
        this.tabs = [];
        this.activeTab = null;
        this._navRootNode = document.querySelector(tabsRootSelector);
        this._headers = this._navRootNode.querySelectorAll(tabItemSelector);
        this._contents = this._navRootNode.querySelectorAll(tabContentItemSelector);
    }

    public activate() {
        this.initFromHtml();
        this.activateTab(this.tabs[0]);
    }

    public show() {
        this.fadeIn((<HTMLElement>document.querySelector(this._mainTabsContainerSelector)));
    }

    private initFromHtml(): any {
        for (var i = 0; i < this._headers.length; i++) {
            this.registerTab(this._headers[i], this._contents[i]);
        }
    }

    private registerTab(header, content) {
        const tab = new TabItem(header, content);
        tab.addClickListener(() => this.activateTab(tab));
        tab.addHoverListener();
        this.tabs.push(tab);
    }

    private activateTab(tabItem) {
        if (this.activeTab) {
            this.prevActiveTab = this.activeTab;
            this.activeTab.setActive(false);
        }
        this.activeTab = tabItem;
        this.activeTab.setActive(true);
    }

    private fadeOut(el) {
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    private fadeIn(el, display = "block") {
        el.style.opacity = 0;
        el.style.display = display;

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };
}