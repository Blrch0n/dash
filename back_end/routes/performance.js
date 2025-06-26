const express = require("express");
const router = express.Router();
const performanceMonitor = require("../utils/performanceMonitor");
const { authenticateToken } = require("../middleware/auth/tokenAuth");

/**
 * @route GET /api/performance/stats
 * @desc Get upload performance statistics
 * @access Private
 */
router.get("/stats", authenticateToken, (req, res) => {
  try {
    const stats = performanceMonitor.getStats();
    const suggestions = performanceMonitor.getOptimizationSuggestions();

    res.json({
      success: true,
      message: "Performance statistics retrieved successfully",
      data: {
        stats,
        suggestions,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Performance stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve performance statistics",
      error: error.message,
    });
  }
});

/**
 * @route GET /api/performance/recent-uploads
 * @desc Get recent upload performance data
 * @access Private
 */
router.get("/recent-uploads", authenticateToken, (req, res) => {
  try {
    const stats = performanceMonitor.getStats();
    const recentUploads = stats.recentUploads.slice(-20); // Last 20 uploads

    res.json({
      success: true,
      message: "Recent uploads data retrieved successfully",
      data: {
        uploads: recentUploads,
        count: recentUploads.length,
        totalUploads: stats.totalUploads,
      },
    });
  } catch (error) {
    console.error("Recent uploads error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve recent uploads data",
      error: error.message,
    });
  }
});

module.exports = router;
