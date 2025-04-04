/**
 * Built-in comparison functions
 */

import { $$ } from "./util.js";
import { content } from "./content.js";
import * as check from "https://htest.dev/src/check.js";
import * as map from "https://htest.dev/src/map.js";

function compare (cells, map, comparator = (a, b) => a == b) {
	let [test, ref] = cells.slice(-2).map(map);
	return comparator(test, ref);
}

export function contents (...cells) {
	return compare(cells, td => content(td).trim());
}

/**
 * Compare numbers ignoring other stuff around them optionally with epsilon
 */
export function numbers (...cells) {
	let tr = cells[0].parentNode;
	let ε = +tr.closest("[data-epsilon]")?.dataset.epsilon || 0;

	return compare(
		cells,
		td => map.extractNumbers(content(td)),
		check.deep(check.proximity({ epsilon: ε })),
	);
}

export function attribute (attribute, td, ref) {
	return compare([td, ref], td => $$("*", td).map(el => el[attribute]), check.equals);
}

/**
 * Pass or fail when the test matches or doesn't match a given selector
 * @param {*} td
 * @param {*} ref
 * @returns
 */
export function selector (td, ref) {
	if (ref.children.length) {
		// Multiple selectors to test against in a list
		return $$("li", ref).every(li => selector(td, li));
	}
	else {
		let negative = ref.classList.contains("not");
		let has = $$(ref.textContent, td).length;
		return negative ? !has : has;
	}
}

/**
 * Compare the DOM structure of two elements (compares both content and attributes)
 * Previously called `elements`
 */
export function dom (td, ref) {
	let elements = $$("*", td);

	return $$("*", ref).every((refElement, i) => {
		let element = elements[i];

		return (
			element &&
			element.nodeName === refElement.nodeName &&
			refElement.getAttributeNames().every(
				attr => element.getAttribute(attr) === refElement.getAttribute(attr),
			) &&
			content(element).trim() == content(refElement).trim()
		);
	});
}
