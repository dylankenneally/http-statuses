const contextCondition = "production";
const stateCondition = "ready";
const sitemapUrl = process.env.SITEMAP_URL;

// const axios = require("axios");

exports.handler = async (event) => {
  if (!sitemapUrl) {
    return {
      statusCode: 400, /* bad request */
      body: 'The sitemap URL is missing'
    };
  }

  try {
    const { payload } = JSON.parse(event.body);
    const { state, context } = payload;

    if (state !== stateCondition || context !== contextCondition) {
      return {
        statusCode: 502, /* bad gateway */
        body: `State and/or context mismatched. Required: { state: ${stateCondition}, context: ${contextCondition} }, current: { state: ${state}, context: ${context} }.`
      };
    }

    console.log(`Submitting sitemap ${sitemapUrl} to Google`);
    // await axios.get(`http://www.google.com/ping?sitemap=${sitemapUrl}`);
    return { statusCode: 200 };
  } catch (err) {
    console.error(err);
    throw err;
  }
};
