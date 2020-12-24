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

        let burger = query('#burger', shadw);
        burger.onclick = this.burgerClick.bind(this);

        this._topNav = query('#myTopnav', shadw);
    }
    burgerClick() {
        var top = this._topNav;
        if (top.className === "topnav") {
            top.className += " responsive";
        } else {
            top.className = "topnav";
        }
    }
}

customElements.define('nav-bar', NavBar);
