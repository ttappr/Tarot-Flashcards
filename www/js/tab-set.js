
import {separse, 
        eappend, 
        ecreate, 
        query}      from './utils';
import html         from './../html/tab-set.html';

/**
 * Hosts elements in "tabs" (regular div's actually) which are displayed one
 * at a time. This class can work in conjunction with a nav-bar to display the
 * related content for the selected item. Content is added to the tab-set by
 * declaring them with a 'slot' attribute assigned the name that they're 
 * referred to using 'display().
 */
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
        this._active    = null;

        // Create a div with a slot referencing each element residing in the 
        // light DOM.
        for (let elm of hosted) {
            let slot = ecreate('slot', {name : elm.slot});
            let div  = ecreate('div');
            eappend(div, slot);
            eappend(tabHost, div);
            this._tabs[elm.slot] = [div, elm];
            if (elm.classList.contains('active')) {
                div.classList.add('active');
                this._active = [div, elm];
            }
        }
    }
    /**
     * Causes the content in the slot referenced by 'name' to be shown.
     * @param {string} name The slot name of the content to display.
     */
    display(name) {
        let [div, elm] = this._tabs[name];
        if (this._active !== null) {
            let [adiv, aelm] = this._active;
            adiv.classList.remove('active');
            aelm.classList.remove('active');

        }
        div.classList.add('active');
        elm.classList.add('active');
        this._active = [div, elm];
    }
}

customElements.define('tab-set', TabSet);
