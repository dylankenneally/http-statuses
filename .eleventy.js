const fs = require('fs');
require('dotenv').config();

const dir = {
	input: 'src',
	output: 'build'
};

// Check there 404 input
const _404input = `${dir.input}/404.md`;
if (!fs.existsSync(_404input)) {
	throw new Error(`Failed to find the input for the 404 page, expected it to be at ${_404input}`);
}

const _404page = `${dir.output}/404.html`;

module.exports = (eleventyConfig) => {
	eleventyConfig.setBrowserSyncConfig({
		// auto open the browser when we use `npx eleventy --serve` (i.e. when we use `npm start`)
		open: true,

		// Add 404 support to browser sync
		callbacks: {
			ready: (err, bs) => {
				bs.addMiddleware('*', (req, res) => {
					if (!fs.existsSync(_404page)) {
						throw new Error(`Failed to find the 404 page, expected it to be at ${_404page}`);
					}

					res.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
					res.write(fs.readFileSync(_404page));
					res.end();
				});
			}
		}
	});

	const cssDir = `${dir.input}/css/`;
	eleventyConfig.addPassthroughCopy(cssDir);
	eleventyConfig.addWatchTarget(cssDir);

	return {
		dir,
		markdownTemplateEngine: 'njk',
		pathPrefix: process.env.DEPLOY_PATH
	};
};
