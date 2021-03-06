
/**
 * Set Attributes -
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
 * Element Create -
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
 * Query Selector -
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
 * Multi Query -
 * A convenience function that calls .querySelectorAll() on the root (or
 * document, if not provided).
 * @param {string}      selector    A selector expression.
 * @param {HTMLElement} root        The root of the selection.
 * @returns {NodeList}  A node list with the selected elements.
 */
export function mquery(selector, root=null) {
    if (root !== null) {
        return root.querySelectorAll(selector);
    } else {
        return document.querySelectorAll(selector);
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
 * Element Append -
 * Attaches a single element as a child to an element.
 * @param {HTMLElement} elm     The element to attach new child elements to.
 * @param {HTMLElement} child   An HTMLElement, or an iterable holding 
 *                              elements.
 */
export function eappend(elm, child) {
    elm.appendChild(child);
}

/**
 * Multiple Element Append -
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
 * Clear and Append - 
 * Clear the child list of 'elm' , then add 'child' as a child.
 * @param {Node} elm    The element to clear then append to.
 * @param {Node} child  The element to add to 'elm' as a child.
 */
export function cappend(elm, child) {
    chclear(elm);
    elm.appendChild(child);
}

/**
 * Clear Children -
 * Removes children from the node.
 * @param {Node} elm The element to clear of children.
 */
export function chclear(elm) {
    while (elm.firstChild) {
        elm.removeChild(elm.lastChild);
    }
}

/**
 * Element Parse - 
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

/**
 * Multiple Element Parse -
 * Parses HTML text into an array containing the new elements.
 * @param {string} html The string to parse.
 * @returns {HTMLElement[]} An array containing the new elements.
 */
export function meparse(html) {
    let arr       = [];
    let div       = ecreate('div');
    div.innerHTML = html;
    for (let ch of div.children) {
        arr.push(ch);
    }
    return arr;
}

/**
 * Single Element Parse -
 * Parses HTML text and returns the first element within it.
 * @param {string} html The string to parse.
 * @returns {HTMLElement} The first element from the parsed HTML.
 */
export function separse(html) {
    let elm   = eparse(html);
    let child = elm.children[0];
    return child;
}

/**
 * Remove Class - 
 * Remove a class from an element.
 * @param {HTMLElement} elm The element to remove the class from.
 * @param {string}      cls The name of the class to remove.
 */
export function rmclass(elm, cls) {
    elm.classList.remove(cls);
}

/**
 * Add Class - 
 * Add a class to an element.
 * @param {HTMLElement} elm The element to add a class to.
 * @param {string}      cls The class to add.
 */
export function addclass(elm, cls) {
    elm.classList.add(cls);
}
