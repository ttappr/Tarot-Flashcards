
import storage      from './persistent-storage.js';
import html         from './../html/card-deck.html';
import cardData     from './../data/card-data.json';
import {addclass,
        cappend,
        chclear,
        eappend,
        ecreate,
        eparse,
        meappend,
        meparse,
        mquery,
        query,
        rmclass}    from './utils.js';

const OPT_PREFIX    = 'deckconfig:';
const OPT_INCLUDE   = 'deckconfig:include';
const OPT_RANGE     = 'deckconfig:range';

const SUITS         = ['Cups', 'Swords', 'Wands', 'Pentacles'];
const SUITS_QUASI   = ['Major Arcana', 'Reversals'];

const DATA_FIELDS   = ['suit', 'value', 'ordinal', 'pic', 
                       'descr', 'meaning', 'reverse'];
                       
const DEFAULT_RANGE = {low: 0, high: 21};
const DEFAULT_SUITS = {cups: true, swords: true, wands: true, 
                       pentacles: true, major: true, reversals: true};

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
        this._props   = verifyJsonData(rec);
        this._major   = rec.suit === 'Major Arcana';
        this._name    = this._major ? rec.value : `${rec.value} of ${rec.suit}`;
        this._id      = this._name.replace(/ /g, '_');
        this._ord     = Number.parseInt(rec.ordinal);
        this._rev     = false;
        this._meaning = rec.meaning;
        this._image   = ecreate('img', { class: 'card-face-image', 
                                           src: `./img/${rec.pic}` });
    }
    get id()        { return this._id; }
    get name()      { return this._rev ? this._name+' Reversed' : this._name; }
    get ordinal()   { return this._ord; }
    get suit()      { return this._props.suit; }
    get image()     { return this._image; }
    get meaning()   { return this._meaning; }
    get descr()     { return this._props.descr; }
    get reversed()  { return this._rev; }
    set reversed(b) { 
        if (b !== this._rev) {
            this._rev = b; 
            if (b) {
                addclass(this._image, 'card-face-image--reversed');
                this._meaning = this._props.reverse;
            } else {
                rmclass(this._image, 'card-face-image--reversed');
                this._meaning = this._props.meaning;
            }
        }
    }
    clone() {
        let c = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        c._image = this._image.cloneNode();
        return c;
    }
}

/**
 * StaticDeck is the internal deck used by CardDeck and other classes that
 * need access to the Card objects which hold their Image's and information 
 * about the cards.
 */
export var StaticDeck = {

    _initialized : false, 

    _cards  : [], // List of cards.
    _dcards : {}, // Dict mapping IDs to cards.
    _rcards : {}, // Dict mapping IDs to reverse meanings.

    /**
     * If the _CARDS object variables haven't been initialized yet, this will
     * populate them.
     */
    populateDeck: function() {
        if (!this._initialized) {
            console.info("Initializing card deck.");
            for (let record of cardData) {
                let card = new Card(record);
                this._dcards[card.id] = card;
                this._rcards[card.id + '_reversed'] = card;
                this._cards.push(card);
            }
            this._initialized = true;
        }
    },
    
    /**
     * The array of cards. These are all in the upright position. To get a
     * list of all possible cards upright or reversed, use .cardIDs() to get
     * a list that can be randomly picked from and use the chosen ID with
     * .getCardByID() to access the card in whichever orientation was randomly
     * picked.
     */
    get cards() {
        return [...this._cards];
    },
    
    /**
     * A listing of all the available card IDs, including reversals.
     */
    get cardIDs() {
        return Object.keys(this._dcards).concat(Object.keys(this._rcards));
    },
    
    /**
     * Returns the card in the proper orientation (reversed/not-reversed) given
     * the ID. NOTE: The image returned by the card property .image will need
     * to be rotated via CSS.
     */
    getCardByID: function(id) {
        let card = this._dcards[id];
        if (card) {
            card = card.clone();
            card.reversed = false;
        } else {
            card = this._rcards[id].clone();
            card.reversed = true;
            card._id = card._id + '_reversed';
        }
        return card;
    },
};

/**
 * Initialize the static deck.
 */
StaticDeck.populateDeck();
        
/**
 * Implements the visible HTML elements for the flash card deck. The layout
 * is designed to be responsive - to adapt to the size of the user's screen.
 * The <card-deck-config> from this same module provides the configuration
 * interface to the deck.
 * @see file://./../html/card-deck.html
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

        this._deckFrame       = query('.frame',            shadow);
        this._cardFaceHostElm = query('.card-face-host',   shadow);
        this._cardNameElm     = query('.card-name',        shadow);
        this._cardMeaningElm  = query('.card-meaning',     shadow);

        this._filter = {include: storage.data[OPT_INCLUDE] || DEFAULT_SUITS, 
                          range: storage.data[OPT_RANGE  ] || DEFAULT_RANGE};

        this._filteredCardIDs = this._filterIDs();

        this.dispatchEvent(new CustomEvent('initialized', { detail: null }));
    }

    /**
     * Handler for option update events received from the persistent-storage 
     * object.
     * @param {Event} e The option update event.
     */
    _optionsUpdate(e) {
        if (e.detail.key.startsWith(OPT_PREFIX)) {
            let key = e.detail.key;
            let val = e.detail.value;
            switch (key) {
                case OPT_INCLUDE:
                    this._filter.include = val;
                    break;
                case OPT_RANGE:
                    this._filter.range = val;
                    break;
            }
            this._filteredCardIDs = this._filterIDs();
        }
    }
    /**
     * Causes the deck to reveal the card with the ID provided. The back of the
     * card won't be displayed until '.showBack()' is called.
     * @param {string} id The ID of the card to show.
     */
    showCard(id) {
        let card   = StaticDeck.getCardByID(id);
        let img    = card.image;

        cappend(this._cardFaceHostElm, img);
        
        rmclass(this._deckFrame, 'frame--reveal-info');

        this._cardNameElm.innerHTML    = card.name;
        this._cardMeaningElm.innerHTML = card.meaning;
    }
    /**
     * Causes the deck to reveal the back side of the flash card.
     */
    showBack() {
        addclass(this._deckFrame, 'frame--reveal-info');
    }
    /**
     * Returns the cards in a newly constructed array.
     * @returns {Card[]} The cards.
     */
    get cards() {
        return StaticDeck.cards;
    }
    get cardIDs() {
        return StaticDeck.cardIDs;
    }
    get filteredCardIDs() {
        return this._filteredCardIDs;
    }
    _filterIDs() {
        let ids   = [];
        let range = this._filter.range;
        let incl  = this._filter.include;
        for (let card of StaticDeck._cards) {
            let suit = card.suit.toLowerCase().split(' ')[0];
            let ord  = card.ordinal;
            if ((range === null || (range.low <= ord && ord <= range.high)) &&
                 (incl === null || incl[suit])) {
                    ids.push(card.id);
            }
        }
        if (incl.reversals) {
            ids = ids.concat(ids.map(id => id + '_reversed'));
        }
        return ids;
    }
}

/**
 * An element that displays the configuration interface for the <card-deck>.
 * An instance of a <card-deck-config> element is included on the Options
 * page of the app. The <card-deck> will receive events for changes in 
 * relevant options through the persistent-storage interface.
 * @see file://./../html/card-deck.html
 */
export class CardDeckConfig extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let shadow   = this.shadowRoot;
        let template = meparse(html)[1];
        eappend(shadow, template.content.cloneNode(true));
        this._text   = query('.range-value', shadow);
        this._ddown  = query('.range-dropdown', shadow);
        this._table  = query('.range-dropdown-table', shadow);
        
        this._range  = DEFAULT_RANGE;
        this._incl   = DEFAULT_SUITS;

        let rows     = mquery('tr', this._table);
        let cboxes   = mquery('input[type=checkbox]', shadow);

        // Connect listeners to the range controls.
        this._rows = [];
        for (let i = 1; i < rows.length; i++) {
            this._rows.push(rows[i]);
            rows[i].onclick = this._onRowSelect.bind(this);
        }

        // Connect checkbox listeners.
        this._cboxes = {};
        for (let cb of cboxes) {
            this._cboxes[cb.value] = cb;
            cb.onclick = this._onIncludeClick.bind(this);
        }

        this._numCBoxesChecked = 0;
        this._loadOptions();

        // Set up a listener that detects resize events on the document and
        // text box that shows the range summary.
        let rso = new ResizeObserver(this._rangeDDSizer.bind(this));
        rso.observe(document.body);
        rso.observe(this._text);
    }
    /**
     * Range dropdown sizer.
     * Callback for the ResizeObserver used to determine when the dropdown
     * list of cards needs to be sized to fit within the screen despite its
     * orientation. 
     */
    _rangeDDSizer() {
        let txrec = this._text.getBoundingClientRect();
        let bdrec = document.body.getBoundingClientRect();
        let hddwn = bdrec.height - txrec.bottom - 20 + 'px';
        let wddwn = txrec.width + 'px';
        
        this._ddown.style.width         = wddwn;
        this._ddown.style['max-height'] = hddwn;
    }
    /**
     * Loads the range and include data from persistent storage. This data is
     * used to check the checkboxes and configure the range controls.
     */
    _loadOptions() {
        let include = storage.data[OPT_INCLUDE] || this._incl;
        let range   = storage.data[OPT_RANGE]   || this._range;
        
        for (let [key, val] of Object.entries(include)) {
            this._cboxes[key].checked = val;
            if (val && key !== 'reversals') {
                this._numCBoxesChecked++;
            }
        }
        this._selectRangeRows(range.low, range.high);
        this._incl  = include;
        this._range = range;
        this._updateRangeAvailability();
    }
    /**
     * Click callback registered with the include checkboxes.
     * @param {Event} e Click event.
     */
    _onIncludeClick(e) {
        let cbox   = e.target;
        let cbname = cbox.value;
        let cbval  = cbox.checked;
        let ncheck = this._numCBoxesChecked;
        if (cbname != 'reversals') {
            ncheck += cbval ? 1 : -1;
        }
        if (ncheck === 0) {
            cbox.checked = true;
            cbval = true;
            ncheck = 1;
            window.alert("At least one checkbox (other than Reversals) must " + 
                         "be checked.");
        }
        this._incl[cbname] = cbval;
        storage.data[OPT_INCLUDE] = this._incl;
        this._numCBoxesChecked = ncheck;
       
        this._updateRangeAvailability();
        let low  = this._range.low;
        let high = this._range.high;
        this._clearRangeTable();
        this._selectRangeRows(low, high);
    }

    /**
     * Updates the dropdown list to indicate which cards are not available
     * given the suits chosen. This is done by adding a 'not-available' class
     * to class lists of elements - a CSS rule styles them.
     */
    _updateRangeAvailability() {
        let major = this._majorAvailable;
        let minor = this._minorAvailable;
        let i = 0;
        for (let row of this._rows) {
            // The 3 child elements are ordinal card value, corresponding minor
            // card name, corresponding major name; e.g.,
            // `[12, 'Knight', 'Hanged Man']`
            let [ord, min, maj] = row.children;
            if (major) {
                maj.classList.remove('not-available');
                if (i < 1 || i > 14) {
                    ord.classList.remove('not-available');
                }
            } else {
                maj.classList.add('not-available');
                if (i < 1 || i > 14) {
                    ord.classList.add('not-available');
                }
            }
            if (minor) {
                min.classList.remove('not-available');
            } else {
                min.classList.add('not-available');
            }
            i++;
        }
        let [ord, min, maj] = mquery('th', this._table);
        if (major) {
            maj.classList.remove('header-not-available');
        } else {
            maj.classList.add('header-not-available');
        }
        if (minor) {
            min.classList.remove('header-not-available');
        } else {
            min.classList.add('header-not-available');
        }
        this._text.innerHTML = this._createRangeText();
    }

    /**
     * true if one of the minor suits' checkboxes are checked, false otherwise.
     */
    get _minorAvailable() {
        let incl = this._incl;
        return incl.cups || incl.swords || incl.wands || incl.pentacles;
    }

    /**
     * true if the major arcana checkbox is checked, false otherwise.
     */
    get _majorAvailable() {
        return this._incl.major;
    }

    /**
     * Callback invoked when a row in the range dropdown is clicked. Updates the
     * selected range.
     */
    _onRowSelect(e) {
        let row   = e.currentTarget;
        let range = this._range;
        let ord   = Number.parseInt(row.getAttribute('data-ordinal'));
        if (!this._majorAvailable && (ord < 1 || ord > 14)) {
            return;
        }
        if (range.high === -1) {
            this._selectRangeRows(ord, ord)
        } else if (range.low == range.high) {
            this._selectRangeRows(range.low, ord);
        } else {
            this._clearRangeTable();
            this._selectRangeRows(ord, ord);
        }
    }

    /**
     * Deselects all rows in the range dropdown list's table. Removes the
     * 'selected' class from each row element.
     */
    _clearRangeTable() {
        let range = this._range;
        let rows  = this._rows;
        for (let i = range.low; i <= range.high; i++) {
            rows[i].classList.remove('selected');
        }
        range.low  = -1;
        range.high = -1;
    }

    /**
     * Updates the range dropdown list by adding the 'selected' class to the
     * row elements. The start and end indices are inclusive. Updates
     * persistent storage OPT_RANGE value.
     * @param {number} start The start index of the selected range.
     * @param {number} end   The end index of the selected range.
     */
    _selectRangeRows(start, end) {
        let low  = Math.min(start, end);
        let high = Math.max(start, end);
        
        if (!this._majorAvailable) {
            if (low < 1) {
                low = 1;
            }
            if (high < 1) {
                high = 1;
            }
            if (low > 14) {
                low = 14;
            }
            if (high > 14) {
                high = 14;
            }
        }

        for (let i = low; i <= high; i++) {
            this._rows[i].classList.add('selected');
        }
        this._range.low  = low;
        this._range.high = high;        
        this._text.innerHTML = this._createRangeText();

        storage.data[OPT_RANGE] = this._range;
    }

    /**
     * Creates the text displayed by the range element. The text is a brief
     * description of what's selected in the dropdown.
     */
    _createRangeText() {
        let loTxt = this._getRowText(this._rows[this._range.low ]);
        let hiTxt = this._getRowText(this._rows[this._range.high]);
        if (loTxt !== hiTxt) {
            return `${loTxt} <b>to</b> ${hiTxt}`;
        } else {
            return `${loTxt}`;
        }
    }

    /**
     * Forms the text for either the range's start or end using row elements
     * to extract info from.
     * @param {HTMLElement} row The row to extract text from.
     */
    _getRowText(row) {
        let a = [];
        let ch = row.children;
        for (let i = 0; i < 3; i++) {
            let t = ch[i].textContent.trim();
            if (t !== '' && ((i == 1 && this._minorAvailable) || 
                             (i == 2 && this._majorAvailable) ||
                             (i == 0))) {
                a.push(t);
            }
        }
        return `<b>${a[0]}</b> ` +
               `<i>(${a.slice(1).join(', ')})</i>`;
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
