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
    subsectionName: "section1",
    title: "Services Overview",
    content: "Services section 1 content",
    data: {
      title: "Capabilities",
      subtitle: "Taking care of the new products's launch and user support",
      categories: ["Prototypes", "Development", "Support", "Design"],
      mainText: "All you need is Enside, a modern & simple template",
      description:
        "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      layoutSettings: {
        desktop: {
          categoriesPerRow: 4,
          statisticsPerRow: 3,
        },
        mobile: {
          categoriesPerRow: 2,
          statisticsPerRow: 1,
        },
      },
      statistics: {
        mainTitle: "We create human experience in a digital world",
        stats: [
          {
            number: "97",
            label:
              "Percent of users recommend us recommend us to friends and family",
          },
          {
            number: "350",
            label: "Companies have shifted to using us recently",
          },
          {
            number: "35",
            label: "We deliver so much more than the competition",
          },
        ],
      },
      sections: {
        Prototypes: {
          leftContent: {
            title: "All you need is Enside, a modern & simple template",
            description:
              "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
          },
          rightContent: [
            {
              icon: "IoUmbrellaOutline",
              title: "We bring the brand to life",
              subtitle:
                "We only hire great people who strike to push their idea",
              backgroundImage:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
            },
            {
              icon: "PiLego",
              title: "Build Your Dream",
              subtitle:
                "We only hire great people who strike to push their idea",
              backgroundImage:
                "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
            },
          ],
        },
        Development: {
          leftContent: {
            title: "How to Start your Business",
            description:
              "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
          },
          services: [
            {
              icon: "TbHammer",
              title: "Design & Developing",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "PiStudent",
              title: "Fully Responsive",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "FaRegUserCircle",
              title: "Great Service",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "RiToolsFill",
              title: "Fast Support",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
          ],
        },
        Support: {
          leftContent: {
            title: "How to Start your Business",
            description:
              "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
          },
          services: [
            {
              icon: "TbHammer",
              title: "Design & Developing",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "PiStudent",
              title: "Fully Responsive",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "FaRegUserCircle",
              title: "Great Service",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "RiToolsFill",
              title: "Fast Support",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
          ],
        },
        Design: {
          leftContent: {
            title: "How to Start your Business",
            description:
              "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
          },
          services: [
            {
              icon: "TbHammer",
              title: "Design & Developing",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
            {
              icon: "PiStudent",
              title: "Fully Responsive",
              description:
                "Creative concept – every solution needs a conceptual design that the further work will be based on.",
            },
          ],
          rightCard: {
            icon: "PiLego",
            title: "We bring the brand to life",
            subtitle: "We only hire great people who strike to push their idea",
            backgroundImage:
              "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
          },
        },
      },
      colors: getStandardColors(),
    },
    order: 2,
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
    order: 3,
  },
];

module.exports = servicesSections;
