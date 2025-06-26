const { getStandardColors } = require("./colorUtils");

const aboutSections = [
  {
    sectionName: "about",
    subsectionName: "main",
    title: "About Us",
    content: "Main about page content",
    order: 1,
  },
  {
    sectionName: "about",
    subsectionName: "section1",
    title: "Our Story",
    content: "About section 1 content",
    data: {
      welcome: {
        title: "Welcome",
        content:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      features: {
        title: "Outstanding Features",
        items: [
          {
            title: "Brand Development",
            description:
              "Our energy and expertise are focus in inspiring projects, activation campaigns and influence strategies with our brands",
            image:
              "https://max-themes.net/demos/enside/main/upload/man-business-landscape.jpg",
          },
          {
            title: "Content Strategy",
            description:
              "We believe in a collaborative partnership where we work with you and your brand to create the perfect solution",
            image:
              "https://max-themes.net/demos/enside/main/upload/office-hand.jpg",
          },
          {
            title: "Ecommerce & Technology",
            description:
              "Development and Design – every solution needs a conceptual design that the further work will be based on.",
            image:
              "https://max-themes.net/demos/enside/main/upload/women-house-interior.jpg",
          },
        ],
      },
      exploreButton: {
        text: "Explore All Features",
        link: "/",
      },
      colors: getStandardColors(),
    },
    order: 2,
  },
  {
    sectionName: "about",
    subsectionName: "section2",
    title: "Our Mission",
    content: "About section 2 content",
    data: {
      creativeSpirit: {
        title: "Creative Spirit",
        content:
          "The pieces we make are the free thoughts that come with daily work given a physical form",
      },
      actionButton: {
        text: "See all Features",
        link: "/",
      },
      colors: getStandardColors(),
    },
    order: 3,
  },
  {
    sectionName: "about",
    subsectionName: "section3",
    title: "Our Vision",
    content: "About section 3 content",
    data: {
      uniqueSpace: {
        title: "UNIQUE SPACE",
        subtitle: "Slight Differences Can Trigger Creativity",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      accordion: [
        {
          id: 1,
          title: "Design Excellence",
          content:
            "We create visually stunning and user-friendly designs that capture your brand essence and engage your audience effectively.",
        },
        {
          id: 2,
          title: "Technology Innovation",
          content:
            "Our cutting-edge technology solutions help businesses stay ahead in the rapidly evolving digital landscape.",
        },
        {
          id: 3,
          title: "Digital Strategy",
          content:
            "We develop comprehensive digital strategies that align with your business goals and drive measurable results.",
        },
      ],
      image: {
        src: "https://i.pinimg.com/736x/dd/1c/5b/dd1c5b14fc8446a4741fdb979c4fe3cc.jpg",
        alt: "Creative workspace",
      },
      colors: getStandardColors(),
    },
    order: 4,
  },
];

module.exports = aboutSections;
