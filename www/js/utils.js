
/**
 * Sets attributes on an element.
 * @param {HTMLElement} elm     The element to set attributes on.
 * @param {Object}      attrs   An object of keys and values used to set 
 *                              attributes.
 */
export function setattrs(elm, attrs) {
    for (let key in attrs) {
        elm.setAttribute(key, attrs[key]);
    }
}

/**
 * Creates an element. 'attrs' is an optional argument used to set the 
 * attributes of the newly created element.
 * @param {string}   name     The name of the element to create (e.g. 'div').
 * @param {[Object]} attrs    An object with attributes as keys, and values to
 *                            set them to. Optional.
 * @param {[string]} text     Optional text content to include in the element.
 * @returns {HTMLElement} The created element.
 */
export function ecreate(name, attrs=null, text=null) {
    let elm = document.createElement(name);
    if (attrs !== null) {
        setattrs(elm, attrs);
    }
    if (text !== null) {
        elm.textContent = text;
    }
    return elm;
}

/**
 * Convenience function that uses elm.querySelector() to locate an element.
 * If 'root' isn't provided, 'document' is used as the root for the search.
 * @param {string}        selector   A selector string.
 * @param {[HTMLElement]} root       The element to search.
 * @returns {HTMLElement} The first element that matches the selector.
 */
export function query(selector, root=null) {
    if (root !== null) {
        return root.querySelector(selector);
    } else {
        return document.querySelector(selector);
    }
}

/**
 * Reports whether an object is iterable or not.
 * @param {Object} obj The object to check.
 * @returns {boolean} true if object is iterable, false otherwise.
 */
export function isIterable(obj) {
    return (obj !== null) ? typeof obj[Symbol.iterator] === 'function' : false;
}

/**
 * Attaches a single element or a collection of elements as children to an 
 * element.
 * @param {HTMLElement} elm     The element to attach new child elements to.
 * @param {HTMLElement} child   An HTMLElement, or an iterable holding 
 *                              elements.
 */
export function eappend(elm, child) {
    elm.appendChild(child);
}

/**
 * Adds multiple children to an element.
 * @param {HTMLElement} elm         The element to add multiple children to.
 * @param {Iterable}    children    An iterable containing HTML elements to add.
 */
export function meappend(elm, children) {
    for (let ch of children) {
        elm.appendChild(ch);
    }
}

/**
 * Parses HTML text into a document fragment containing the new elements.
 * @param {string} html The string to parse.
 * @returns {DocumentFragment} A doc fragment containing the elements parsed.
 */
export function meparse(html) {
    let frag      = new DocumentFragment();
    let div       = ecreate('div');
    div.innerHTML = html;
    for (let ch of div.children) {
        frag.appendChild(ch);
    }
    return frag;
}

/**
 * Parses HTML and adds the newly created elements to a root element of type
 * 'name'.
 * @param {string}   html The HTML to parse into elements.
 * @param {[string]} name The type of element that hosts the new elements.
 *                        Defaults to 'div'.
 * @returns {HTMLElement}   A new element of 'name' type hosting newly
 *                          created elements from 'html'.
 */
export function eparse(html, name='div') {
    let elm       = ecreate(name);
    elm.innerHTML = html;
    return elm;
}
