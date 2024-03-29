const fs = require('fs');
const markdownIt = require('markdown-it');
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const faviconsPlugin = require("eleventy-plugin-gen-favicons");

require('dotenv').config();

// Directories used in this project
const dir = {
  input: 'src',
  output: 'build',

  // sub directories from ./src/
  data: "data",
  includes: "includes",
  layouts: "layouts",
};

// Check there 404 input
const _404input = `${dir.input}/404.md`;
if (!fs.existsSync(_404input)) {
  throw new Error(`Failed to find the input for the 404 page, expected it to be at ${_404input}`);
}

const _404page = `${dir.output}/not-found.html`;

// provide an admonition as a stylised block quote
function admonition(content) {
  return `<blockquote>
    <span class="container">
      <span class="material-symbols-outlined">${fs.readFileSync(`${dir.input}/${dir.includes}/info.svg`)}</span>
      <strong>Note</strong>
    </span>
    ${content}</blockquote>`;
}

// get a sorted collection of code data files (type: undefined (default): all, 1: informational, 2: successful, 3: redirection, 4: client error, 5: server error)
function codes(collection, type) {
  return collection
    .getFilteredByGlob(`${dir.input}/codes/${type || ''}*.md`)
    .sort((a, b) => (Number(a.data.code) < Number(b.data.code) ? -1 : 1));
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

  const externalFilesDirs = [`${dir.input}/css/`, `${dir.input}/images/`];
  externalFilesDirs.forEach((directory) => {
    eleventyConfig.addPassthroughCopy(directory);
    eleventyConfig.addWatchTarget(directory);
  });

  const md = markdownIt({ html: true });
  eleventyConfig.addFilter('markdown', (value) => md.render(value));
  eleventyConfig.addShortcode('admonition', admonition);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(rssPlugin);
  eleventyConfig.addPlugin(faviconsPlugin, { outputDir: dir.output });

  eleventyConfig.addCollection('codes', (collection) => codes(collection));
  eleventyConfig.addCollection('informational', (collection) => codes(collection, 1));
  eleventyConfig.addCollection('successful', (collection) => codes(collection, 2));
  eleventyConfig.addCollection('redirection', (collection) => codes(collection, 3));
  eleventyConfig.addCollection('client error', (collection) => codes(collection, 4));
  eleventyConfig.addCollection('server error', (collection) => codes(collection, 5));

  return {
    dir,
    markdownTemplateEngine: 'njk',
    pathPrefix: process.env.DEPLOY_PATH
  };
};
