const { getStandardColors } = require("./colorUtils");

const generalInfoSections = [
  {
    sectionName: "general-info",
    subsectionName: "main",
    title: "General Information",
    content: "General info content",
    data: {
      colors: getStandardColors(),
    },
    order: 1,
  },
];

module.exports = generalInfoSections;
