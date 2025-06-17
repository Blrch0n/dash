const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    // Main section name (about, contact, footer, etc.)
    sectionName: {
      type: String,
      required: true,
      enum: [
        "about",
        "contact",
        "footer",
        "general-info",
        "header",
        "news",
        "our_work",
        "services",
        "team",
        "webpage",
      ],
    },

    // Subsection name (section1, section2, etc.)
    subsectionName: {
      type: String,
      default: "main",
    },

    // Page data
    title: {
      type: String,
      default: "",
    },

    content: {
      type: String,
      default: "",
    },

    // Additional data that can be customized per section
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Metadata
    isActive: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
SectionSchema.index({ sectionName: 1, subsectionName: 1 }, { unique: true });

module.exports = mongoose.model("Section", SectionSchema);
