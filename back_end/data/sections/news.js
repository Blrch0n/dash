const { getStandardColors } = require("./colorUtils");

const newsSections = [
  {
    sectionName: "news",
    subsectionName: "main",
    title: "News",
    content: "Main news page content",
    order: 1,
  },
  {
    sectionName: "news",
    subsectionName: "section1",
    title: "News & Updates",
    content: "News section 1 content",
    data: {
      title: "Latest News & Updates",
      subtitle:
        "Stay updated with our latest news, articles, and industry insights that matter to you.",
      projects: [
        {
          id: 1,
          title: "Tech Industry Trends 2024",
          category: "Technology",
          tags: ["Tech", "Trends", "2024"],
          description:
            "Exploring the latest technology trends shaping the future",
          image:
            "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          title: "AI Revolution in Business",
          category: "Artificial Intelligence",
          tags: ["AI", "Business", "Innovation"],
          description: "How AI is transforming modern business operations",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          title: "Web Development Best Practices",
          category: "Development",
          tags: ["Web", "Development", "Best Practices"],
          description: "Essential practices for modern web development",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 4,
          title: "Cloud Computing Solutions",
          category: "Cloud Technology",
          tags: ["Cloud", "Computing", "Solutions"],
          description: "Comprehensive guide to cloud computing solutions",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 5,
          title: "Cybersecurity Essentials",
          category: "Security",
          tags: ["Security", "Cybersecurity", "Protection"],
          description: "Essential cybersecurity practices for businesses",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 6,
          title: "Mobile App Development",
          category: "Mobile Development",
          tags: ["Mobile", "App", "Development"],
          description: "Latest trends in mobile application development",
          image:
            "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
        },
        {
          id: 7,
          title: "Data Science Insights",
          category: "Data Science",
          tags: ["Data", "Science", "Analytics"],
          description: "Insights into modern data science methodologies",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 8,
          title: "Digital Marketing Strategies",
          category: "Marketing",
          tags: ["Digital", "Marketing", "Strategy"],
          description: "Effective digital marketing strategies for 2024",
          image:
            "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
        },
      ],
      colors: getStandardColors(),
    },
    order: 2,
  },
  {
    sectionName: "news",
    subsectionName: "section2",
    title: "News Partners",
    content: "News section 2 content",
    data: {
      title: "Our Partners and Brands",
      subtitle:
        "Our team of strategists, designers, and engineers deliver valuable, tangible customer experiences",
      partners: [
        "https://max-themes.net/demos/enside/main/upload/logo-b-2.png",
        "https://max-themes.net/demos/enside/main/upload/logo-b-3.png",
        "https://max-themes.net/demos/enside/main/upload/logo-b-4.png",
        "https://max-themes.net/demos/enside/main/upload/logo-b-7.png",
        "https://max-themes.net/demos/enside/main/upload/logo-b-8.png",
      ],
      colors: getStandardColors(),
    },
    order: 3,
  },
];

module.exports = newsSections;
