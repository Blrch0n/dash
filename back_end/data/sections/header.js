const { getStandardColors } = require("./colorUtils");

const headerSections = [
  {
    sectionName: "header",
    subsectionName: "main",
    title: "Header Configuration",
    content: "Main header configuration",
    data: {
      labels: [
        "Нүүр хуудас",
        "Тухай",
        "Үйлчилгээ",
        "Холбоо барих",
        "Блог",
        "Тусламж",
      ],
      image: null,
      colors: getStandardColors(),
    },
    order: 1,
  },
];

module.exports = headerSections;
