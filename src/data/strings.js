const site = require('./site');

const l10n = {
  en: {
    viewAll: "View All",
    overview: "Overview",
    related: "Related",
    furtherReading: "Further Reading",
    specification: "Specification",
    nonStandardCode: "This is a non-standard status code.",
    experimentalCode: "This status code is experimental.",
    deprecatedCode: "This status code has been deprecated.",
    httpWorkingGroup: "The HTTP Working Group",
  },
};

module.exports = {
  viewAll: l10n[site.locale].viewAll,
  overview: l10n[site.locale].overview,
  related: l10n[site.locale].related,
  furtherReading: l10n[site.locale].furtherReading,
  specification: l10n[site.locale].specification,
  nonStandardCode: l10n[site.locale].nonStandardCode,
  experimentalCode: l10n[site.locale].experimentalCode,
  deprecatedCode: l10n[site.locale].deprecatedCode,
  httpWorkingGroup: l10n[site.locale].httpWorkingGroup,
};
