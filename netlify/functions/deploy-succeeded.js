const contextCondition = "production";
const stateCondition = "ready";
const sitemapUrl = process.env.SITEMAP_URL;

const axios = require("axios");

exports.handler = async (event) => {
  console.log('Running post deployment script: Submitting sitemap to Google');
  if (!sitemapUrl) {
    const noSitemap = 'The sitemap URL is missing, no sitemap will be submitted';
    console.error(noSitemap);
    return {
      statusCode: 400, /* bad request */
      body: noSitemap
    };
  }

  try {
    const { payload } = JSON.parse(event.body);
    const { state, context } = payload;

    if (state !== stateCondition || context !== contextCondition) {
      const invalidContext = `State and/or context mismatched. Required: { state: ${stateCondition}, context: ${contextCondition} }, current: { state: ${state}, context: ${context} }.`;
      console.error(invalidContext);
      return {
        statusCode: 502, /* bad gateway */
        body: invalidContext
      };
    }

    console.log(`Submitting sitemap ${sitemapUrl} to Google`);
    let r = await axios.get(`http://www.google.com/ping?sitemap=${sitemapUrl}`);
    console.log(`... done`);
    console.dir(r)
    return { statusCode: 200 };
  } catch (err) {
    console.error('Failed to submit sitemap to Google:');
    console.error(err);
    throw err;
  }
};
