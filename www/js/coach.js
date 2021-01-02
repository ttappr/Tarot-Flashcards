
import {eappend, 
        query, 
        separse}        from './utils.js';

import html             from './../html/coach.html';

export class Coach extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let shadow   = this.shadowRoot;
        let template = separse(html);
        eappend(shadow, template.content.cloneNode(true));

        this._reveal    = query('#reveal',   shadow);
        this._next      = query('#next',     shadow);
        this._progress  = query('#progress', shadow);
        this._question  = query('#question', shadow);
        this._deck      = query('card-deck', this);

        this._reveal.onclick    = this._onReveal.bind(this);
        this._next.onclick      = this._onNext.bind(this);

        this._next.disabled     = true;
        this._lastCardID        = null;

        setTimeout(() => {
            this._onNext();
        });
    }
    _onReveal() {
        this._deck.showBack();
        this._question.style.visibility = 'hidden';

        this._next.disabled = false;
        this._reveal.disabled = true;
    }
    _onNext() {
        let ids  = this._deck.filteredCardIDs;
        let nids = ids.length;
        let id   = '';
        do {
            let rnd  = Math.floor(Math.random() * nids);
                id   = ids[rnd];
        } while (id === this._lastCardID && nids > 1);
        this._lastCardID = id;
        this._deck.showCard(id);
        this._question.style.visibility = 'visible';

        this._next.disabled = true;
        this._reveal.disabled = false;
    }
}

customElements.define('flashcard-coach', Coach);
