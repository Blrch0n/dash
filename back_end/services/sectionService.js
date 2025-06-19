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
}

module.exports = SectionService;
