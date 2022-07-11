/**
 * A module with HTMLElement helper functions
 */

/**
 * Creates a new document element
 * @param {string} tagName Name of the tag. Eg. 'div'.
 * @param {object=} opt Options
 * @param {string} [opt.className] Class name or space separated class names.
 * @param {Object.<string, string>} [opt.attributes] Attributes object where key is the attribute name and value is the attribute value.
 * @param {Object.<string, function>} [opt.events] Events object where key is the event name and value is the event callback.
 * @param {Array.<HTMLElement>} [opt.children] Array of child elements to append.
 * @param {string} [opt.text] Text content. Ignored if children is set.
 * @returns {HTMLElement} Created document element.
 */
export let create = function (tagName, opt) {
	let el = document.createElement(tagName);

	if (opt) {
		let o = opt.attributes;
		if (o) {
			for (let key in o) {
				if (o.hasOwnProperty(key)) {
					el.setAttribute(key, o[key]);
				}
			}
		}

		o = opt.className;
		if (o) {
			el.className = o;
		}

		o = opt.events;
		if (o) {
			for (let key in o) {
				if (o.hasOwnProperty(key)) {
					el.addEventListener(key, o[key]);
				}
			}
		}

		o = opt.children;
		if (o) {
			for (var i = 0; i < o.length; i++) {
				el.appendChild(o[i]);
			}
		} else if (opt.text) {
			el.textContent = opt.text;
		}
	}

	return el;
};

/**
 * Appends a child to a parent element
 * @param {?HTMLElement} parent Parent element. If null or undefined, nothing will be performed.
 * @param {?HTMLElement} child Child element. If null or undefined, nothing will be performed.
 * @returns {?HTMLElement} The appended child.
 */
export let append = function(parent, child) {
	if (!parent || !child) {
		return child || null;
	}
	return parent.appendChild(child);
};

/**
 * Removes an element from the parent element
 * @param {?HTMLElement} child Child element. If null or undefined, nothing will be performed.
 * @param {object=} opt Options
 * @param {Object.<string, function>} [opt.events] Events object previously used when creating the element. By calling removeEventListener, memory leaks can be prevented on older browsers.
 * @returns {?HTMLElement} Child element.
 */
export let remove = function(child, opt) {
	if (!child) {
		return null;
	}

	if (opt) {
		let o = opt.events;
		if (o) {
			for (let key in o) {
				if (o.hasOwnProperty(key)) {
					el.removeEventListener(key, o[key]);
				}
			}
		}
	}

	if (!child.parentNode) {
		return child;
	}

	return child.parentNode.removeChild(child);
};

/**
 * Empties an element of all child nodes.
 * @param {?HTMLElement} element Element
 * @returns {?HTMLElement} Element.
 */
export let empty = function(element) {
	if (!element) {
		return element || null;
	}
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
	return element;
};
