const fs = require('fs');
const markdownIt = require('markdown-it');
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

// options, optional obj, { symbol: bool/, id: string }
function externalLinkSvg(options) {
  options = options || { };
  if (options.symbol) {
    return '<svg style="display:none"><symbol id="svg-external-link" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></symbol></svg>';
  }

  const id = options.id ? `id="${options.id}"` : '';
  let result =
`<svg class="inline-svg feather-svg"${id}>
  <use xlink:href="#svg-external-link"></use>
</svg>`;

  return result;
}

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

  const md = markdownIt({ html: true });
  eleventyConfig.addFilter('markdown', (value) => md.render(value));

  eleventyConfig.addShortcode('useSvgExternalLink', () => externalLinkSvg({ symbol: true }));
  eleventyConfig.addShortcode('svgExternalLink', (id) => externalLinkSvg({ id }));

  return {
    dir,
    markdownTemplateEngine: 'njk',
    pathPrefix: process.env.DEPLOY_PATH
  };
};
