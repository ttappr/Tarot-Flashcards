
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
 * referred to using '.display(<slot-name>). A <div> element can be used to
 * populate each named slot. It will be hosted in an internal div that fills
 * the tab space.
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
        let active      = this.getAttribute('active');
        this._tabs      = {};
        this._active    = null;

        // Create a div with a slot referencing each element residing in the 
        // light DOM.
        for (let elm of hosted) {
            let name = elm.slot;
            let div  = this._tabs[name];
            if (!div) {
                let slot = ecreate('slot', {name : name});
                    div  = ecreate('div',  {name : name});
                eappend(div, slot);
                eappend(tabHost, div);
                this._tabs[name] = div;
                if (name === active) {
                    div.classList.add('active');
                    this._active = div;
                }
            }
        }
    }
    // TODO - add code to watch the 'active' attribute.

    /**
     * Causes the content in the slot referenced by 'name' to be shown.
     * @param {string} name The slot name of the content to display.
     */
    display(name) {
        let div = this._tabs[name];
        if (div) {
            if (this._active !== null) {
                this._active.classList.remove('active');
            }
            div.classList.add('active');
            this.setAttribute('active', name);
            this._active = div;
        } else {
            throw new Error(`No slot with name "${name}" to display.`);
        }
    }
}

customElements.define('tab-set', TabSet);
