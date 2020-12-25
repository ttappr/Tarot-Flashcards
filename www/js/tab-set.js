
import {eparse, separse, eappend, ecreate, query} from './utils';

import html from './../html/tab-set.html';

export class TabSet extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        let shadow      = this.shadowRoot;
        let template    = separse(html);
        let content     = template.content.cloneNode(true);       
        eappend(shadow, content);
        let tabHost     = query('#tab-host', shadow);
        let hosted      = this.children;
        this._tabs      = {};
        this._displayed = null;

        // Create a div with a slot referencing each element residing in the 
        // light DOM.
        for (let elm of hosted) {
            let slot = ecreate('slot', {name : elm.slot});
            let div  = ecreate('div');
            eappend(div, slot);
            eappend(tabHost, div);
            this._tabs[elm.slot] = div;
            if (elm.classList.contains('displayed')) {
                div.classList.add('displayed');
                this._displayed = div;
            }
        }
        // TODO - This needs to be tested with other browsers. It works with
        //        Chrome.
    }
    display(name) {
        let div = this._tabs[name];
        if (this._displayed !== null) {
            this._displayed.classList.remove('displayed');
        }
        div.classList.add('displayed');
        this._displayed = div;
    }
}

customElements.define('tab-set', TabSet);
