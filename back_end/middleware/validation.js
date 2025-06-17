const Joi = require('joi');

// Joi validation schemas
const sectionSchema = Joi.object({
  title: Joi.string().max(200),
  subtitle: Joi.string().max(300),
  description: Joi.string().max(2000),
  mainText: Joi.string().max(5000),
  
  projects: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required().max(200),
    category: Joi.string().required().max(100),
    tags: Joi.array().items(Joi.string().max(50)),
    description: Joi.string().max(1000),
    image: Joi.string().uri().allow(''),
    link: Joi.string().uri().allow(''),
    featured: Joi.boolean()
  })),
  
  services: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required().max(200),
    description: Joi.string().max(1000),
    icon: Joi.string().max(100),
    features: Joi.array().items(Joi.string().max(200)),
    price: Joi.string().max(50),
    popular: Joi.boolean()
  })),
  
  team: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required().max(100),
    position: Joi.string().required().max(100),
    image: Joi.string().uri().allow(''),
    bio: Joi.string().max(500),
    social: Joi.object({
      linkedin: Joi.string().uri().allow(''),
      twitter: Joi.string().uri().allow(''),
      github: Joi.string().uri().allow(''),
      email: Joi.string().email().allow('')
    })
  })),
  
  accordion: Joi.array().items(Joi.object({
    id: Joi.number().required(),
    question: Joi.string().required().max(300),
    answer: Joi.string().required().max(2000),
    category: Joi.string().max(100)
  })),
  
  categories: Joi.array().items(Joi.string().max(100)),
  tags: Joi.array().items(Joi.string().max(50)),
  
  statistics: Joi.object({
    mainTitle: Joi.string().max(200),
    subtitle: Joi.string().max(300),
    stats: Joi.array().items(Joi.object({
      number: Joi.string().required().max(20),
      label: Joi.string().required().max(100),
      suffix: Joi.string().max(10),
      prefix: Joi.string().max(10)
    }))
  }),
  
  backgroundImage: Joi.string().uri().allow(''),
  images: Joi.array().items(Joi.string().uri()),
  
  layoutSettings: Joi.object({
    desktop: Joi.object({
      itemsPerRow: Joi.number().min(1).max(6),
      spacing: Joi.string().valid('small', 'medium', 'large'),
      alignment: Joi.string().valid('left', 'center', 'right')
    }),
    mobile: Joi.object({
      itemsPerRow: Joi.number().min(1).max(3),
      spacing: Joi.string().valid('small', 'medium', 'large'),
      alignment: Joi.string().valid('left', 'center', 'right')
    })
  }),
  
  styling: Joi.object({
    backgroundColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    textColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    accentColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    padding: Joi.string().max(50),
    margin: Joi.string().max(50)
  }),
  
  isActive: Joi.boolean(),
  order: Joi.number().min(0),
  customFields: Joi.object(),
  version: Joi.number().min(1)
});

const configSchema = Joi.object({
  siteName: Joi.string().max(100),
  siteDescription: Joi.string().max(500),
  siteUrl: Joi.string().uri().allow(''),
  
  contact: Joi.object({
    email: Joi.string().email().allow(''),
    phone: Joi.string().max(20).allow(''),
    address: Joi.object({
      street: Joi.string().max(200).allow(''),
      city: Joi.string().max(100).allow(''),
      state: Joi.string().max(100).allow(''),
      zipCode: Joi.string().max(20).allow(''),
      country: Joi.string().max(100).allow('')
    })
  }),
  
  social: Joi.object({
    facebook: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow(''),
    instagram: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
    youtube: Joi.string().uri().allow(''),
    github: Joi.string().uri().allow('')
  }),
  
  seo: Joi.object({
    metaTitle: Joi.string().max(70).allow(''),
    metaDescription: Joi.string().max(160).allow(''),
    keywords: Joi.array().items(Joi.string().max(50)),
    ogImage: Joi.string().uri().allow(''),
    favicon: Joi.string().uri().allow('')
  }),
  
  theme: Joi.object({
    primaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    accentColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    backgroundColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    textColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    fontFamily: Joi.string().max(100)
  }),
  
  header: Joi.object({
    logo: Joi.string().uri().allow(''),
    logoText: Joi.string().max(50).allow(''),
    showSearch: Joi.boolean(),
    showUserMenu: Joi.boolean(),
    navigation: Joi.array().items(Joi.object({
      label: Joi.string().required().max(50),
      url: Joi.string().required().max(200),
      isExternal: Joi.boolean(),
      order: Joi.number().min(0)
    }))
  }),
  
  footer: Joi.object({
    copyrightText: Joi.string().max(200).allow(''),
    showSocialLinks: Joi.boolean(),
    links: Joi.array().items(Joi.object({
      label: Joi.string().required().max(50),
      url: Joi.string().required().max(200),
      category: Joi.string().max(50).allow('')
    }))
  }),
  
  analytics: Joi.object({
    googleAnalyticsId: Joi.string().max(50).allow(''),
    facebookPixelId: Joi.string().max(50).allow(''),
    hotjarId: Joi.string().max(50).allow('')
  }),
  
  features: Joi.object({
    enableBlog: Joi.boolean(),
    enableComments: Joi.boolean(),
    enableNewsletter: Joi.boolean(),
    enableChat: Joi.boolean(),
    enableAnalytics: Joi.boolean()
  }),
  
  customSettings: Joi.object()
});

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().max(100),
  role: Joi.string().valid('admin', 'editor', 'viewer')
});

// Validation middleware functions
const validateSection = (req, res, next) => {
  const { error } = sectionSchema.validate(req.body, { 
    allowUnknown: true, // Allow additional fields for flexibility
    stripUnknown: false 
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

const validateConfig = (req, res, next) => {
  const { error } = configSchema.validate(req.body, { 
    allowUnknown: true,
    stripUnknown: false 
  });
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

const validateAuth = (req, res, next) => {
  const schema = req.path === '/register' 
    ? authSchema.required()
    : authSchema.fork(['name', 'role'], (schema) => schema.optional());
  
  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }
  
  next();
};

// Handle validation errors (simplified for Joi)
const handleValidationErrors = (req, res, next) => {
  // This is now handled within each validation function
  next();
};

// Sanitize input data
const sanitizeInput = (req, res, next) => {
  // Remove any potential script tags or dangerous content
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };
  
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) return obj;
    
    const sanitized = Array.isArray(obj) ? [] : {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };
  
  req.body = sanitizeObject(req.body);
  next();
};

module.exports = {
  validateSection,
  validateConfig,
  validateAuth,
  handleValidationErrors,
  sanitizeInput,
  sectionSchema,
  configSchema,
  authSchema
};
