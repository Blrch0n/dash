const mongoose = require('mongoose');

// Website configuration schema
const WebsiteConfigSchema = new mongoose.Schema({
  // General website information
  siteName: { type: String, required: true, default: 'Real Dashboard' },
  siteDescription: { type: String, default: 'Professional website builder dashboard' },
  siteUrl: { type: String },
  
  // Contact information
  contact: {
    email: { type: String },
    phone: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String }
    }
  },
  
  // Social media links
  social: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    youtube: { type: String },
    github: { type: String }
  },
  
  // SEO settings
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [{ type: String }],
    ogImage: { type: String },
    favicon: { type: String }
  },
  
  // Theme and styling
  theme: {
    primaryColor: { type: String, default: '#007bff' },
    secondaryColor: { type: String, default: '#6c757d' },
    accentColor: { type: String, default: '#28a745' },
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#212529' },
    fontFamily: { type: String, default: 'Inter, sans-serif' }
  },
  
  // Header configuration
  header: {
    logo: { type: String },
    logoText: { type: String },
    showSearch: { type: Boolean, default: false },
    showUserMenu: { type: Boolean, default: true },
    navigation: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
      isExternal: { type: Boolean, default: false },
      order: { type: Number, default: 0 }
    }]
  },
  
  // Footer configuration
  footer: {
    copyrightText: { type: String },
    showSocialLinks: { type: Boolean, default: true },
    links: [{
      label: { type: String, required: true },
      url: { type: String, required: true },
      category: { type: String }
    }]
  },
  
  // Analytics and tracking
  analytics: {
    googleAnalyticsId: { type: String },
    facebookPixelId: { type: String },
    hotjarId: { type: String }
  },
  
  // Email configuration
  email: {
    smtpHost: { type: String },
    smtpPort: { type: Number },
    smtpUser: { type: String },
    smtpPassword: { type: String },
    fromEmail: { type: String },
    fromName: { type: String }
  },
  
  // Features toggles
  features: {
    enableBlog: { type: Boolean, default: false },
    enableComments: { type: Boolean, default: false },
    enableNewsletter: { type: Boolean, default: false },
    enableChat: { type: Boolean, default: false },
    enableAnalytics: { type: Boolean, default: false }
  },
  
  // Custom settings
  customSettings: { type: mongoose.Schema.Types.Mixed },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String },
  version: { type: Number, default: 1 }
});

// Pre-save middleware
WebsiteConfigSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Static method to get or create default config
WebsiteConfigSchema.statics.getOrCreateDefault = async function() {
  let config = await this.findOne();
  if (!config) {
    config = new this({
      siteName: 'Real Dashboard',
      siteDescription: 'Professional website builder dashboard'
    });
    await config.save();
  }
  return config;
};

module.exports = mongoose.model('WebsiteConfig', WebsiteConfigSchema);
