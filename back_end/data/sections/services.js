const { getStandardColors } = require("./colorUtils");

const servicesSections = [
  {
    sectionName: "services",
    subsectionName: "main",
    title: "Services",
    content: "Main services page content",
    order: 1,
  },
  {
    sectionName: "services",
    subsectionName: "section2",
    title: "Services Gallery",
    content: "Services section 2 content",
    data: {
      title: "Our Services Overview",
      subtitle: "Explore our comprehensive range of professional services",
      services: [
        {
          id: 1,
          title: "Our services",
          backgroundImage:
            "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=400&fit=crop",
        },
        {
          id: 2,
          title: "Support team",
          backgroundImage:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
        },
        {
          id: 3,
          title: "Contact us",
          backgroundImage:
            "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop",
        },
      ],
      colors: getStandardColors(),
    },
    order: 2,
  },
];

module.exports = servicesSections;
