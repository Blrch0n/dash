const express = require("express");
const router = express.Router();
const Section = require("../models/Section");

// Get all sections
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find().sort({ sectionName: 1, order: 1 });
    res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sections",
      error: error.message,
    });
  }
});

// Get sections by section name
router.get("/:sectionName", async (req, res) => {
  try {
    const { sectionName } = req.params;
    const sections = await Section.find({ sectionName }).sort({ order: 1 });

    if (sections.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No sections found for ${sectionName}`,
      });
    }

    res.json({
      success: true,
      data: sections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching section",
      error: error.message,
    });
  }
});

// Get specific subsection
router.get("/:sectionName/:subsectionName", async (req, res) => {
  try {
    const { sectionName, subsectionName } = req.params;
    const section = await Section.findOne({ sectionName, subsectionName });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: `Section ${sectionName}/${subsectionName} not found`,
      });
    }

    res.json({
      success: true,
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching section",
      error: error.message,
    });
  }
});

// Create or update a section
router.post("/", async (req, res) => {
  try {
    const {
      sectionName,
      subsectionName,
      title,
      content,
      data,
      isActive,
      order,
    } = req.body;

    // Validate required fields
    if (!sectionName) {
      return res.status(400).json({
        success: false,
        message: "sectionName is required",
      });
    }

    // Check if section already exists
    const existingSection = await Section.findOne({
      sectionName,
      subsectionName: subsectionName || "main",
    });

    if (existingSection) {
      // Update existing section
      existingSection.title = title || existingSection.title;
      existingSection.content = content || existingSection.content;
      existingSection.data = data || existingSection.data;
      existingSection.isActive =
        isActive !== undefined ? isActive : existingSection.isActive;
      existingSection.order =
        order !== undefined ? order : existingSection.order;
      existingSection.lastUpdated = new Date();

      await existingSection.save();

      res.json({
        success: true,
        message: "Section updated successfully",
        data: existingSection,
      });
    } else {
      // Create new section
      const newSection = new Section({
        sectionName,
        subsectionName: subsectionName || "main",
        title: title || "",
        content: content || "",
        data: data || {},
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      });

      await newSection.save();

      res.status(201).json({
        success: true,
        message: "Section created successfully",
        data: newSection,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({
        success: false,
        message: "Section with this name and subsection already exists",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error creating/updating section",
        error: error.message,
      });
    }
  }
});

// Update section by ID
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, lastUpdated: new Date() };

    const section = await Section.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating section",
      error: error.message,
    });
  }
});

// Delete section by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    res.json({
      success: true,
      message: "Section deleted successfully",
      data: section,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting section",
      error: error.message,
    });
  }
});

// Bulk create/update sections (useful for frontend data sync)
router.post("/bulk", async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: "sections must be an array",
      });
    }

    const results = [];

    for (const sectionData of sections) {
      const { sectionName, subsectionName, ...rest } = sectionData;

      if (!sectionName) {
        results.push({
          error: "sectionName is required",
          data: sectionData,
        });
        continue;
      }

      try {
        const section = await Section.findOneAndUpdate(
          { sectionName, subsectionName: subsectionName || "main" },
          { ...rest, lastUpdated: new Date() },
          { upsert: true, new: true, runValidators: true }
        );

        results.push({
          success: true,
          data: section,
        });
      } catch (error) {
        results.push({
          error: error.message,
          data: sectionData,
        });
      }
    }

    res.json({
      success: true,
      message: "Bulk operation completed",
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in bulk operation",
      error: error.message,
    });
  }
});

module.exports = router;
