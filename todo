TODO:
you have css in base.njk:
    1. some of it is specific to code.njk, move it
    2. get it in external CSS files


links
    1. if it's an external link: new tab
       1. open in new tab
       1. indicate it as such with a image showing that it will open in a new tab
            // 
            // Override link render to open all link in a new window
            // md.renderer.rules.link_open = (tokens, idx) => {
            //     var title = tokens[idx].title ? (' title="' + md.utils.escapeHtml(md.utils.replaceEntities(tokens[idx].title)) + '"') : '';
            //     return '<a href="' + md.utils.escapeHtml(tokens[idx].href) + '"' + title + ' target="_blank"> ---';
            // };

content
    not minified
    comments not stripped out
    i18n/l10n
    footnote references - update to latest RFC's
	source - update to latest RFC's
	content - is okay?
    mdo's best practices - ensure followed
    footer, copyright, etc
        - use https://11ty.rocks/eleventyjs/dates/ ?
        - use via an include in the template layout
    meta data for SEO is not present, or social crap

style
	mimic laws of ux
    make pwa too



scrap book
    // const markdownItFootnote = require('markdown-it-footnote');

    /*function setupFootnotes(rules) {
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
    }*/


			{# ol.footnotes-list {
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
			.footnotes-list li:nth-child(10):before { content: "œ. "; } #}
