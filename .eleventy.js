require('dotenv').config();

module.exports = function(eleventyConfig) {
	// auto open the browser when we use `npx eleventy --serve` (i.e. when we use `npm start`)
	eleventyConfig.setBrowserSyncConfig({ open: true });

	return {
		dir: {
			input: 'src',
			output: 'build',
		},
		markdownTemplateEngine: 'njk',
		pathPrefix: process.env.DEPLOY_PATH,
	};
};
