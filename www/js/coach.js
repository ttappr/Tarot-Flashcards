
import {eappend, separse} from './utils.js';

import html from './../html/coach.html';

export class Coach extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let shadow   = this.shadowRoot;
        let template = separse(html);
        eappend(shadow, template.content.cloneNode(true));
    }
}

customElements.define('flashcard-coach', Coach);
