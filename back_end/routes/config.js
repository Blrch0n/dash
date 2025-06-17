const express = require('express');
const router = express.Router();
const WebsiteConfig = require('../models/Config');
const { validateConfig } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// Get website configuration
router.get('/', async (req, res) => {
  try {
    const config = await WebsiteConfig.getOrCreateDefault();
    
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration',
      error: error.message
    });
  }
});

// Update website configuration
router.put('/', auth, validateConfig, async (req, res) => {
  try {
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      config = new WebsiteConfig(req.body);
    } else {
      Object.assign(config, req.body);
      config.updatedAt = new Date();
      config.updatedBy = req.user?.id;
    }
    
    await config.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('config-updated', {
      data: config,
      updatedBy: req.user?.name || 'Unknown'
    });
    
    res.json({
      success: true,
      message: 'Configuration updated successfully',
      data: config
    });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update configuration',
      error: error.message
    });
  }
});

// Get specific config section
router.get('/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const config = await WebsiteConfig.getOrCreateDefault();
    
    if (!config[section]) {
      return res.status(404).json({
        success: false,
        message: `Configuration section '${section}' not found`
      });
    }
    
    res.json({
      success: true,
      data: config[section]
    });
  } catch (error) {
    console.error('Error fetching config section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch configuration section',
      error: error.message
    });
  }
});

// Update specific config section
router.put('/:section', auth, async (req, res) => {
  try {
    const { section } = req.params;
    let config = await WebsiteConfig.getOrCreateDefault();
    
    if (!config.schema.paths[section]) {
      return res.status(400).json({
        success: false,
        message: `Invalid configuration section '${section}'`
      });
    }
    
    config[section] = { ...config[section], ...req.body };
    config.updatedAt = new Date();
    config.updatedBy = req.user?.id;
    
    await config.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('config-section-updated', {
      section,
      data: config[section],
      updatedBy: req.user?.name || 'Unknown'
    });
    
    res.json({
      success: true,
      message: `Configuration section '${section}' updated successfully`,
      data: config[section]
    });
  } catch (error) {
    console.error('Error updating config section:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update configuration section',
      error: error.message
    });
  }
});

// Reset configuration to defaults
router.post('/reset', auth, async (req, res) => {
  try {
    await WebsiteConfig.deleteMany({});
    const defaultConfig = await WebsiteConfig.getOrCreateDefault();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('config-reset', {
      data: defaultConfig,
      resetBy: req.user?.name || 'Unknown'
    });
    
    res.json({
      success: true,
      message: 'Configuration reset to defaults successfully',
      data: defaultConfig
    });
  } catch (error) {
    console.error('Error resetting config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset configuration',
      error: error.message
    });
  }
});

// Export configuration as JSON
router.get('/export/json', auth, async (req, res) => {
  try {
    const config = await WebsiteConfig.getOrCreateDefault();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="website-config.json"');
    
    res.json(config);
  } catch (error) {
    console.error('Error exporting config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export configuration',
      error: error.message
    });
  }
});

// Import configuration from JSON
router.post('/import/json', auth, async (req, res) => {
  try {
    const importedConfig = req.body;
    
    // Validate that it's a valid config object
    if (!importedConfig || typeof importedConfig !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid configuration data'
      });
    }
    
    let config = await WebsiteConfig.findOne();
    
    if (!config) {
      config = new WebsiteConfig(importedConfig);
    } else {
      // Merge with existing config, excluding metadata fields
      const { _id, createdAt, version, ...dataToImport } = importedConfig;
      Object.assign(config, dataToImport);
      config.updatedAt = new Date();
      config.updatedBy = req.user?.id;
    }
    
    await config.save();
    
    // Emit real-time update
    const io = req.app.get('io');
    io.emit('config-imported', {
      data: config,
      importedBy: req.user?.name || 'Unknown'
    });
    
    res.json({
      success: true,
      message: 'Configuration imported successfully',
      data: config
    });
  } catch (error) {
    console.error('Error importing config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to import configuration',
      error: error.message
    });
  }
});

module.exports = router;
