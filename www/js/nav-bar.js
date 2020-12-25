import html             from './../html/nav-bar.html';
import {eappend, 
        query, 
        separse}        from './utils';

/**
 * A bar with navigable items that can be placed at the top of the screen.
 * Any content that can be displayed within the bar's borders should work. 
 * The items could be spans, divs, anchors, buttons, etc. The elements 
 * within the scope of the <nav-bar> will be displayed across the bar with the
 * selected item highlighted. It's up to the client code to figure out how
 * to attach to and handle click events on the items added.
 */
export class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        let shadow      = this.shadowRoot;
        let template    = separse(html);
        let cont        = template.content.cloneNode(true);
        
        eappend(shadow, cont);

        let menu        = query('#menu',   shadow);
        let slotted     = query('slot',    shadow).assignedElements();
        this._topNav    = query('#topnav', shadow);
        this._activeElm = null;

        menu.onclick    = this._menuClick.bind(this);

        for (let elm of slotted) {
            elm.addEventListener('click', this._elmClick.bind(this));
            if (elm.classList.contains('active')) {
                this._activeElm = elm;
            }
        }
        if (slotted.length > 0 && !this._activeElm) {
            this._activeElm = slotted[0];
            slotted[0].classList.add('active');
        }
    }
    /**
     * Internal handler for the menu click event.
     */
    _menuClick() {
        this._topNav.classList.toggle('responsive');
    }
    /**
     * Internal handler for click events on the items.
     * @param {Event} e The click event.
     */
    _elmClick(e) {
        this._activeElm.classList.remove('active');
        this._activeElm = e.target;
        this._activeElm.classList.add('active');
        this._topNav.classList.remove('responsive');
    }
}

customElements.define('nav-bar', NavBar);
