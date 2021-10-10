export class TabItem {
    public id: string;
    private readonly _activeTabHeaderClass = 'cf-state-active';
    private readonly _activeTabHeaderClass2 = 'cf-tabs-active';
    private readonly _hoverTabHeaderClass = 'cf-state-hover';
    private readonly _activeTabContentClass = 'active';
    private _header: Element;
    private _content;
    constructor(header: Element, content) {
        this._header = header;
        this._content = content;
        this.id = this._header.querySelector("a").getAttribute("href").replace("#", "");
    }
    public addEventListener(action): void {
        this._header.addEventListener('click', () => action());
    }
    public addClickListener(action) {
        this._header.addEventListener('click', () => action(this));
    }
    public addHoverListener() {
        this._header.addEventListener('mouseenter', () => this.hoverHandler(true));
        this._header.addEventListener('mouseleave', () => this.unhoverHandler(false));
    }
    public setActive(value) {
        this._header.classList.toggle(this._activeTabHeaderClass, value);
        this._header.classList.toggle(this._activeTabHeaderClass2, value);
        this._content.classList.toggle(this._activeTabContentClass, value);
    }
    private hoverHandler(value) {
        this._header.classList.toggle(this._hoverTabHeaderClass, value);
    }
    private unhoverHandler(value) {
        this._header.classList.toggle(this._hoverTabHeaderClass, value);
    }

}