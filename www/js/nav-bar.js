import html             from './../html/nav-bar.html';
import {eappend, 
        query, 
        separse}        from './utils';

export class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        let shadw = this.shadowRoot;
        let templ = separse(html);
        let cont  = templ.content.cloneNode(true);
        
        eappend(shadw, cont);

        let menu        = query('#menu',   shadw);
        let slotted     = query('slot',    shadw).assignedElements();
        this._topNav    = query('#topnav', shadw);
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
    _menuClick() {
        this._topNav.classList.toggle('responsive');
    }
    _elmClick(e) {
        this._activeElm.classList.remove('active');
        this._activeElm = e.target;
        this._activeElm.classList.add('active');
        this._topNav.classList.remove('responsive');
    }
}

customElements.define('nav-bar', NavBar);
