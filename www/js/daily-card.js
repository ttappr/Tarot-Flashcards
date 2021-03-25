import storage          from './persistent-storage.js';
import html             from './../html/daily-card.html';
import {eappend,
        addclass, 
        chclear,
        query, 
        rmclass,
        separse}        from './utils';
        
import {StaticDeck}     from './card-deck.js';

const STOR_PREFIX       = 'dailycard:';
const STOR_DAILY_CARD   = 'dailycard:card';
const STOR_CURRENT_DATE = 'dailycard:date';

/**
 * @see file://./../html/daily-card.html
 */
export class DailyCard extends HTMLElement {

    /**
     * Sets up the custom element's content. The current card of the day, or
     * a new one (if the day has changed), is presented to the user. A timer
     * is also set to change the card at midnight.
     */
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
        
        this._setDailyCard();
        this._setCardTimer();
    }
    
    /**
     * Updates the page elements and sets the daily card image, title, 
     * and meaning. If there's already an image set - it is removed and the
     * current daily new card is set.
     */
    _setDailyCard() {
        chclear(this._card);
        
        let card = this._getDailyCard();
        this._title.textContent = card.name;
        this._card.appendChild(card.image);
        this._meaning.innerHTML = card.meaning;
        
        if (card.reversed) {
            addclass(this._card, 'card-host--reversed');
        } else {
            rmclass(this._card, 'card-host--reversed');
        }
    }
    
    /**
     * Sets up a timer to change the daily card at midnight.
     */
    _setCardTimer() {
        let now = new Date();
        let tmw = new Date(now.getUTCFullYear(), 
                           now.getMonth(), 
                           now.getDate(), 
                           23, 59, 59);
        setTimeout(() => { this._setDailyCard() }, tmw - now + 2000);
    }
    
    /**
     * Returns the previously selected daily card, or chooses a new one if the
     * day has changed since the last selection.
     */
    _getDailyCard() {
        if (this._isNewDay()) {
            let new_card = this._chooseNewCard();
            storage.data[STOR_CURRENT_DATE] = this._getDate();
            storage.data[STOR_DAILY_CARD  ] = new_card.id;
            return new_card;
        } else {
            let card_id = storage.data[STOR_DAILY_CARD];
            return StaticDeck.getCardByID(card_id);
        }
    }
    
    /**
     * Since the last daily card was picked, has the day changed? Returns true
     * if the day has changed and a new card needs to be drawn.
     */
    _isNewDay() {
        return storage.data[STOR_CURRENT_DATE] !== this._getDate();
    }
    
    /**
     * Randomly selects and returns a new card of the day.
     */
    _chooseNewCard() {
        let card_ids = StaticDeck.cardIDs;
        let rand_idx = Math.floor(Math.random() * card_ids.length);
        return StaticDeck.getCardByID(card_ids[rand_idx]);
    }
    
    /**
     * Returns the current date as a string.
     */
    _getDate() {
        return new Date().toLocaleDateString("en-US");
    }
}

customElements.define('daily-card', DailyCard);




