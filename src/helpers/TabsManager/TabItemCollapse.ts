export class TabItemCollapse {
    private static collapseHeadersSelector = ".collapse-header";
    private readonly _tabHeaderClasses = " cf-accordion-header cf-helper-reset cf-corner-top cf-corner-bottom";
    private readonly _hoverTabHeaderClass = 'cf-state-hover';
    private readonly _contentPanelClassActive = 'collapse-panel-active';
    private readonly _contentPanelClasses = " collapse-panel cf-accordion-content cf-helper-reset cf-corner-bottom";
    private _header: Element;
    private _content: Element;

    constructor(header: Element) {
        this._header = header;
        this._content = this._header.nextElementSibling;
    }

    public init(): void {
        this.addStyles();
        this.addHoverListener();
        this.addHeaderHoverSign();
        this.addClickListener();
    }

    public addStyles(): void {
        this._header.className += this._tabHeaderClasses;
        this._content.className += this._contentPanelClasses;
    }

    public addHoverListener(): void {
        this._header.addEventListener('mouseenter', () => this.hoverHandler(true));
        this._header.addEventListener('mouseleave', () => this.hoverHandler(false));
    }

    private hoverHandler(value): void {
        this._header.classList.toggle(this._hoverTabHeaderClass, value);
    }

    private addHeaderHoverSign(): void {
        let spanElement = document.createElement("span");
        spanElement.className = "cf-icon cf-icon-triangle-1-e";
        this._header.prepend(spanElement);
    }

    public addClickListener(): void {
        this._header.addEventListener('click', () => this.clickHandler());
    }

    private clickHandler(): void {
        let signElement = this._header.querySelector(".cf-icon");
        signElement.classList.toggle("cf-icon-triangle-1-s");
        signElement.classList.toggle("cf-icon-triangle-1-e");
        this._content.classList.toggle(this._contentPanelClassActive);
    }

    public static factory(): void {
        let collapseHeaders = document.querySelectorAll(TabItemCollapse.collapseHeadersSelector);
        Array.prototype.slice.call(collapseHeaders).forEach(h => new TabItemCollapse(h).init())
    }
}