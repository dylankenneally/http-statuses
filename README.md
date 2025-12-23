# HTTP statuses

[![Netlify Status](https://api.netlify.com/api/v1/badges/c9e88fc0-864a-4781-8ff2-1b0b98cc3e21/deploy-status)](https://app.netlify.com/sites/httpstatuses/deploys)

An easy to use reference for HTTP status codes.

This reference has been built so I can experiment with [11ty]. Changes to this repository are automatically deployed as a [Netlify app], hosted on [kenneally.dev].

## To build and run

### Prerequisites

- [Node.js]. Version 24.12.0 has been used during the development of this project.

### Getting the source code

```bash
git clone git@github.com:dylankenneally/http-statuses.git
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
| `npm run minify` | **Minifies the output HTML and CSS** ready for deployment. Called automatically at the end of each build. |

### Build options/environment variables

The following environment variables can be overridden to control the build process.

| Variable | Default | Purpose |
| - | - | - |
| `DEPLOY_PATH` | `/` | The root **deployment directory**.<br><br> By default, the app is built to be deployed in the root directory (`/`) of a given domain/subdomain. If you are deploying to a subdirectory, set the variable to be the name of the subdirectory. |

Default values are stored in the [`.env`] file in the root of the repository.

Note that changes to these variables are not noticed while the development server is running, you will need to restart the dev server via `npm start` to see the updated values.

## Credits

Parts of the copy (text content) is courtesy of [httpstatuses.io]. Other parts of the copy are adapted from the [MDN docs]. The UX for the site is inspired by [Laws of UX] by [Jon Yablonski]. Some imagery is courtesy of [Google Font Icons].

<!-- markdownlint-disable-next-line no-trailing-punctuation -->
## TODO:

Focus on playing with 11ty, make notes on findings.

Add skip to main: <https://web.dev/learn/html/navigation/#skip-to-content-link>

### Snags list

- [ ] SVG's are in the output files multiple times, use `use` instead

### content

- [ ] 404
- [ ] about/info
- [ ] home page, <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>
- [ ] overview of requests & responses model? overview of http as a protocol? NB: this is a reference to status codes, not http, but for context ...?

### features

- [ ] search, quick access

### other

- [ ] mdo's best practices - ensure followed
- [ ] footer, copyright, etc
  - [ ] use <https://11ty.rocks/eleventyjs/dates/> ?
  - [ ] use via an include in the template layout

<!-- Links in this doc -->
[11ty]: https://11ty.dev/
[Netlify app]: https://httpstatuses.netlify.app/
[kenneally.dev]: https://httpstatuses.kenneally.dev/
[Node.js]: https://nodejs.org/en/
[httpstatuses.io]: https://httpstatuses.io/
[MDN docs]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
[Laws of UX]: https://lawsofux.com/
[Jon Yablonski]: https://jonyablonski.com/
[Google Font Icons]: https://fonts.google.com/icons
[`.env`]: ./.env
