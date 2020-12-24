
import html             from './../html/app-bar.html';
import {eappend, 
        separse}        from './utils';

export class AppBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let templ = separse(html);
        let cont  = templ.content.cloneNode(true);
        eappend(this.shadowRoot, cont);
    }
}

customElements.define('app-bar', AppBar);
