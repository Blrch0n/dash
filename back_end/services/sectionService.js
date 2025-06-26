const Section = require("../models/Section");

class SectionService {
  /**
   * Get all sections with optional filtering and sorting
   */
  static async getAllSections(
    filters = {},
    sort = { sectionName: 1, order: 1 }
  ) {
    return await Section.find(filters).sort(sort);
  }

  /**
   * Get sections by section name
   */
  static async getSectionsByName(sectionName, sort = { order: 1 }) {
    return await Section.find({ sectionName }).sort(sort);
  }

  /**
   * Get a specific subsection
   */
  static async getSubsection(sectionName, subsectionName) {
    return await Section.findOne({ sectionName, subsectionName });
  }

  /**
   * Create a new section
   */
  static async createSection(sectionData) {
    const {
      sectionName,
      subsectionName = "main",
      title = "",
      content = "",
      data = {},
      isActive = true,
      order = 0,
    } = sectionData;

    const newSection = new Section({
      sectionName,
      subsectionName,
      title,
      content,
      data,
      isActive,
      order,
    });

    return await newSection.save();
  }

  /**
   * Update an existing section
   */
  static async updateSection(existingSection, updateData) {
    const { title, content, data, isActive, order } = updateData;

    if (title !== undefined) existingSection.title = title;
    if (content !== undefined) existingSection.content = content;
    if (data !== undefined) existingSection.data = data;
    if (isActive !== undefined) existingSection.isActive = isActive;
    if (order !== undefined) existingSection.order = order;

    existingSection.lastUpdated = new Date();

    return await existingSection.save();
  }

  /**
   * Find or create a section
   */
  static async findOrCreateSection(sectionData) {
    const { sectionName, subsectionName = "main" } = sectionData;

    const existingSection = await Section.findOne({
      sectionName,
      subsectionName,
    });

    if (existingSection) {
      return {
        section: await this.updateSection(existingSection, sectionData),
        isNew: false,
      };
    } else {
      return {
        section: await this.createSection(sectionData),
        isNew: true,
      };
    }
  }

  /**
   * Update section by ID
   */
  static async updateSectionById(id, updateData) {
    const data = { ...updateData, lastUpdated: new Date() };

    return await Section.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete section by ID
   */
  static async deleteSectionById(id) {
    return await Section.findByIdAndDelete(id);
  }

  /**
   * Bulk update sections
   */
  static async bulkUpdateSections(sectionsData) {
    const results = [];

    for (const sectionData of sectionsData) {
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

    return results;
  }

  /**
   * Check if section exists
   */
  static async sectionExists(sectionName, subsectionName = "main") {
    const section = await Section.findOne({ sectionName, subsectionName });
    return !!section;
  }

  /**
   * Get global colors from general-info section
   */
  static async getGlobalColors() {
    const generalInfo = await Section.findOne({
      sectionName: "general-info",
      subsectionName: "main",
    });

    if (generalInfo && generalInfo.data) {
      return {
        primaryColor: generalInfo.data.primaryColor || "#3B82F6",
        secondaryColor: generalInfo.data.secondaryColor || "#1E40AF",
        accentColor: generalInfo.data.accentColor || "#EF4444",
        backgroundColor: generalInfo.data.backgroundColor || "#FFFFFF",
        textColor: generalInfo.data.textColor || "#1F2937",
        scrolledBgColor: generalInfo.data.scrolledBgColor || "#FFFFFF",
        scrolledTextColor: generalInfo.data.scrolledTextColor || "#1F2937",
        hoverColor: generalInfo.data.hoverColor || "#3B82F6",
        borderColor: generalInfo.data.borderColor || "#E5E7EB",
      };
    }

    // Return default colors if general-info not found
    return {
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#EF4444",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      scrolledBgColor: "#FFFFFF",
      scrolledTextColor: "#1F2937",
      hoverColor: "#3B82F6",
      borderColor: "#E5E7EB",
    };
  }

  /**
   * Apply global colors to ALL sections (overwrite existing colors)
   */
  static async applyGlobalColorsToAllSections() {
    try {
      const globalColors = await this.getGlobalColors();

      // Get all sections except general-info
      const sections = await Section.find({
        $not: {
          $and: [{ sectionName: "general-info" }, { subsectionName: "main" }],
        },
      });

      const updatePromises = sections.map(async (section) => {
        // Always update colors with global colors (overwrite existing)
        const updatedData = {
          ...section.data,
          colors: globalColors,
        };

        return Section.findByIdAndUpdate(
          section._id,
          {
            data: updatedData,
            lastUpdated: new Date(),
          },
          { new: true }
        );
      });

      const updatedSections = await Promise.all(updatePromises);
      console.log(
        `Updated ${updatedSections.length} sections with new global colors`
      );

      return updatedSections;
    } catch (error) {
      console.error("Error applying global colors to all sections:", error);
      throw error;
    }
  }

  /**
   * Get all sections with global colors applied
   */
  static async getAllSectionsWithGlobalColors(
    filters = {},
    sort = { sectionName: 1, order: 1 }
  ) {
    const globalColors = await this.getGlobalColors();
    const sections = await Section.find(filters).sort(sort);

    // Apply global colors to sections that don't have their own colors
    return sections.map((section) => {
      const sectionObj = section.toObject();

      // If section doesn't have colors in data, apply global colors
      if (!sectionObj.data || !sectionObj.data.colors) {
        sectionObj.data = {
          ...sectionObj.data,
          colors: globalColors,
        };
      }

      return sectionObj;
    });
  }

  /**
   * Update all sections with new global colors from general-info
   */
  static async updateAllSectionsWithGlobalColors(newGlobalColors) {
    try {
      // Get all sections
      const sections = await Section.find({});

      const updatePromises = sections.map(async (section) => {
        // Update the colors in the section's data
        const updatedData = {
          ...section.data,
          colors: {
            ...section.data?.colors,
            ...newGlobalColors,
          },
        };

        return Section.findByIdAndUpdate(
          section._id,
          {
            data: updatedData,
            lastUpdated: new Date(),
          },
          { new: true }
        );
      });

      await Promise.all(updatePromises);
      console.log(
        `Updated colors for ${sections.length} sections with new global colors`
      );

      return sections.length;
    } catch (error) {
      console.error("Error updating sections with global colors:", error);
      throw error;
    }
  }
}

module.exports = SectionService;
