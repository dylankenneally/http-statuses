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

Parts of the copy (text content) is courtesy of [httpstatuses.io](https://httpstatuses.io/). Other parts of the copy are adapted from the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status). The UX for the site is inspired by [Laws of UX](https://lawsofux.com/) by [Jon Yablonski](https://jonyablonski.com/). Some imagery is courtesy of [Feather Icons](https://feathericons.com/).

## TODO:

Focus on playing with 11ty, make notes on findings.

#### content

- [ ] all status codes; update references to latest RFC's
- [ ] header images for each (abstract shapes/animation/svg)
- [ ] 404
- [ ] about/info
- [ ] home page
- [ ] overview of requests & responses model? overview of http as a protocol? NB: this is a reference to status codes, not http, but for context ...?
- [ ] related codes (bottom of codes.njk)

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
- [ ] webpack/bundle
- [ ] comments not being stripped out of output
- [ ] mdo's best practices - ensure followed
- [ ] meta data for SEO is not present, or social media stuff, favicon etc
- [ ] footer, copyright, etc
  - [ ] use <https://11ty.rocks/eleventyjs/dates/> ?
  - [ ] use via an include in the template layout
- [ ] robots.txt
- [ ] include 'published'/'authored' date, maybe "updated" too

#### tech debt

- [x] empty

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

#### SVG's

        <div style="display: none">
            <svg>
                {# <defs/> #}
                <symbol id="arrow-down" viewBox="0 0 21 21">
                    <title>down arrow</title>
                    <path d="M20.933 10.441l-1.761-1.762-6.99 6.975.001-15.212h-2.5l-.001 15.212-6.988-6.975-1.761 1.762 10 9.999z"/>
                </symbol>
                <symbol id="arrow-drop-down" viewBox="0 0 24 24">
                    <title>drop down arrow</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 10l5 5 5-5z"/>
                </symbol>
                <symbol id="arrow-drop-up" viewBox="0 0 24 24">
                    <title>drop up arrow</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 14l5-5 5 5z"/>
                </symbol>
                <symbol id="arrow-left" viewBox="0 0 21 21">
                    <title>left arrow</title>
                    <path d="M10.067 20.559l1.762-1.761-6.975-6.99 15.212.001v-2.5L4.854 9.308l6.975-6.988L10.067.559l-9.999 10z" fill-rule="nonzero"/>
                </symbol>
                <symbol id="arrow-right" viewBox="0 0 21 21">
                    <title>right arrow</title>
                    <path d="M10.067.559 8.305 2.32l6.975 6.99L.068 9.309v2.5l15.212.001-6.975 6.988 1.762 1.761 9.999-10z" fill-rule="nonzero"/>
                </symbol>
                <symbol id="arrow-up" viewBox="0 0 21 21">
                    <title>up arrow</title>
                    <path d="M0 12l2.115 2.115 8.385-8.37V24h3V5.745l8.385 8.37L24 12 12 0z" fill-rule="nonzero"/>
                </symbol>
                <symbol id="close" viewBox="0 0 24 24">
                    <title>close</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </symbol>
                <symbol id="download" viewBox="0 0 24 24">
                    <title>download</title>
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </symbol>
                <symbol id="external-link" viewBox="0 0 16 16">
                    <title>External link</title>
                    <path d="M.929.929V3.42l9.873.01L.045 14.186l1.768 1.768L12.57 5.198l.009 9.873h2.492V.93z"/>
                </symbol>
                <symbol id="facebook" viewBox="0 0 32 32">
                    <title>facebook</title>
                    <path d="M18 32h-6V16H8v-5.51h4V7.24C12 2.74 13.21.0 18.51.0h4.41v5.51h-2.75c-2.07.0-2.17.77-2.17 2.21v2.76h5L22.37 16H18v16z"/>
                </symbol>
                <symbol id="filter" viewBox="0 0 24 24">
                    <title>Filter</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </symbol>
                <symbol id="grid" viewBox="0 0 100 125">
                    <title>grid</title>
                    <path d="M12.5 33.5h20a1 1 0 001-1v-20a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zm27.5.0h20a1 1 0 001-1v-20a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1v-20a1 1 0 00-1-1zM12.5 61h20a1 1 0 001-1V40a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zM40 61h20a1 1 0 001-1V40a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1V40a1 1 0 00-1-1zm-75 49.5h20a1 1 0 001-1v-20a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zm27.5.0h20a1 1 0 001-1v-20a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1v-20a1 1 0 00-1-1z"/>
                </symbol>
                <symbol id="language" viewBox="0 0 24 24">
                    <title>language</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                </symbol>
                <symbol id="linkedin" viewBox="0 0 430.117 430.117">
                    <title>LinkedIn</title>
                    <path d="M430.117 261.543V420.56h-92.188V272.193c0-37.271-13.334-62.707-46.703-62.707-25.473.0-40.632 17.142-47.301 33.724-2.432 5.928-3.058 14.179-3.058 22.477V420.56h-92.219s1.242-251.285.0-277.32h92.21v39.309c-.187.294-.43.611-.606.896h.606v-.896c12.251-18.869 34.13-45.824 83.102-45.824 60.673-.001 106.157 39.636 106.157 124.818zM52.183 9.558C20.635 9.558.0 30.251.0 57.463c0 26.619 20.038 47.94 50.959 47.94h.616c32.159.0 52.159-21.317 52.159-47.94-.606-27.212-20-47.905-51.551-47.905zM5.477 420.56h92.184V143.24H5.477v277.32z"/>
                </symbol>
                <symbol id="logo" viewBox="0 0 40 40">
                    <title>logo</title>
                    <path d="M20 38c9.941.0 18-8.059 18-18S29.941 2 20 2 2 10.059 2 20s8.059 18 18 18zm0 2C8.954 40 0 31.046.0 20S8.954.0 20 0s20 8.954 20 20-8.954 20-20 20z"/>
                    <path d="M7.854 7.854v24.292h24.292V7.854H7.854zm-2-2h28.292v28.292H5.854V5.854z"/>
                    <path d="M20 10.326 9.09 32.146h21.82L20 10.326zm0-4.472 14.146 28.292H5.854L20 5.854z"/>
                </symbol>
                <symbol id="menu" viewBox="0 0 24 24">
                    <title>menu</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </symbol>
                <symbol id="notification" viewBox="0 0 24 24">
                    <title>notification</title>
                    <path d="M12 22c1.1.0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </symbol>
                <symbol id="pinterest" viewBox="0 0 20 20">
                    <title>Pinterest</title>
                    <path d="M8.617 13.227C8.091 15.981 7.45 18.621 5.549 20c-.586-4.162.861-7.287 1.534-10.605-1.147-1.93.138-5.812 2.555-4.855 2.975 1.176-2.576 7.172 1.15 7.922 3.891.781 5.479-6.75 3.066-9.199C10.369-.275 3.708 3.18 4.528 8.245c.199 1.238 1.478 1.613.511 3.322-2.231-.494-2.897-2.254-2.811-4.6.138-3.84 3.449-6.527 6.771-6.9 4.201-.471 8.144 1.543 8.689 5.494.613 4.461-1.896 9.293-6.389 8.945-1.218-.095-1.728-.699-2.682-1.279z"/>
                </symbol>
                <symbol id="share" viewBox="0 0 24 27">
                    <title>share</title>
                    <path d="M20 18.773c-1.013.0-1.92.4-2.613 1.027L7.88 14.267c.067-.307.12-.614.12-.934.0-.32-.053-.626-.12-.933l9.4-5.48A3.983 3.983.0 0020 8c2.213.0 4-1.787 4-4s-1.787-4-4-4-4 1.787-4 4c0 .32.053.627.12.933l-9.4 5.48A3.983 3.983.0 004 9.333c-2.213.0-4 1.787-4 4 0 2.214 1.787 4 4 4 1.053.0 2-.413 2.72-1.08l9.493 5.547c-.066.28-.106.573-.106.867A3.898 3.898.0 0020 26.56a3.898 3.898.0 003.893-3.893A3.898 3.898.0 0020 18.773z"/>
                </symbol>
                <symbol id="twitter" viewBox="0 0 32 32">
                    <title>twitter</title>
                    <path d="M32 6.08a13.14 13.14.0 01-3.77 1 6.59 6.59.0 002.89-3.63 13.15 13.15.0 01-4.17 1.59 6.57 6.57.0 00-11.19 6A18.64 18.64.0 012.23 4.2a6.57 6.57.0 002 8.77 6.54 6.54.0 01-3-.82v.08a6.57 6.57.0 005.27 6.44 6.58 6.58.0 01-3 .11 6.57 6.57.0 006.13 4.56 13.17 13.17.0 01-8.15 2.81 13.28 13.28.0 01-1.48-.1 18.58 18.58.0 0010.06 3c12.08.0 18.68-10 18.68-18.68v-.85A13.35 13.35.0 0032 6.08z"/>
                </symbol>
            </svg>
        </div>

		icon set
			<div class="icons">
                <svg viewBox="0 0 22 22" class="icon2">
                    <title>down arrow</title>
                    <path d="M20.933 10.441l-1.761-1.762-6.99 6.975.001-15.212h-2.5l-.001 15.212-6.988-6.975-1.761 1.762 10 9.999z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon2">
                    <title>drop down arrow</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 10l5 5 5-5z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>drop up arrow</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M7 14l5-5 5 5z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>left arrow</title>
                    <path d="M10.067 20.559l1.762-1.761-6.975-6.99 15.212.001v-2.5L4.854 9.308l6.975-6.988L10.067.559l-9.999 10z" fill-rule="nonzero"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>right arrow</title>
                    <path d="M10.067.559 8.305 2.32l6.975 6.99L.068 9.309v2.5l15.212.001-6.975 6.988 1.762 1.761 9.999-10z" fill-rule="nonzero"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>up arrow</title>
                    <path d="M0 12l2.115 2.115 8.385-8.37V24h3V5.745l8.385 8.37L24 12 12 0z" fill-rule="nonzero"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>close</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>download</title>
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    <path d="M0 0h24v24H0z" fill="none"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>External link</title>
                    <path d="M.929.929V3.42l9.873.01L.045 14.186l1.768 1.768L12.57 5.198l.009 9.873h2.492V.93z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>facebook</title>
                    <path d="M18 32h-6V16H8v-5.51h4V7.24C12 2.74 13.21.0 18.51.0h4.41v5.51h-2.75c-2.07.0-2.17.77-2.17 2.21v2.76h5L22.37 16H18v16z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>Filter</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </svg>
                <svg viewBox="0 0 100 100" class="icon">
                    <title>grid</title>
                    <path d="M12.5 33.5h20a1 1 0 001-1v-20a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zm27.5.0h20a1 1 0 001-1v-20a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1v-20a1 1 0 00-1-1zM12.5 61h20a1 1 0 001-1V40a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zM40 61h20a1 1 0 001-1V40a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1V40a1 1 0 00-1-1zm-75 49.5h20a1 1 0 001-1v-20a1 1 0 00-1-1h-20a1 1 0 00-1 1v20a1 1 0 001 1zm27.5.0h20a1 1 0 001-1v-20a1 1 0 00-1-1H40a1 1 0 00-1 1v20a1 1 0 001 1zm47.5-22h-20a1 1 0 00-1 1v20a1 1 0 001 1h20a1 1 0 001-1v-20a1 1 0 00-1-1z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>language</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                </svg>
                <svg viewBox="0 0 430.117 430.117" class="icon">
                    <title>LinkedIn</title>
                    <path d="M430.117 261.543V420.56h-92.188V272.193c0-37.271-13.334-62.707-46.703-62.707-25.473.0-40.632 17.142-47.301 33.724-2.432 5.928-3.058 14.179-3.058 22.477V420.56h-92.219s1.242-251.285.0-277.32h92.21v39.309c-.187.294-.43.611-.606.896h.606v-.896c12.251-18.869 34.13-45.824 83.102-45.824 60.673-.001 106.157 39.636 106.157 124.818zM52.183 9.558C20.635 9.558.0 30.251.0 57.463c0 26.619 20.038 47.94 50.959 47.94h.616c32.159.0 52.159-21.317 52.159-47.94-.606-27.212-20-47.905-51.551-47.905zM5.477 420.56h92.184V143.24H5.477v277.32z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>menu</title>
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                </svg>
                <svg viewBox="0 0 24 24" class="icon">
                    <title>notification</title>
                    <path d="M12 22c1.1.0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                <svg viewBox="0 0 20 20" class="icon">
                    <title>Pinterest</title>
                    <path d="M8.617 13.227C8.091 15.981 7.45 18.621 5.549 20c-.586-4.162.861-7.287 1.534-10.605-1.147-1.93.138-5.812 2.555-4.855 2.975 1.176-2.576 7.172 1.15 7.922 3.891.781 5.479-6.75 3.066-9.199C10.369-.275 3.708 3.18 4.528 8.245c.199 1.238 1.478 1.613.511 3.322-2.231-.494-2.897-2.254-2.811-4.6.138-3.84 3.449-6.527 6.771-6.9 4.201-.471 8.144 1.543 8.689 5.494.613 4.461-1.896 9.293-6.389 8.945-1.218-.095-1.728-.699-2.682-1.279z"/>
                </svg>
                <svg viewBox="0 0 28 28" class="icon">
                    <title>share</title>
                    <path d="M20 18.773c-1.013.0-1.92.4-2.613 1.027L7.88 14.267c.067-.307.12-.614.12-.934.0-.32-.053-.626-.12-.933l9.4-5.48A3.983 3.983.0 0020 8c2.213.0 4-1.787 4-4s-1.787-4-4-4-4 1.787-4 4c0 .32.053.627.12.933l-9.4 5.48A3.983 3.983.0 004 9.333c-2.213.0-4 1.787-4 4 0 2.214 1.787 4 4 4 1.053.0 2-.413 2.72-1.08l9.493 5.547c-.066.28-.106.573-.106.867A3.898 3.898.0 0020 26.56a3.898 3.898.0 003.893-3.893A3.898 3.898.0 0020 18.773z"/>
                </svg>
                <svg viewBox="0 0 32 32" class="icon">
                    <title>twitter</title>
                    <path d="M32 6.08a13.14 13.14.0 01-3.77 1 6.59 6.59.0 002.89-3.63 13.15 13.15.0 01-4.17 1.59 6.57 6.57.0 00-11.19 6A18.64 18.64.0 012.23 4.2a6.57 6.57.0 002 8.77 6.54 6.54.0 01-3-.82v.08a6.57 6.57.0 005.27 6.44 6.58 6.58.0 01-3 .11 6.57 6.57.0 006.13 4.56 13.17 13.17.0 01-8.15 2.81 13.28 13.28.0 01-1.48-.1 18.58 18.58.0 0010.06 3c12.08.0 18.68-10 18.68-18.68v-.85A13.35 13.35.0 0032 6.08z"/>
                </svg>
			</div>
