
import storage      from './persistent-storage.js';
import {eappend, 
        query, 
        separse}    from './utils.js';

import html         from './../html/flashcard-coach.html';

// Local storage keys for persistent data.
const OPT_PREFIX    = 'coachconfig:';
const OPT_CERTAINTY = 'coachconfig:certainty';


/**
 * @see file://./../html/flashcard-coach.html
 */
export class Coach extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        let shadow   = this.shadowRoot;
        let template = separse(html);
        eappend(shadow, template.content.cloneNode(true));

        this._reveal    = query('#reveal',    shadow);
        this._next      = query('#next',      shadow);
        this._progress  = query('#progress',  shadow);
        this._question  = query('#question',  shadow);
        this._certainty = query('#certainty', shadow);
        this._deck      = query('card-deck',  this);

        this._reveal.onclick    = this._onReveal.bind(this);
        this._next.onclick      = this._onNext.bind(this);

        this._next.disabled     = true;
        this._lastCardID        = null;

        this._deck.addEventListener('initialized', () => {
            this._initCertaintyDict();
            this._onNext();
        }, { once: true });
        this._certainty.oninput = this._onCertaintyChange.bind(this);
    }
    _onReveal() {
        this._deck.showBack();
        //this._question.style.visibility = 'hidden';
        this._question.textContent = 'How did you do?';
        
        this._next.disabled = false;
        this._reveal.disabled = true;
        this._certainty.disabled = false;
    }
    _onNext() {
        let ids   = this._deck.filteredCardIDs;
        let certs = ids.map(id => 102 - this._certaintyDict[id]);
        let nids  = ids.length;
        let id    = '';
        let idx   = 0;
        
        do {
            [idx, id] = wchoice(ids, certs);
            
        } while (id === this._lastCardID && nids > 1);
        
        this._lastCardID = id;
        this._deck.showCard(id);
        
        // Set the certainty score to the newly chosen card.
        this._certainty.value = this._certaintyDict[id];
        this._progress.value  = this._getSubsetProgress();
        
        //this._question.style.visibility = 'visible';
        this._question.textContent = 'What is the meaning of this card?';

        this._next.disabled = true;
        this._reveal.disabled = false;
        this._certainty.disabled = true;
    }
    _onCertaintyChange(e) {
        let dict = this._certaintyDict;
        let id   = this._lastCardID;
        let val  = Number.parseInt(e.target.value);
        dict[id] = val;
        this._updateCertaintyDict();
    }
    _initCertaintyDict() {
        let certDict = storage.data[OPT_CERTAINTY];
        if (!certDict) {
            certDict = {};
            for (let id of this._deck.cardIDs) {
                certDict[id] = 0;
            }
            storage.data[OPT_CERTAINTY] = certDict;
        }
        this._certaintyDict = certDict;
    }
    _updateCertaintyDict() {
        storage.data[OPT_CERTAINTY] = this._certaintyDict;
    }
    _getOverallProgress() {
        let ids            = this._deck.cardIDs;
        let dict           = this._certaintyDict;
        let totalPossible  = ids.length * 100;
        let totalCertainty = Object.values(dict).reduce((a, b) => a + b);
        return 100 * (totalCertainty / totalPossible);
    }
    _getSubsetProgress() {
        let ids            = this._deck.filteredCardIDs;
        let dict           = this._certaintyDict;
        let totalPossible  = ids.length * 100;        
        let totalCertainty = ids.map(id => dict[id]).reduce((a, b) => a + b);        
        return 100 * (totalCertainty / totalPossible);
    }
}

/**
 * Randomly selects a member of `population` weighting the probability each 
 * will be selected using `weights`. `accumulated` indicates whether `weights` 
 * is pre-accumulated, in which case it will skip its accumulation step.
 * 
 * @param {Object[]} population    The population to select from.
 * @param {number[]} weights       The weights of the population.
 * @param {boolean}  [accumulated] true if weights are pre-accumulated.
 *                                 Treated as false if not provided.
 * @returns {[number, Object]} An array with the selected member's index and 
 *                             the member itself.
 */
function wchoice(population, weights, accumulated) {
    let acm = (accumulated) ? weights : accumulate(weights);
    let rnd = Math.random() * acm[acm.length - 1];

    let idx = bisect_left(acm, rnd);

    return [idx, population[idx]];
}

/**
 * Finds the left insertion point for `target` in array `arr`. Uses a binary
 * search algorithm.
 * 
 * @param {number[]} arr    A sorted ascending array.
 * @param {number}   target The target value.
 * @returns {number} The index in `arr` where `target` can be inserted to
 *                   preserve the order of the array.
 */
function bisect_left(arr, target) {
    let n = arr.length;
    let l = 0;
    let r = n - 1;
    while (l <= r) {
        let m = Math.floor((l + r) / 2);
        if (arr[m] < target) {
            l = m + 1;
        } else if (arr[m] >= target) {
            r = m - 1;
        } 
    }
    return l;
}

/**
 * Generates an array of accumulated values for `numbers`.
 * e.g.: [1, 5, 2, 1, 5] --> [1, 6, 8, 9, 14]
 * 
 * @param {number[]} numbers The numbers to accumulate.
 * @returns {number[]} An array of accumulated values.
 */
function accumulate(numbers) {
    let accm  = [];
    let total = 0;
    for (let n of numbers) {
        total += n;
        accm.push(total)
    }
    return accm;
}

customElements.define('flashcard-coach', Coach);

















