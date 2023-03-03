const contextCondition = "production";
const stateCondition = "ready";
const sitemapUrl = process.env.SITEMAP_URL;

// const axios = require("axios");

console.log('*=*=*=*=* dep suc script');

exports.handler = async (event) => {
  console.log('*=*=*=*=* dep suc event');
  if (!sitemapUrl) {
    console.log('*=*=*=*=* no url');
    return {
      statusCode: 400, /* bad request */
      body: 'The sitemap URL is missing'
    };
  }

  try {
    console.log('*=*=*=*=* paylod');
    const { payload } = JSON.parse(event.body);
    const { state, context } = payload;

    if (state !== stateCondition || context !== contextCondition) {
      console.log(`*=*=*=*=* no con { state: ${stateCondition}, context: ${contextCondition} }, current: { state: ${state}, context: ${context} }`);
      return {
        statusCode: 502, /* bad gateway */
        body: `State and/or context mismatched. Required: { state: ${stateCondition}, context: ${contextCondition} }, current: { state: ${state}, context: ${context} }.`
      };
    }

    console.log(`Submitting sitemap ${sitemapUrl} to Google`);
    // await axios.get(`http://www.google.com/ping?sitemap=${sitemapUrl}`);
    return { statusCode: 200 };
  } catch (err) {
    console.log('*=*=*=*=* fucked');
    console.error(err);
    throw err;
  }
};
