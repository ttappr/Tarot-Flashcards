
import {} from './utils.js';

const UPDATE_EVENT_TYPE = 'storageupdate';
const DELETE_EVENT_TYPE = 'storagedelete';

/**
 * Persistent Storage - 
 * An object that accesses persistent storage for the application. Instances
 * can be used as a bridge between the components to communicate 
 * application-wide settings - or for other purposes.
 */
class PersistentStorage extends EventTarget {
    constructor() {
        super();
        this._accessor = new Proxy({}, { get: this._get, 
                                         set: this._set,
                                         deleteProperty: this._del });
    }
    get UPDATE_EVENT_TYPE() {
        return UPDATE_EVENT_TYPE;
    }
    get DELETE_EVENT_TYPE() {
        return DELETE_EVENT_TYPE;
    }
    get data() {
        return this._accessor;
    }
    _get(_, key) {
        return window.localStorage.getItem(key);
    }
    _set(_, key, value) {
        window.localStorage.setItem(key, value);

        let opts = { bubbles : false, 
                     detail  : { key   : key, 
                                 value : value }
                    };
        this.dispatchEvent(new CustomEvent(UPDATE_EVENT_TYPE, opts));
    }
    _del(_, key) {
        window.localStorage.removeItem(key);

        let opts = { bubbles : false,
                     detail  : { key    : key }
                    };
        this.dispatchEvent(new CustomEvent(DELETE_EVENT_TYPE, opts));
    }
}

export default new PersistentStorage();
