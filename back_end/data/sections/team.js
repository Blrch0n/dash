const teamSections = [
  {
    sectionName: "team",
    subsectionName: "main",
    title: "Our Team",
    content: "Main team page content",
    order: 1,
  },
  {
    sectionName: "team",
    subsectionName: "section1",
    title: "Team Technologies",
    content: "Team section 1 content",
    data: {
      title: "Our Technologies",
      subtitle: "TECH STACK",
      description:
        "Meet our powerful tech stack and tools we use to deliver exceptional results",
      projects: [
        {
          id: 1,
          title: "React.js",
          position:
            "A JavaScript library for building user interfaces with component-based architecture and virtual DOM for optimal performance.",
          image:
            "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          title: "Node.js",
          position:
            "A JavaScript runtime built on Chrome's V8 engine for scalable server-side applications and real-time web services.",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          title: "MongoDB",
          position:
            "A NoSQL document database that provides high performance, high availability, and easy scalability for modern applications.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 4,
          title: "AWS Cloud",
          position:
            "Amazon Web Services cloud platform providing reliable, scalable, and inexpensive cloud computing services worldwide.",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 5,
          title: "Docker",
          position:
            "A containerization platform that enables developers to package applications with all dependencies for consistent deployment.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 6,
          title: "Git & GitHub",
          position:
            "Version control system and collaborative platform for tracking changes and managing code repositories effectively.",
          image:
            "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
        },
        {
          id: 7,
          title: "TypeScript",
          position:
            "A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 8,
          title: "GraphQL",
          position:
            "A query language for APIs and runtime for executing queries with existing data, providing efficient data loading.",
          image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
        },
      ],
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
    order: 2,
  },
  {
    sectionName: "team",
    subsectionName: "section2",
    title: "Team Concept",
    content: "Team section 2 content",
    data: {
      title: "Our Technology Stack",
      subtitle: "Our Concept",
      description:
        "Cutting-edge tools and technologies we use to deliver exceptional results and build modern applications",
      backgroundImage:
        "https://images.unsplash.com/photo-1565945985125-a59c660a9932?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
      projects: [
        {
          id: 1,
          title: "Parallax Section",
          description:
            "This is how we can be sure that your brand expands according to market goals and continues to be attractive in the future",
          iconType: "notebook",
        },
        {
          id: 2,
          title: "Responsive Design",
          description:
            "It is fundamental to have a strategy that takes into consideration the features that are important to the client",
          iconType: "like",
        },
      ],
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
  {
    sectionName: "team",
    subsectionName: "section3",
    title: "Team Contact",
    content: "Team section 3 content",
    data: {
      title: "Get in touch",
      subtitle: "Want to Know More About Us? Get In Touch",
      buttonText: "See all Features",
      gradientColors: {
        background: "linear-gradient(to right, #664ed3 0%, #87d14b 100%)",
        button: "linear-gradient(to right, #9888ef 0%, #8978d3 100%)",
      },
      textColors: {
        title: "#ffffff",
        subtitle: "#b8b8b8",
        button: "#ffffff",
      },
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
    order: 4,
  },
];

module.exports = teamSections;
