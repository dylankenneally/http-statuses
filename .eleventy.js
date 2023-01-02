require('dotenv').config();
// const markdownIt = require('markdown-it');
// const markdownItSuperscript = require('markdown-it-sup');

module.exports = function(eleventyConfig) {
	// const options = {
	// 	html: true
	// };

	// let md = markdownIt(options);
	// md = md.use(markdownItSuperscript);
	// eleventyConfig.setLibrary('md', md);

	// auto open the browser when we use `npx eleventy --serve` (i.e. when we use `npm start`)
	eleventyConfig.setBrowserSyncConfig({ open: true });

	return {
		dir: {
			input: 'src',
			output: 'build',
		},
		markdownTemplateEngine: 'njk',
		pathPrefix: process.env.HOME_PATH,
	};
};
