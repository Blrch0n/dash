const { getStandardColors } = require("./colorUtils");

const contactSections = [
  {
    sectionName: "contact",
    subsectionName: "main",
    title: "Contact Us",
    content: "Main contact page content",
    order: 1,
  },
  {
    sectionName: "contact",
    subsectionName: "section1",
    title: "Contact Information",
    content: "Contact section 1 content",
    data: {
      contacts: [
        {
          id: 1,
          icon: "phone",
          title: "Phone",
          description: "+1 234 567 890",
        },
        {
          id: 2,
          icon: "email",
          title: "Email",
          description: "contact@example.com",
        },
        {
          id: 3,
          icon: "address",
          title: "Address",
          description: "123 Main Street, City, Country",
        },
      ],
      colors: getStandardColors(),
    },
    order: 2,
  },
  {
    sectionName: "contact",
    subsectionName: "section2",
    title: "Our Location",
    content: "Contact section 2 content",
    data: {
      backgroundImage:
        "https://wallpapers.com/images/featured/8k-e16w8b36gngra7a4.jpg",
      smallText: "Want to be our client?",
      mainHeading: "No subscription, you only pay once.",
      buttonText: "Purchase theme",
      buttonLink: "/",
      colors: {
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        accentColor: "#EF4444",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        scrolledBgColor: "#FFFFFF",
        scrolledTextColor: "#1F2937",
        hoverColor: "#3B82F6",
        borderColor: "#E5E7EB",
      },
    },
    order: 3,
  },
];

module.exports = contactSections;
