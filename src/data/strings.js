const { locale, authorName, authorEmail } = require('./site');

const l10n = {
  en: {
    siteName: "HTTP Statuses",
    siteDescription: "An easy to use reference for HTTP status codes.",
    viewAll: "View All",
    overview: "Overview",
    related: "Related",
    furtherReading: "Further Reading",
    specification: "Specification",
    nonStandardCode: "This is a non-standard status code.",
    experimentalCode: "This status code is experimental.",
    deprecatedCode: "This status code has been deprecated.",
    httpWorkingGroup: "The HTTP Working Group",
    metaDescription: (code, name, overview) => `HTTP status code ${code} ${name}: ${overview}`,
    skipToMain: "Skip To Main",
    authorName,
    authorEmail,

    searchInputPlaceholder: "Search HTTP status codes...",
    searchInputLabel: "Search HTTP status codes",
    // todo: searchNoResults: "No results found.",
  },
};

// Ensure the site locale is in present in the string table
if (!(locale in l10n)) {
  console.error(`The site locale (${locale}) is not available in l10n string table, no localisation data is present. This error is fatal.`);
  process.exit(1);
}

module.exports = l10n[locale];
