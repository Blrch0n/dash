const express = require('express');
const router = express.Router();
const Section = require('../models/Section');
const { validateSection } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// Get all sections for a specific page
router.get('/:pageType', async (req, res) => {
  try {
    const { pageType } = req.params;
    const { sectionType, active } = req.query;
    
    let query = { pageType };
    
    if (sectionType) {
      query.sectionType = sectionType;
    }
    
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    const sections = await Section.find(query).sort({ order: 1, createdAt: 1 });
    
    res.json({
      success: true,
      data: sections,
      count: sections.length
    });
  } catch (error) {
    console.error('Error fetching sections:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sections',
      error: error.message
    });
  }
});

// Get a specific section
router.get('/:pageType/:sectionType', async (req, res) => {
  try {
    const { pageType, sectionType } = req.params;
    
    const section = await Section.findOne({ pageType, sectionType });
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    res.json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch section',
      error: error.message
    });
  }
});

// Create a new section
router.post('/:pageType/:sectionType', auth, validateSection, async (req, res) => {
  try {
    const { pageType, sectionType } = req.params;
    const sectionData = {
      ...req.body,
      pageType,
      sectionType,
      createdBy: req.user?.id
    };
    
    // Check if section already exists
    const existingSection = await Section.findOne({ pageType, sectionType });
    if (existingSection) {
      return res.status(409).json({
        success: false,
        message: 'Section already exists for this page and type'
      });
    }
    
    const section = new Section(sectionData);
    await section.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`${pageType}-${sectionType}`).emit('section-created', {
      pageType,
      sectionType,
      data: section
    });
    
    res.status(201).json({
      success: true,
      message: 'Section created successfully',
      data: section
    });
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create section',
      error: error.message
    });
  }
});

// Update a section
router.put('/:pageType/:sectionType', auth, validateSection, async (req, res) => {
  try {
    const { pageType, sectionType } = req.params;
    
    const section = await Section.findOneAndUpdate(
      { pageType, sectionType },
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`${pageType}-${sectionType}`).emit('section-updated', {
      pageType,
      sectionType,
      data: section
    });
    
    res.json({
      success: true,
      message: 'Section updated successfully',
      data: section
    });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section',
      error: error.message
    });
  }
});

// Delete a section
router.delete('/:pageType/:sectionType', auth, async (req, res) => {
  try {
    const { pageType, sectionType } = req.params;
    
    const section = await Section.findOneAndDelete({ pageType, sectionType });
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`${pageType}-${sectionType}`).emit('section-deleted', {
      pageType,
      sectionType
    });
    
    res.json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete section',
      error: error.message
    });
  }
});

// Toggle section active status
router.patch('/:pageType/:sectionType/toggle', auth, async (req, res) => {
  try {
    const { pageType, sectionType } = req.params;
    
    const section = await Section.findOne({ pageType, sectionType });
    
    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }
    
    section.isActive = !section.isActive;
    section.updatedAt = new Date();
    await section.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(`${pageType}-${sectionType}`).emit('section-toggled', {
      pageType,
      sectionType,
      isActive: section.isActive
    });
    
    res.json({
      success: true,
      message: `Section ${section.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: section.isActive }
    });
  } catch (error) {
    console.error('Error toggling section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle section',
      error: error.message
    });
  }
});

// Bulk operations
router.post('/bulk/update-order', auth, async (req, res) => {
  try {
    const { sections } = req.body; // Array of { pageType, sectionType, order }
    
    if (!Array.isArray(sections)) {
      return res.status(400).json({
        success: false,
        message: 'Sections must be an array'
      });
    }
    
    const bulkOps = sections.map(({ pageType, sectionType, order }) => ({
      updateOne: {
        filter: { pageType, sectionType },
        update: { order, updatedAt: new Date() }
      }
    }));
    
    await Section.bulkWrite(bulkOps);
    
    res.json({
      success: true,
      message: 'Section order updated successfully'
    });
  } catch (error) {
    console.error('Error updating section order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update section order',
      error: error.message
    });
  }
});

module.exports = router;
