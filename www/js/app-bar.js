
import html             from './../html/app-bar.html';
import {eappend, 
        eparse, 
        meappend, 
        meparse, 
        query}          from './utils';

export class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let templ = meparse(html)[0];
        let cont  = templ.content.cloneNode(true);
        eappend(this.shadowRoot, cont);
    }
}

customElements.define('app-bar', AppBar);
