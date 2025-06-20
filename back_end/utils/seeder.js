const mongoose = require("mongoose");
const Section = require("../models/Section");
const {
  convertBase64ToFile,
  processDataImages,
} = require("../middleware/imageProcessor");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/dashboard")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

/**
 * Convert existing base64 images in the database to file URLs
 */
async function convertExistingBase64Images() {
  try {
    console.log("Converting existing base64 images to files...");

    const sections = await Section.find({});
    let convertedCount = 0;

    for (const section of sections) {
      let needsUpdate = false;

      if (section.data) {
        // Process the data to convert base64 images
        const originalData = JSON.stringify(section.data);
        const processedData = processDataImages(section.data);
        const newData = JSON.stringify(processedData);

        // Check if any changes were made
        if (originalData !== newData) {
          section.data = processedData;
          section.lastUpdated = new Date();
          await section.save();
          needsUpdate = true;
          convertedCount++;
        }
      }

      if (needsUpdate) {
        console.log(
          `Converted images in section: ${section.sectionName}/${section.subsectionName}`
        );
      }
    }

    console.log(`Conversion complete. Updated ${convertedCount} sections.`);
  } catch (error) {
    console.error("Error converting base64 images:", error);
  }
}

// Initial data structure based on your frontend
const initialSections = [
  // About sections
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

  // Contact sections
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
  },

  // Header
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
    order: 1,
  },

  // Footer section
  {
    sectionName: "footer",
    subsectionName: "main",
    title: "Footer Configuration",
    content: "Footer section with contact info and links",
    data: {
      about: {
        title: "Бидний тухай",
        content:
          "Бид бол дижитал эрин үед бизнесүүдийг хэрэглэгчдэдээ ойр байлгах цогц дизайн, технологийн түнш юм. Зүрх сэтгэл, оюун ухаанд хүрч, бизнесүүдийг дижитал эринд хамааралтай байхад тусалдаг.",
      },
      news: {
        title: "Сүүлийн мэдээ",
        items: [
          {
            title: "Enside-тэй илүү сайхан дэлхий бүтээцгээе",
            date: "2017 оны 11-р сарын 29",
          },
          {
            title: "Enside шинэ салбарын eCommerce туршлага нээлээ",
            date: "2017 оны 11-р сарын 29",
          },
        ],
      },
      links: {
        title: "Хэрэгтэй холбоосууд",
        items: [
          "Түгээмэл асуултууд",
          "Баримт бичиг",
          "Сэтгэгдэл",
          "Хичээлүүд",
          "Онцлогууд",
        ],
      },
      contact: {
        title: "Холбоо барих",
        description:
          "Манай тусламжийн баг 7 хоногийн турш, 24 цагийн турш танд туслахад бэлэн.",
        phone: "+ 1 703 4959 3452",
        email: "test@gmail.com",
      },
      copyright: "Powered by Enside - Premium HTML Template",
      colors: {
        primaryColor: "#3B82F6",
        secondaryColor: "#1E40AF",
        accentColor: "#EF4444",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        borderColor: "#E5E7EB",
      },
    },
    order: 1,
  },

  // General Info
  {
    sectionName: "general-info",
    subsectionName: "main",
    title: "General Information",
    content: "General info content",
    data: {
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
    order: 1,
  },

  // News sections
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

  // Our Work sections
  {
    sectionName: "our_work",
    subsectionName: "main",
    title: "Our Work",
    content: "Main our work page content",
    order: 1,
  },
  {
    sectionName: "our_work",
    subsectionName: "section1",
    title: "Case Studies",
    content: "Our work section 1 content",
    data: {
      title: "Case Studies",
      subtitle:
        "Inspiring and functional branding, development, consulting, websites, online services, and apps.",
      projects: [
        {
          id: 1,
          title: "Creative Ring",
          category: "Product Design",
          tags: ["Agency", "App Design", "Services"],
          description: "Product Design",
          image:
            "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          title: "Ugly Delicious",
          category: "Agency / Services / UI&UX",
          tags: ["Agency", "Services", "UI&UX"],
          description: "Ugly Delicious",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          title: "Kitchen Stories",
          category: "Personal",
          tags: ["App Design", "Services", "UI&UX"],
          description: "Kitchen Stories",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 4,
          title: "Commercial",
          category: "Client: Themeforest",
          tags: ["Agency", "App Design", "Services"],
          description: "Commercial",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 5,
          title: "Lamp Mock Up",
          category: "Special",
          tags: ["App Design", "Services"],
          description: "Lamp Mock Up",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 6,
          title: "Enside Web",
          category: "Perfect for Home",
          tags: ["Agency"],
          description: "Enside Web",
          image:
            "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
        },
        {
          id: 7,
          title: "Pixel Days",
          category: "Mock up components",
          tags: ["Agency", "App Design", "Services", "UI&UX"],
          description: "Pixel Days",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        },
        {
          id: 8,
          title: "Particles",
          category: "Digital",
          tags: ["Agency", "App Design", "Services", "UI&UX"],
          description: "Particles",
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
    sectionName: "our_work",
    subsectionName: "section2",
    title: "Capabilities",
    content: "Our work section 2 content",
    data: {
      title: "Capabilities",
      subtitle: "Creative concept or System Design",
      description:
        "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      capabilities: [
        {
          title: "Tailored",
          description:
            "We believe in a collaborative partnership where we work with you to create the perfect solution",
        },
        {
          title: "Strategic",
          description:
            "Our energy is focus in inspiring projects, activation campaigns and influence strategies",
        },
        {
          title: "Quality",
          description:
            "Development – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          title: "Complete",
          description:
            "We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
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
    sectionName: "our_work",
    subsectionName: "section3",
    title: "Unique Services",
    content: "Our work section 3 content",
    data: {
      title: "Unique services",
      subtitle: "Our Approach",
      description: "We offer custom solutions to industry leading companies",
      services: [
        {
          id: 1,
          title: "STRATEGY",
          description:
            "Enside allows you to build a fully functional and feature rich onepage WordPress site, whatever your agency or business, without any knowledge of coding.",
          image:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        },
        {
          id: 2,
          title: "INSIGHT",
          description:
            "Effortlessly beautiful, Enside offers a collection of pre-built demos, with one-click import, and you can make your site your own using WP Bakery for WordPress.",
          image:
            "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",
        },
        {
          id: 3,
          title: "EXPERIENCE",
          description:
            "We've created a wide selection of stunning and powerful demos so that you can find the best starting point for your personal, business or agency website.",
          image:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        {
          id: 4,
          title: "PERFORMANCE",
          description:
            "The admin panel invites you to get creative and make your site unique in seconds. You get to choose how your users engage with you and your business.",
          image:
            "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
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
    order: 4,
  },

  {
    sectionName: "our_work",
    subsectionName: "section4",
    title: "Our Services",
    content: "Our work section 4 content",
    data: {
      title: "Our Services",
      subtitle:
        "We provide exceptional digital solutions tailored to your needs",
      services: [
        {
          id: 1,
          title: "Unlimited Colors",
          description:
            "We help our clients in developing systems of digital products and services over time.",
          icon: "🎨",
          bgColor: "from-purple-400 to-pink-400",
        },
        {
          id: 2,
          title: "High Quality Design",
          description:
            "We help our clients in developing systems of digital products and services over time.",
          icon: "✨",
          bgColor: "from-blue-400 to-cyan-400",
        },
        {
          id: 3,
          title: "Luxurious Layouts",
          description:
            "We help our clients in developing systems of digital products and services over time.",
          icon: "💎",
          bgColor: "from-green-400 to-teal-400",
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
    order: 5,
  },

  // Services sections
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

  // Team sections
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

  // Webpage
  {
    sectionName: "webpage",
    subsectionName: "main",
    title: "Webpage Settings",
    content: "Webpage configuration content",
    order: 1,
  },
];

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await Section.deleteMany({});
    console.log("🗑️  Cleared existing sections");

    // Insert initial data
    const result = await Section.insertMany(initialSections);
    console.log(`✅ Inserted ${result.length} sections`);

    console.log("🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

async function convertImages() {
  try {
    console.log("🖼️ Starting image conversion...");
    await convertExistingBase64Images();
    console.log("🎉 Image conversion completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error converting images:", error);
    process.exit(1);
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  const command = process.argv[2];

  if (command === "convert") {
    convertImages();
  } else {
    seedDatabase();
  }
}

module.exports = { seedDatabase, initialSections, convertExistingBase64Images };
