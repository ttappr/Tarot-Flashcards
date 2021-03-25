import storage          from './persistent-storage.js';
import html             from './../html/daily-card.html';
import {eappend, 
        query, 
        separse}        from './utils';
        
import {StaticDeck}     from './card-deck.js';

const STOR_PREFIX       = 'dailycard:';
const STOR_DAILY_CARD   = 'dailycard:card';
const STOR_CURRENT_DATE = 'dailycard:date';

/**
 * @see file://./../html/daily-card.html
 */
export class DailyCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        
        let shadow      = this.shadowRoot;
        let template    = separse(html);
        let cont        = template.content.cloneNode(true);
        
        eappend(shadow, cont);
        
        this._title     = query('.title', shadow);
        this._card      = query('.card-host', shadow);
        this._meaning   = query('.card-meaning', shadow);
        
        let card = this._getDailyCard();
        
        this._setDailyCard();
        this._setCardTimer();
    }
    _getDailyCard() {
        if (this._isNewDay()) {
            let new_card = this._chooseNewCard();
            this._storeCardData(this._getDate(), new_card);
            return new_card;
        } else {
            let card_id = storage.data[STOR_DAILY_CARD];
            return StaticDeck.getCardByID(card_id);
        }
    }
    _setDailyCard() {
        this._card.removeChild(this._card.firstChild);
        let card = this._getDailyCard();
        this._title.textContent = card.name;
        this._card.appendChild(card.image);
        this._meaning.textContent = card.meaning;
    }
    _isNewDay() {
        return storage.data[STOR_CURRENT_DATE] !== this._getDate();
    }
    _chooseNewCard() {
        let cards       = StaticDeck.cards;
        let rand_idx    = Math.floor(Math.random() * cards.length);
        return cards[rand_idx];
    }
    _getDate() {
        return new Date().toLocaleDateString("en-US");
    }
    _storeCardData(date, card) {
        storage.data[STOR_CURRENT_DATE] = date;
        storage.data[STOR_DAILY_CARD] = card.id;
    }
    _setCardTimer() {
        let now = new Date();
        let tmw = new Date(now.getUTCFullYear(), 
                           now.getMonth(), 
                           now.getDate(), 
                           23, 59, 59);
        setTimeout(()=>{ this._setDailyCard() }, tmw - now + 2000);
    }
}

customElements.define('daily-card', DailyCard);




