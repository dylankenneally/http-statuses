/* Minifies HTML & CSS files, to be used post-build & pre-deployment.
    Run as: `node minify.js <files to minify>`
*/

const fs = require('fs');
const path = require('path');
const minify = require('html-minifier').minify;

const options = {
  caseSensitive: true,
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  decodeEntities: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  // preserveLineBreaks: true, // handy if you need to debug/check the minified output
  processConditionalComments: true,
  removeAttributeQuotes: false,
  removeComments: true,
  removeEmptyAttributes: true,
  // removeOptionalTags: true, // strips end tags of HTML, HEAD, BODY, THEAD, TBODY and TFOOT elements
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: false,
  removeTagWhitespace: false,
  trimCustomFragments: true,
  useShortDoctype: false,
};

const files = process.argv.slice(2);
const results = [];
for (let file of files) {
  const input = fs.readFileSync(file).toString();;
  const output = minify(input, options);
  results.push({
    startSize: input.length,
    endSize: output.length,
  });

  fs.writeFileSync(file, output);
}

const totals = results.reduce((sum, cur) => { return { in: sum.in + cur.startSize, out: sum.out + cur.endSize } }, { in: 0, out: 0 } );
console.log(`${results.length} files minified from ${totals.in} bytes to ${totals.out} bytes (${(100 - ((totals.out / totals.in) * 100)).toFixed(2)}% reduction)`);
