require('dotenv').config();

const dir = {
	input: 'src',
	output: 'build'
};

module.exports = (eleventyConfig) => {
	// auto open the browser when we use `npx eleventy --serve` (i.e. when we use `npm start`)
	eleventyConfig.setBrowserSyncConfig({ open: true });

	const cssDir = `${dir.input}/css/`;
	eleventyConfig.addPassthroughCopy(cssDir);
	eleventyConfig.addWatchTarget(cssDir);

	return {
		dir,
		markdownTemplateEngine: 'njk',
		pathPrefix: process.env.DEPLOY_PATH,
	};
};
