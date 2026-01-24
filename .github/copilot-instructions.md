# Copilot Instructions for http-statuses

## Project Overview
**http-statuses** is a static HTTP status code reference site built with 11ty, displaying explanations and usage for all HTTP status codes (100-599). The site is deployed to Netlify with automated builds.

## Architecture

### Core Build System
- **Generator**: 11ty (Eleventy) - static site generator configured in [.eleventy.js](../.eleventy.js)
- **Build Process**:
  - Dev: `npm start` → clean + eleventy serve (auto-reloads, opens browser)
  - Prod: `npm run build` → clean + eleventy build + minify HTML/CSS
  - Minification script: [scripts/minify.js](../scripts/minify.js) via html-minifier

### Content Structure
- **Status Code Pages**: Each HTTP status code (100, 101, ..., 511) has a markdown file in [src/codes/](../src/codes/) with frontmatter:
  - `code`: numeric status code
  - `name`: short name (e.g., "OK")
  - `title`, `spec`, `overview`: display content
  - `more`: array of related reference links
- **Template**: [src/layouts/code.njk](../src/layouts/code.njk) renders individual status pages
- **Collections**: 11ty collections organize codes by HTTP category (1xx informational, 2xx successful, etc.) via the `codes()` function in .eleventy.js

### Data & Helpers
- [src/data/site.json](../src/data/site.json): Global site metadata
- [src/data/helpers.js](../src/data/helpers.js): Utility functions
- [src/data/strings.js](../src/data/strings.js): UI text/labels
- Special pages: [index.md](../src/index.md), [about.md](../src/about.md), [404.md](../src/404.md)
- Dynamic feeds: [feed.njk](../src/feed.njk), [sitemap.njk](../src/sitemap.njk), [search-index.njk](../src/search-index.njk)

### Deployment & External Tools
- **Netlify**: Triggered on git push; runs `npm run build`, publishes `/build/` directory
- **Environment**: Node.js 24.12.0; Netlify functions in [netlify/functions/](../netlify/functions/) (e.g., deploy-succeeded.js)
- **Lighthouse CI**: Runs via `@netlify/plugin-lighthouse` on pages 208, 206, and homepage
- **Path Prefix**: Respects `DEPLOY_PATH` env var (default `/`) for subdirectory deployments

## Key Developer Workflows

### Adding or Updating a Status Code

1. Edit or create [src/codes/NNN.md](../src/codes/NNN.md) with frontmatter + markdown body
2. Use `{% admonition %}` shortcode for highlighted notes (becomes a styled blockquote)
3. Run `npm start` to preview; changes to markdown auto-reload
4. External links are automatically `target="_blank"` with `rel="nofollow external noopener noreferrer"`

### Building & Testing Locally
```bash
npm install                    # Install dependencies
npm start                      # Dev server with auto-reload (opens browser)
npm run build                  # Production build with minification
npm run minify                 # Manually minify (runs after build automatically)
npm run clean                  # Remove build/ directory
```

### Modifying Markdown/HTML Output
- Markdown parser: `markdown-it` with link attributes plugin
- Syntax highlighting: `@11ty/eleventy-plugin-syntaxhighlight` (prism-based)
- Templating: Nunjucks (.njk files) with markdown-it filters
- Custom filter: `markdown` filter renders markdown to HTML in templates

### Environment Configuration
- Set `DEPLOY_PATH=/subdir/` to deploy to a subdirectory (requires dev server restart)
- `SITEMAP_URL` and `NODE_VERSION` configured in netlify.toml for CI

## Project-Specific Patterns

### Frontmatter Convention
All status code markdown files follow strict frontmatter structure:
```yaml
---
code: 200
name: OK
title: 200 OK
spec: https://...
overview: The request has succeeded.
more:
  - title: Link Title
    from: Source
    url: https://...
---
```
Markdown body follows the frontmatter.

### Admonition Pattern
Use the custom `admonition` shortcode for note boxes:
```nunjucks
{% admonition %}
This is a highlighted note with an info icon.
{% endadmonition %}
```

### Collection Naming
11ty collections are created for HTTP categories:
- `codes` - all codes sorted by number
- `informational` - 1xx codes
- `successful` - 2xx codes
- `redirection` - 3xx codes
- `client error` - 4xx codes
- `server error` - 5xx codes

Access in templates: `collections.successful`, `collections['client error']`, etc.

### Passthrough Copy
CSS, images, and JS in `src/css/`, `src/images/`, `src/js/` are copied to `build/` unchanged and watched for changes.

## Integration Points

### RSS/Sitemap/Search Index
- Feed: Generated from codes collection via [feed.njk](../src/feed.njk)
- Sitemap: [sitemap.njk](../src/sitemap.njk) generates XML for SEO
- Search index: [search-index.njk](../src/search-index.njk) outputs JSON indexed by status code

### Frontend Assets
- [src/css/style.css](../src/css/style.css) - main stylesheet (minified in production)
- [src/js/search.js](../src/js/search.js) - client-side search functionality using search-index.json
- Favicon generation via `eleventy-plugin-gen-favicons`

## Common Tasks

| Task | Command |
|------|---------|
| Start development server | `npm start` |
| Build for production | `npm run build` |
| Clean build artifacts | `npm run clean` |
| Add a new status code page | Create `src/codes/NNN.md` with frontmatter |
| Update site metadata | Edit `src/data/site.json` |
| Modify UI strings | Edit `src/data/strings.js` |

## Important Files Reference
- `.eleventy.js` - Core build config, collections, filters, shortcodes
- `netlify.toml` - Deployment & CI settings
- `package.json` - Scripts and dependencies
- `src/layouts/code.njk` - Template for status code pages
- `src/index.md` - Homepage
- `src/codes/*.md` - Status code content (70+ files)
