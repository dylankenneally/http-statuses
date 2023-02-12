const fs = require('fs');
const markdownIt = require('markdown-it');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

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

  const id = options.id ? ` id="${options.id}"` : '';
  let result =
`<svg class="inline-svg feather-svg"${id}>
  <use xlink:href="#svg-external-link"></use>
</svg>`;

  return result;
}

function googleSVG(id, content) {
  id = id ? ` id=${id}` : '';
  return `<svg viewBox="0 0 24 24" class="google-svg"${id}>${content}</svg>`;
}

function infoSvg(id) {
  return googleSVG(id,
    `<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>`
    );
}

module.exports = (eleventyConfig) => {
  eleventyConfig.setServerOptions({
    /* Use browsersync, not the 11ty dev server. the 11ty dev server has the following problems:
      - DOM diffing and hot reloading are not compatible with client side JS
      - CORS issues with it's use of analytics (console pollution when debugging)
      - doesn't open a browser on start up */
    module: "@11ty/eleventy-server-browsersync",

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

  eleventyConfig.addShortcode('headerSVG', (type) => {
    switch (type) {
      case 'info': return googleSVG('header-img', '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>');
      case 'success': return googleSVG('header-img', '<path d="M22,5.18L10.59,16.6l-4.24-4.24l1.41-1.41l2.83,2.83l10-10L22,5.18z M19.79,10.22C19.92,10.79,20,11.39,20,12 c0,4.42-3.58,8-8,8s-8-3.58-8-8c0-4.42,3.58-8,8-8c1.58,0,3.04,0.46,4.28,1.25l1.44-1.44C16.1,2.67,14.13,2,12,2C6.48,2,2,6.48,2,12 c0,5.52,4.48,10,10,10s10-4.48,10-10c0-1.19-0.22-2.33-0.6-3.39L19.79,10.22z"/>');
      case 'redirect': return googleSVG('header-img', '<path d="M9.78,11.16l-1.42,1.42c-0.68-0.69-1.34-1.58-1.79-2.94l1.94-0.49C8.83,10.04,9.28,10.65,9.78,11.16z M11,6L7,2L3,6h3.02 C6.04,6.81,6.1,7.54,6.21,8.17l1.94-0.49C8.08,7.2,8.03,6.63,8.02,6H11z M21,6l-4-4l-4,4h2.99c-0.1,3.68-1.28,4.75-2.54,5.88 c-0.5,0.44-1.01,0.92-1.45,1.55c-0.34-0.49-0.73-0.88-1.13-1.24L9.46,13.6C10.39,14.45,11,15.14,11,17c0,0,0,0,0,0h0v5h2v-5 c0,0,0,0,0,0c0-2.02,0.71-2.66,1.79-3.63c1.38-1.24,3.08-2.78,3.2-7.37H21z"/>');
      case 'client-error': return googleSVG('header-img', '<path d="M12,7.57l4.42,4.42L12,16.41l-4.42-4.42L12,7.57z M12,19.19l-7.2-7.2l7.2-7.2l6,6V7.16l-4.58-4.58 c-0.78-0.78-2.05-0.78-2.83,0l-8.01,8c-0.78,0.78-0.78,2.05,0,2.83l8.01,8c0.78,0.78,2.05,0.78,2.83,0L18,16.82v-3.63L12,19.19z M20,20h2v2h-2V20z M22,10h-2v8h2V10"/>');
      case 'server-error': return googleSVG('header-img', '<path d="M22,10v8h-2v-8H22z M20,20v2h2v-2H20z M18,17.29C16.53,18.95,14.39,20,12,20c-4.41,0-8-3.59-8-8c0-4.41,3.59-8,8-8v9 l7.55-7.55C17.72,3.34,15.02,2,12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10c2.25,0,4.33-0.74,6-2V17.29z"/>');
      default: throw new Error('Unknown header SVG type');
    }
  });

  eleventyConfig.addShortcode('infoSvg', (id) => googleSVG(id, '<path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>'));

  eleventyConfig.addPlugin(syntaxHighlight);

  return {
    dir,
    markdownTemplateEngine: 'njk',
    pathPrefix: process.env.DEPLOY_PATH
  };
};
