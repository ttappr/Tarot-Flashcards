
import storage      from './persistent-storage.js';
import html         from './../html/card-deck.html';
import cardData     from './../data/card-data.json';
import {eappend, 
    ecreate, 
        eparse, 
        meappend, 
        meparse,
        query}    from './utils.js';

const OPT_PREFIX    = 'deckconfig:';
const OPT_FILTER    = 'filter:';

const SUITS         = ['Cups', 'Swords', 'Wands', 'Pentacles'];
const SUITS_QUASI   = ['Major Arcana', 'Reversals'];

const DATA_FIELDS   = ['suit', 'value', 'ordinal', 'pic', 
                       'descr', 'meaning', 'reverse'];

/**
 * Represents a flash card in the deck. Essentially a "data class".
 */
export class Card {
    /**
     * Constructs a new card, validating the data used to create it.
     * @param {Object} rec A record/object from the data array produced from 
     *                     the card info JSON file.
     */
    constructor(rec) {
        this._props = verifyJsonData(rec);
        this._major = rec.suit === 'Major Arcana';
        this._name  = this._major ? rec.value : `${rec.value} of ${rec.suit}`;
        this._id    = this._name.replace(/ /g, '_');
        this._ord   = Number.parseInt(rec.ordinal);
    }
    get id()        { return this._id; }
    get name()      { return this._name; }
    get ordinal()   { return this._ord; }
    get suit()      { return this._props.suit; }
    get img()       { return this._props.pic; }
    get meaning()   { return this._props.meaning; }
    get reverse()   { return this._props.reverse; }
    get descr()     { return this._props.descr; }
}

/**
 * Implements the visible HTML elements for the flash card deck. The layout
 * is designed to be responsive - to adapt to the size of the user's screen.
 * The <card-deck-config> from this same module provides the configuration
 * interface to the deck.
 */
export class CardDeck extends HTMLElement {
    /**
     * Creates the HTML elements for display and populates the deck of cards.
     */
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        storage.addEventListener(storage.UPDATE_EVENT_TYPE, 
                                 this._optionsUpdate.bind(this));
        let shadow   = this.shadowRoot;
        let template = meparse(html)[0];
        eappend(shadow, template.content.cloneNode(true));

        this._cards  = [];
        this._dcards = {};
        this._populateDeck();

        this._cardBase = query('#card-base', this.shadowRoot);

        this.showCard('The_Magician');
    }
    /**
     * Populates the deck using the JSON file for card data.
     */
    _populateDeck() {
        for (let record of cardData) {
            let card = new Card(record);
            this._dcards[card.id] = card;
            this._cards.push(card);
        }
    }
    /**
     * Handler for option update events received from the persistent-storage 
     * object.
     * @param {Event} e The option update event.
     */
    _optionsUpdate(e) {
        if (e.detail.key.startsWith(OPT_PREFIX)) {
            let [_, key] = e.detail.key.split(':');
            let val      = e.detail.value;
            switch (key) {
                case OPT_FILTER: break;
            }
        }
    }
    /**
     * Causes the deck to reveal the card with the ID provided. The back of the
     * card won't be displayed until '.showBack()' is called.
     * @param {string} id The ID of the card to show.
     */
    showCard(id) {
        let card    = this.getCardByID(id);
        let img     = ecreate('img', { src: `./../img/${card.img}` });
        let h3      = ecreate('h3', null, card.name);
        let p       = ecreate('p');
        let base    = this._cardBase;
        p.innerHTML = card.meaning;

        base.classList.remove('revealed');
        while (base.firstChild) {
            base.removeChild(base.lastChild);
        }
        meappend(base, [img, h3, p]);
    }
    /**
     * Causes the deck to reveal the back side of the flash card.
     */
    showBack() {
        this._cardBase.classList.add('revealed');
    }
    /**
     * Returns the cards in a newly constructed array.
     * @returns {Card[]} The cards.
     */
    get cards() {
        return [...this._cards];
    }
    /**
     * Returns the Card that has the given ID.
     * @param {string} id The ID of the card to retrieve.
     * @returns {Card} The card.
     */
    getCardByID(id) {
        return this._dcards[id];
    }
}

/**
 * An element that displays the configuration interface for the <card-deck>.
 * An instance of a <card-deck-config> element is included on the Options
 * page of the app. The <card-deck> will receive events for changes in 
 * relevant options through the persistent-storage interface.
 */
export class CardDeckConfig extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let shadow   = this.shadowRoot;
        let template = meparse(html)[1];
        eappend(shadow, template.content.cloneNode(true));
    }
}

/**
 * Verifies all the expected fields are in an object created from JSON data.
 * @param {Object} data An object from the list of objects produced by 
 *                      JSON.parse(<card-data.json text>).
 * @returns The data without throwing an error if everything is OK.
 */
function verifyJsonData(data) {
    for (let field of DATA_FIELDS) {
        if (data[field] === undefined) {
            throw new Error("Field missing in JSON data.");
        }
    }
    return data;
}

customElements.define('card-deck', CardDeck);
customElements.define('card-deck-config', CardDeckConfig);
