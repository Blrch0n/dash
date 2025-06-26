const SectionService = require("../services/sectionService");
const { cleanupFiles } = require("../middleware/imageProcessor");

// @desc    Get all sections
const getAllSections = async (req, res) => {
  try {
    const sections = await SectionService.getAllSectionsWithGlobalColors();
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
};

// @desc    Get sections by section name
const getSectionsByName = async (req, res) => {
  try {
    const { sectionName } = req.params;
    const sections = await SectionService.getSectionsByName(sectionName);

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
};

// @desc    Get specific subsection
const getSubsection = async (req, res) => {
  try {
    const { sectionName, subsectionName } = req.params;
    const section = await SectionService.getSubsection(
      sectionName,
      subsectionName
    );

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
};

// @desc    Create or update a section
const createOrUpdateSection = async (req, res) => {
  try {
    const { sectionName, subsectionName } = req.body;

    // Validate required fields
    if (!sectionName) {
      // Clean up any uploaded files on validation error
      if (req.files) {
        cleanupFiles(req.files);
      }
      return res.status(400).json({
        success: false,
        message: "sectionName is required",
      });
    }

    const { section, isNew } = await SectionService.findOrCreateSection(
      req.body
    );

    // If the section is general-info, apply colors to all other sections
    if (
      sectionName === "general-info" &&
      (subsectionName === "main" || !subsectionName)
    ) {
      try {
        // Extract the new colors from the updated general-info section
        const newColors = {};
        if (req.body.data && req.body.data.colors) {
          // Use colors object instead of individual properties
          Object.assign(newColors, req.body.data.colors);
        }

        if (Object.keys(newColors).length > 0) {
          const updatedCount =
            await SectionService.updateAllSectionsWithGlobalColors(newColors);
          console.log(
            `Applied global colors to ${updatedCount} sections after general-info update`
          );
        }
      } catch (error) {
        console.error("Error applying global colors:", error);
        // Don't fail the main request if color update fails
      }
    }

    res.status(isNew ? 201 : 200).json({
      success: true,
      message: isNew
        ? "Section created successfully"
        : "Section updated successfully",
      data: section,
    });
  } catch (error) {
    // Clean up any uploaded files on error
    if (req.files) {
      cleanupFiles(req.files);
    }

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
};

// @desc    Update section by ID
const updateSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await SectionService.updateSectionById(id, req.body);

    if (!section) {
      // Clean up any uploaded files if section not found
      if (req.files) {
        cleanupFiles(req.files);
      }
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // If the updated section is general-info, apply colors to all other sections
    if (
      section.sectionName === "general-info" &&
      section.subsectionName === "main"
    ) {
      try {
        // Extract the new colors from the updated section
        const newColors = {};
        if (req.body.data && req.body.data.colors) {
          // Use colors object instead of individual properties
          Object.assign(newColors, req.body.data.colors);
        }

        if (Object.keys(newColors).length > 0) {
          const updatedCount =
            await SectionService.updateAllSectionsWithGlobalColors(newColors);
          console.log(
            `Applied global colors to ${updatedCount} sections after general-info update by ID`
          );
        }
      } catch (error) {
        console.error("Error applying global colors:", error);
        // Don't fail the main request if color update fails
      }
    }

    res.json({
      success: true,
      message: "Section updated successfully",
      data: section,
    });
  } catch (error) {
    // Clean up any uploaded files on error
    if (req.files) {
      cleanupFiles(req.files);
    }

    res.status(500).json({
      success: false,
      message: "Error updating section",
      error: error.message,
    });
  }
};

// @desc    Delete section by ID
const deleteSectionById = async (req, res) => {
  try {
    const { id } = req.params;
    const section = await SectionService.deleteSectionById(id);

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
};

// @desc    Bulk create/update sections
const bulkUpdateSections = async (req, res) => {
  try {
    const { sections } = req.body;

    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: "sections must be an array",
      });
    }

    const results = await SectionService.bulkUpdateSections(sections);

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
};

// @desc    Apply global colors to all sections
const applyGlobalColors = async (req, res) => {
  try {
    const globalColors = await SectionService.getGlobalColors();
    const updatedCount = await SectionService.updateAllSectionsWithGlobalColors(
      globalColors
    );

    res.json({
      success: true,
      message: `Applied global colors to ${updatedCount} sections`,
      updatedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying global colors",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSections,
  getSectionsByName,
  getSubsection,
  createOrUpdateSection,
  updateSectionById,
  deleteSectionById,
  bulkUpdateSections,
  applyGlobalColors,
};
