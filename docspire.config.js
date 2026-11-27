// Cloned by `npm install` (the prepare script)
import theme, { site } from "./.htest/docspire/index.js";

export default {
	...site,
	// A single page has no previous or next page
	pager: false,
	import: {
		"README.md": "index.md",
	},
	plugins: [
		theme,
		config => {
			config.addPassthroughCopy("_headers");

			// The logo leads to the main site: this one documents only the HTML-first mode
			config.addPageTransform(tree => {
				tree.match({ tag: "a", attrs: { class: "logo" } }, node => {
					node.attrs.href = "https://htest.dev/";
					return node;
				});
			});

			// Public URLs other sites load, e.g. https://htest.dev/htest.js imports https://html.htest.dev/src/util.js
			config.addPassthroughCopy("src");

			// Built by TypeDoc (npm run build:apidocs) before Docspire runs
			config.addPassthroughCopy("api");
		},
	],
};
