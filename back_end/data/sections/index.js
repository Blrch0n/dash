// Import all section data files
const aboutSections = require("./about");
const contactSections = require("./contact");
const footerSections = require("./footer");
const generalInfoSections = require("./general-info");
const headerSections = require("./header");
const newsSections = require("./news");
const ourWorkSections = require("./our_work");
const servicesSections = require("./services");
const teamSections = require("./team");
const webpageSections = require("./webpage");

// Combine all sections into one array
const allSections = [
  ...aboutSections,
  ...contactSections,
  ...footerSections,
  ...generalInfoSections,
  ...headerSections,
  ...newsSections,
  ...ourWorkSections,
  ...servicesSections,
  ...teamSections,
  ...webpageSections,
];

module.exports = {
  // Individual section arrays
  aboutSections,
  contactSections,
  footerSections,
  generalInfoSections,
  headerSections,
  newsSections,
  ourWorkSections,
  servicesSections,
  teamSections,
  webpageSections,

  // Combined array
  allSections,

  // For backwards compatibility
  initialSections: allSections,
};
