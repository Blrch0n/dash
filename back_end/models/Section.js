const mongoose = require('mongoose');

// Project schema for sections that contain projects
const ProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  description: { type: String },
  image: { type: String },
  link: { type: String },
  featured: { type: Boolean, default: false }
}, { _id: false });

// Service schema for service sections
const ServiceSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  icon: { type: String },
  features: [{ type: String }],
  price: { type: String },
  popular: { type: Boolean, default: false }
}, { _id: false });

// Statistics schema
const StatisticSchema = new mongoose.Schema({
  number: { type: String, required: true },
  label: { type: String, required: true },
  suffix: { type: String },
  prefix: { type: String }
}, { _id: false });

// Team member schema
const TeamMemberSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String },
  bio: { type: String },
  social: {
    linkedin: { type: String },
    twitter: { type: String },
    github: { type: String },
    email: { type: String }
  }
}, { _id: false });

// FAQ/Accordion item schema
const AccordionItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String }
}, { _id: false });

// Layout settings schema
const LayoutSettingsSchema = new mongoose.Schema({
  desktop: {
    itemsPerRow: { type: Number, default: 3 },
    spacing: { type: String, default: 'medium' },
    alignment: { type: String, default: 'center' }
  },
  mobile: {
    itemsPerRow: { type: Number, default: 1 },
    spacing: { type: String, default: 'medium' },
    alignment: { type: String, default: 'center' }
  }
}, { _id: false });

// Main Section schema
const SectionSchema = new mongoose.Schema({
  sectionType: { 
    type: String, 
    required: true,
    enum: ['section1', 'section2', 'section3', 'section4']
  },
  pageType: { 
    type: String, 
    required: true,
    enum: ['our_work', 'about', 'services', 'contact', 'team', 'news', 'header', 'footer', 'general-info']
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  
  // Basic content
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  mainText: { type: String },
  
  // Arrays for different content types
  projects: [ProjectSchema],
  services: [ServiceSchema],
  team: [TeamMemberSchema],
  accordion: [AccordionItemSchema],
  categories: [{ type: String }],
  tags: [{ type: String }],
  
  // Statistics section
  statistics: {
    mainTitle: { type: String },
    subtitle: { type: String },
    stats: [StatisticSchema]
  },
  
  // Media
  backgroundImage: { type: String },
  images: [{ type: String }],
  
  // Layout and styling
  layoutSettings: LayoutSettingsSchema,
  styling: {
    backgroundColor: { type: String },
    textColor: { type: String },
    accentColor: { type: String },
    padding: { type: String },
    margin: { type: String }
  },
  
  // Custom fields for flexibility
  customFields: { type: mongoose.Schema.Types.Mixed },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: String },
  version: { type: Number, default: 1 }
});

// Pre-save middleware to update timestamps
SectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
SectionSchema.index({ pageType: 1, sectionType: 1 });
SectionSchema.index({ isActive: 1 });

module.exports = mongoose.model('Section', SectionSchema);
