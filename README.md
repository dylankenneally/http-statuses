# HTTP statuses

[![Netlify Status](https://api.netlify.com/api/v1/badges/c9e88fc0-864a-4781-8ff2-1b0b98cc3e21/deploy-status)](https://app.netlify.com/sites/httpstatuses/deploys) [![Build & Deploy to GitHub Pages](https://github.com/dylankenneally/http-statuses/actions/workflows/build-and-deploy.yml/badge.svg)](https://github.com/dylankenneally/http-statuses/actions/workflows/build-and-deploy.yml)

An easy to use reference for HTTP status codes.

This reference has been built so I can experiment with [11ty]. Changes to this repository are automatically deployed as a [Netlify app] and to [GitHub pages].

## To build and run

### Prerequisites

- [Node.js]. Version 18 has been used during the development of this project.

### Getting the source code

```bash
git clone https://github.com/dylankenneally/http-statuses.git
cd http-statuses
```

### Install dependencies & start a development server

```bash
npm install
npm start # will auto open your browser with the app in it
```

### Available scripts

The following scripts are available once `npm install` has been ran.
| Script | Action |
| - | - |
| `npm start` | **Starts the development server** and opens your browser with the app in it. `clean` is ran first. |
| `npm run build` | Performs a **production build** of the site/app to `./build/`. `clean` is ran first. |
| `npm run clean` | **Cleans the build directory**, `./build/`, of any prior builds. |

### Build options/environment variables

The following environment variables can be overridden to control the build process.

| Variable | Default | Purpose |
| - | - | - |
| `DEPLOY_PATH` | `/` | The root **deployment directory**.<br><br> By default, the app is built to be deployed in the root directory (`/`) of a given domain/subdomain. If you are deploying to a subdirectory, as is the case with the [GitHub Pages] deployment, set the variable to be the name of the subdirectory. |

Default values are stored in the [`.env`](./.env) file in the root of the repository.

Note that changes to these variables are not noticed while the development server is running, you will need to restart the dev server via `npm start` to see the updated values.

## Credits

Parts of the copy (text content) is courtesy of [httpstatuses.io](https://httpstatuses.io/). The UX for the site is inspired by [Laws of UX](https://lawsofux.com/) by [Jon Yablonski](https://jonyablonski.com/).

## TODO:

Focus on playing with 11ty, make notes on findings.

#### content

- [ ] all status codes; update references to latest RFC's
- [ ] header images for each (abstract shapes/animation/svg)
- [ ] 404
- [ ] about/info
- [ ] home page

#### ux

- [ ] note transition style on laws of ux as you move between 'info' and 'book' (for example)

#### features

- [ ] search, quick access
- [ ] i18n/l10n
- [ ] sitemap
- [ ] rss
- [ ] pwa

#### other

- [ ] external links to open in new tab (see scratch below), indicate with icon too?
- [ ] minifed output (see scratch below)
- [ ] comments not being stripped out of output
- [ ] mdo's best practices - ensure followed
- [ ] meta data for SEO is not present, or social media stuff, favicon etc

- [ ] footer, copyright, etc
  - [ ] use <https://11ty.rocks/eleventyjs/dates/> ?
  - [ ] use via an include in the template layout

#### tech debt

- [ ] css to external file(s)

## scratch pad

Notes on things I've found whilst working with 11ty.

#### External links

Opening links in a new tab, eleventy config:

```js
const markdownIt = require('markdown-it'); // comes with 11ty

module.exports = function(eleventyConfig) {
    const options = { html: true };
    const md = markdownIt(options);

    // Override link render to open all link in a new window
    // todo: untested
    md.renderer.rules.link_open = (tokens, idx) => {
        const title = tokens[idx].title ? (' title="' + md.utils.escapeHtml(md.utils.replaceEntities(tokens[idx].title)) + '"') : '';
        return '<a href="' + md.utils.escapeHtml(tokens[idx].href) + '"' + title + ' target="_blank"> ---';
    };
};
```

#### Superscripts

11ty doesn't support them by default (subscript too?). Install required module:

```bash
npm install --save-dev markdown-it-sup
# todo: subscript module, or does 👆 include it?
```

Update eleventy config to use it:

```js
const markdownIt = require('markdown-it'); // comes with 11ty
const markdownItSuperscript = require('markdown-it-sup');

module.exports = function(eleventyConfig) {
    const options = { html: true };
    let md = markdownIt(options);
    md = md.use(markdownItSuperscript);
    eleventyConfig.setLibrary('md', md);
};
```

#### Footnotes

11ty doesn't support them by default. Install required module:

```bash
npm install --save-dev markdown-it-footnote
```

Update eleventy config to use it:

```js
const markdownItFootnote = require('markdown-it-footnote');

function setupFootnotes(rules) {
    rules.footnote_block_open = (tokens, idx, options, env, renderer) => {
        let result = '<section class="footnotes">\n';
        result += '<h4>References</h4>';
        result += '<hr class="footnotes-sep" />\n';
        result += '<ol class="footnotes-list">\n';
        return result;
    }

    // In content link to the footnote
    const sym = 'œ†¥∑ø∆Ωℷℏ∫';
    const num = '0123456789';
    const caption = rules.footnote_caption;
    rules.footnote_caption = (tokens, idx, options, env, renderer) => {
        let result = caption(tokens, idx, options, env, renderer);

        // Remove the start '[' and end ']' tokens
        console.assert(result[0] === '[');
        console.assert(result[result.length - 1] === ']');
        result = result.substring(1, result.length - 1);

        // Make secondary links to the same footnote have the same caption (i.e. "1:1" => "1")
        const index = result.indexOf(':');
        if (index > 0) {
            result = result.substring(0, index);
        }

        // Replace the boring number with symbols
        for (const i in num) {
            result = result.replaceAll(num[i], sym[i]);
        }

        return result;
    };
}
```

Apply CSS:

```css
ol.footnotes-list {
    list-style: none;
}

.footnote-item > p {
    display: inline;
}

.footnotes h4 { margin-block-end: 0px; }

.footnotes-list li:nth-child(01):before { content: "†. "; }
.footnotes-list li:nth-child(02):before { content: "¥. "; }
.footnotes-list li:nth-child(03):before { content: "∑. "; }
.footnotes-list li:nth-child(04):before { content: "ø. "; }
.footnotes-list li:nth-child(05):before { content: "∆. "; }
.footnotes-list li:nth-child(06):before { content: "Ω. "; }
.footnotes-list li:nth-child(07):before { content: "ℷ. "; }
.footnotes-list li:nth-child(08):before { content: "ℏ. "; }
.footnotes-list li:nth-child(09):before { content: "∫. "; }
.footnotes-list li:nth-child(10):before { content: "œ. "; }
```

<!-- Links in this doc -->
[11ty]: https://11ty.dev/
[Netlify app]: https://httpstatuses.netlify.app/
[GitHub pages]: https://dylankenneally.github.io/http-statuses/
[Node.js]: https://nodejs.org/en/

#### Minify output

<https://www.11ty.dev/docs/config/#transforms>

Update eleventy config:

```js
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
  eleventyConfig.addTransform("htmlmin", function(content) {
    // Prior to Eleventy 2.0: use this.outputPath instead
    if( this.page.outputPath && this.page.outputPath.endsWith(".html") ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
      return minified;
    }

    return content;
  });
};
```
