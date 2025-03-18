import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import * as filters from "./filters.js";

export default config => {
	let data = {
		layout: "page.njk",
		permalink: `{{ page.filePathStem | replace("README", "index") }}.html`,
	};

	for (let p in data) {
		config.addGlobalData(p, data[p]);
	}

	for (let f in filters) {
		config.addFilter(f, filters[f]);
	}

	config.amendLibrary("md", md => {
		md.options.typographer = true;
		md.options.linkify = true;
		md.use(markdownItAttrs);
		md.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.headerLink(),
		});
	});

	return {
		markdownTemplateEngine: "njk",
		templateFormats: ["md", "njk"],
		dir: {
			layouts: "_layouts",
			output: ".",
		},
	};
};
