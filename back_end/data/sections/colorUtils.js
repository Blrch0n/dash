// Color utility to ensure all sections use colors from general-info
// Centralized color configuration based on general-info section

// Standard color configuration that matches general-info
const standardColors = {
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

// Get the standard color configuration
const getStandardColors = () => {
  return { ...standardColors };
};

// Get general info colors (alias for getStandardColors)
const getGeneralInfoColors = () => {
  return getStandardColors();
};

module.exports = {
  getGeneralInfoColors,
  getStandardColors,
  standardColors,
};
