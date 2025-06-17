require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const WebsiteConfig = require('../models/Config');
const Section = require('../models/Section');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || 'realDashboard'
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUser = {
  email: 'admin@realdashboard.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
  permissions: [
    'read_sections',
    'write_sections',
    'delete_sections',
    'read_config',
    'write_config',
    'manage_users',
    'upload_files'
  ],
  emailVerified: true
};

const sampleConfig = {
  siteName: 'Real Dashboard',
  siteDescription: 'Professional website builder dashboard',
  siteUrl: 'https://realdashboard.com',
  
  contact: {
    email: 'contact@realdashboard.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'USA'
    }
  },
  
  social: {
    facebook: 'https://facebook.com/realdashboard',
    twitter: 'https://twitter.com/realdashboard',
    instagram: 'https://instagram.com/realdashboard',
    linkedin: 'https://linkedin.com/company/realdashboard',
    github: 'https://github.com/realdashboard'
  },
  
  seo: {
    metaTitle: 'Real Dashboard - Professional Website Builder',
    metaDescription: 'Create stunning websites with our professional dashboard. Easy to use, powerful features.',
    keywords: ['dashboard', 'website builder', 'cms', 'real dashboard'],
    ogImage: '/assets/og-image.jpg',
    favicon: '/favicon.ico'
  },
  
  theme: {
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    accentColor: '#28a745',
    backgroundColor: '#ffffff',
    textColor: '#212529',
    fontFamily: 'Inter, sans-serif'
  },
  
  header: {
    logo: '/assets/logo.png',
    logoText: 'Real Dashboard',
    showSearch: true,
    showUserMenu: true,
    navigation: [
      {
        label: 'Home',
        url: '/',
        isExternal: false,
        order: 1
      },
      {
        label: 'About',
        url: '/about',
        isExternal: false,
        order: 2
      },
      {
        label: 'Services',
        url: '/services',
        isExternal: false,
        order: 3
      },
      {
        label: 'Work',
        url: '/our-work',
        isExternal: false,
        order: 4
      },
      {
        label: 'Contact',
        url: '/contact',
        isExternal: false,
        order: 5
      }
    ]
  },
  
  footer: {
    copyrightText: '© 2025 Real Dashboard. All rights reserved.',
    showSocialLinks: true,
    links: [
      {
        label: 'Privacy Policy',
        url: '/privacy',
        category: 'Legal'
      },
      {
        label: 'Terms of Service',
        url: '/terms',
        category: 'Legal'
      },
      {
        label: 'Documentation',
        url: '/docs',
        category: 'Help'
      }
    ]
  },
  
  features: {
    enableBlog: false,
    enableComments: false,
    enableNewsletter: true,
    enableChat: false,
    enableAnalytics: true
  }
};

const sampleSections = [
  {
    sectionType: 'section1',
    pageType: 'our_work',
    title: 'Our Work',
    subtitle: 'Showcasing our best projects',
    description: 'Take a look at some of the amazing projects we\'ve worked on.',
    isActive: true,
    order: 1,
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        category: 'Web Development',
        tags: ['React', 'Node.js', 'MongoDB'],
        description: 'A modern e-commerce platform with advanced features.',
        image: '/assets/projects/ecommerce.jpg',
        link: 'https://example-ecommerce.com',
        featured: true
      },
      {
        id: 2,
        title: 'Mobile Banking App',
        category: 'Mobile Development',
        tags: ['React Native', 'Firebase'],
        description: 'Secure and user-friendly mobile banking application.',
        image: '/assets/projects/banking-app.jpg',
        link: 'https://example-banking.com',
        featured: false
      },
      {
        id: 3,
        title: 'Dashboard Analytics',
        category: 'Data Visualization',
        tags: ['Vue.js', 'D3.js', 'Python'],
        description: 'Comprehensive analytics dashboard with real-time data.',
        image: '/assets/projects/analytics.jpg',
        link: 'https://example-analytics.com',
        featured: true
      }
    ],
    categories: ['Web Development', 'Mobile Development', 'Data Visualization'],
    layoutSettings: {
      desktop: {
        itemsPerRow: 3,
        spacing: 'medium',
        alignment: 'center'
      },
      mobile: {
        itemsPerRow: 1,
        spacing: 'medium',
        alignment: 'center'
      }
    }
  },
  {
    sectionType: 'section1',
    pageType: 'services',
    title: 'Our Services',
    subtitle: 'What we offer',
    description: 'We provide comprehensive digital solutions for your business needs.',
    isActive: true,
    order: 1,
    services: [
      {
        id: 1,
        title: 'Web Development',
        description: 'Custom web applications using modern technologies.',
        icon: 'globe',
        features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'Secure'],
        price: 'Starting at $2,999',
        popular: true
      },
      {
        id: 2,
        title: 'Mobile Development',
        description: 'Native and cross-platform mobile applications.',
        icon: 'mobile',
        features: ['iOS & Android', 'Cross-platform', 'Native Performance', 'App Store Ready'],
        price: 'Starting at $4,999',
        popular: false
      },
      {
        id: 3,
        title: 'Digital Marketing',
        description: 'Comprehensive digital marketing strategies.',
        icon: 'bullhorn',
        features: ['SEO', 'Social Media', 'Content Marketing', 'Analytics'],
        price: 'Starting at $1,499',
        popular: false
      }
    ]
  },
  {
    sectionType: 'section1',
    pageType: 'about',
    title: 'About Us',
    subtitle: 'Our Story',
    description: 'We are a team of passionate developers and designers.',
    mainText: 'Founded in 2020, Real Dashboard has been at the forefront of digital innovation. Our team of experienced professionals is dedicated to creating exceptional digital experiences that drive business growth.',
    isActive: true,
    order: 1,
    statistics: {
      mainTitle: 'Our Achievements',
      subtitle: 'Numbers that speak for themselves',
      stats: [
        {
          number: '150+',
          label: 'Projects Completed',
          suffix: '',
          prefix: ''
        },
        {
          number: '50+',
          label: 'Happy Clients',
          suffix: '',
          prefix: ''
        },
        {
          number: '5',
          label: 'Years Experience',
          suffix: '',
          prefix: ''
        },
        {
          number: '24/7',
          label: 'Support',
          suffix: '',
          prefix: ''
        }
      ]
    }
  },
  {
    sectionType: 'section1',
    pageType: 'team',
    title: 'Our Team',
    subtitle: 'Meet the people behind Real Dashboard',
    description: 'Our diverse team brings together expertise from various fields.',
    isActive: true,
    order: 1,
    team: [
      {
        id: 1,
        name: 'John Smith',
        position: 'CEO & Founder',
        image: '/assets/team/john-smith.jpg',
        bio: 'Visionary leader with 10+ years of experience in tech industry.',
        social: {
          linkedin: 'https://linkedin.com/in/johnsmith',
          twitter: 'https://twitter.com/johnsmith',
          email: 'john@realdashboard.com'
        }
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        position: 'CTO',
        image: '/assets/team/sarah-johnson.jpg',
        bio: 'Technical expert specializing in scalable architecture and innovation.',
        social: {
          linkedin: 'https://linkedin.com/in/sarahjohnson',
          github: 'https://github.com/sarahjohnson',
          email: 'sarah@realdashboard.com'
        }
      },
      {
        id: 3,
        name: 'Mike Davis',
        position: 'Lead Developer',
        image: '/assets/team/mike-davis.jpg',
        bio: 'Full-stack developer with expertise in modern web technologies.',
        social: {
          github: 'https://github.com/mikedavis',
          linkedin: 'https://linkedin.com/in/mikedavis',
          email: 'mike@realdashboard.com'
        }
      }
    ]
  }
];

// Seed functions
const seedUsers = async () => {
  try {
    const existingUser = await User.findOne({ email: sampleUser.email });
    if (existingUser) {
      console.log('👤 Admin user already exists');
      return;
    }
    
    const user = new User(sampleUser);
    await user.save();
    console.log('👤 Sample user created successfully');
  } catch (error) {
    console.error('❌ Error creating sample user:', error);
  }
};

const seedConfig = async () => {
  try {
    const existingConfig = await WebsiteConfig.findOne();
    if (existingConfig) {
      console.log('⚙️ Website config already exists');
      return;
    }
    
    const config = new WebsiteConfig(sampleConfig);
    await config.save();
    console.log('⚙️ Sample config created successfully');
  } catch (error) {
    console.error('❌ Error creating sample config:', error);
  }
};

const seedSections = async () => {
  try {
    for (const sectionData of sampleSections) {
      const existingSection = await Section.findOne({
        pageType: sectionData.pageType,
        sectionType: sectionData.sectionType
      });
      
      if (existingSection) {
        console.log(`📄 Section ${sectionData.pageType}/${sectionData.sectionType} already exists`);
        continue;
      }
      
      const section = new Section(sectionData);
      await section.save();
      console.log(`📄 Sample section ${sectionData.pageType}/${sectionData.sectionType} created successfully`);
    }
  } catch (error) {
    console.error('❌ Error creating sample sections:', error);
  }
};

// Main seeder function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🌱 Starting database seeding...');
    
    await seedUsers();
    await seedConfig();
    await seedSections();
    
    console.log('✅ Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedDatabase,
  seedUsers,
  seedConfig,
  seedSections
};
