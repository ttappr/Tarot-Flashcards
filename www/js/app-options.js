
import { ecreate, eparse, separse, eappend } from  './utils.js';

import html from './../html/app-options.html';
import {CardDeck} from './card-deck';

export class Options extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let template = separse(html).content.cloneNode(true);

        eappend(this.shadowRoot, template);
    }
}

customElements.define('app-options', Options);
