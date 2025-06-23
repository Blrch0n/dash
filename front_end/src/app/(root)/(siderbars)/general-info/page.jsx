"use client";
import React, { useState, useEffect, useRef } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useFileUpload } from "../../../../hooks/useFileUpload";
import { api } from "../../../../services/api"; // Add API import

// Website metadata configuration
const websiteConfig = {
  title: "Real Dashboard - General Info",
  description:
    "Configure your website's general information, colors, and branding",
  favicon: "/favicon.ico",
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

const headerInfo = {
  title: "General Website Configuration",
  content:
    "Configure your website's title, icon, primary colors, and overall branding settings.",
  key: "general-info",
};

const DEFAULT_LABELS = ["Home", "About", "Services", "Contact", "Blog", "Help"];
const DEFAULT_IMAGE = null;

// Helper function to load configuration from database first, then localStorage as fallback
const loadConfigFromStorage = async () => {
  if (typeof window !== "undefined") {
    try {
      // Try to load from database first
      const response = await api.sections.getBySectionName("general-info");
      if (response.success && response.data.length > 0) {
        const dbConfig = response.data[0].data;
        return { ...websiteConfig, ...dbConfig };
      }
    } catch (error) {
      console.error("Error loading config from database:", error);
    }

    // Fallback to localStorage
    try {
      const stored = localStorage.getItem("websiteConfig");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading config from localStorage:", error);
    }
  }
  return websiteConfig;
};

// Helper function to save configuration to database only
const saveConfigToDatabase = async (config) => {
  try {
    // Save to database
    await api.saveSection({
      sectionName: "general-info",
      subsectionName: "main",
      title: config.siteTitle || config.title,
      content: config.siteDescription || config.description,
      data: config,
    });
  } catch (error) {
    console.error("Error saving config to database:", error);
    throw error;
  }
};

const page = () => {
  // Load initial configuration from database/localStorage or use defaults
  const [config, setConfig] = useState(websiteConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isInitialLoadRef = useRef(true);

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const loadedConfig = await loadConfigFromStorage();
        setConfig(loadedConfig);

        // Initialize all state with loaded values
        setSiteTitle(
          loadedConfig.siteTitle || loadedConfig.title || websiteConfig.title
        );
        setSiteDescription(
          loadedConfig.siteDescription ||
            loadedConfig.description ||
            websiteConfig.description
        );
        setFavicon(loadedConfig.favicon || websiteConfig.favicon);
        setPrimaryColor(
          loadedConfig.primaryColor || websiteConfig.primaryColor
        );
        setSecondaryColor(
          loadedConfig.secondaryColor || websiteConfig.secondaryColor
        );
        setAccentColor(loadedConfig.accentColor || websiteConfig.accentColor);
        setBackgroundColor(
          loadedConfig.backgroundColor || websiteConfig.backgroundColor
        );
        setTextColor(loadedConfig.textColor || websiteConfig.textColor);
        setScrolledBgColor(
          loadedConfig.scrolledBgColor || websiteConfig.scrolledBgColor
        );
        setScrolledTextColor(
          loadedConfig.scrolledTextColor || websiteConfig.scrolledTextColor
        );
        setHoverColor(loadedConfig.hoverColor || websiteConfig.hoverColor);
        setBorderColor(loadedConfig.borderColor || websiteConfig.borderColor);
        setLabels(loadedConfig.labels || DEFAULT_LABELS);
        setImage(loadedConfig.image || DEFAULT_IMAGE);

        // Don't mark as unsaved changes during initial load
        setHasUnsavedChanges(false);
        isInitialLoadRef.current = false;
      } catch (error) {
        console.error("Error loading configuration:", error);
        toast.error("Failed to load configuration from database");
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Update document title and favicon
  useEffect(() => {
    document.title = config.title || websiteConfig.title;

    // Update favicon
    const favicon =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    favicon.type = "image/x-icon";
    favicon.rel = "shortcut icon";
    favicon.href = config.favicon || websiteConfig.favicon;
    document.getElementsByTagName("head")[0].appendChild(favicon);
  }, [config.title, config.favicon]);

  const [viewMode, setViewMode] = useState("desktop");
  const [labels, setLabels] = useState(config.labels || DEFAULT_LABELS);
  const [image, setImage] = useState(config.image || DEFAULT_IMAGE);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  // File upload hook
  const { uploadImage, uploading } = useFileUpload();

  // Website configuration state - initialized from localStorage
  const [siteTitle, setSiteTitle] = useState(
    config.siteTitle || config.title || websiteConfig.title
  );
  const [siteDescription, setSiteDescription] = useState(
    config.siteDescription || config.description || websiteConfig.description
  );
  const [favicon, setFavicon] = useState(
    config.favicon || websiteConfig.favicon
  );

  // Color state - initialized from localStorage
  const [primaryColor, setPrimaryColor] = useState(
    config.primaryColor || websiteConfig.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState(
    config.secondaryColor || websiteConfig.secondaryColor
  );
  const [accentColor, setAccentColor] = useState(
    config.accentColor || websiteConfig.accentColor
  );
  const [backgroundColor, setBackgroundColor] = useState(
    config.backgroundColor || websiteConfig.backgroundColor
  );
  const [textColor, setTextColor] = useState(
    config.textColor || websiteConfig.textColor
  );
  const [scrolledBgColor, setScrolledBgColor] = useState(
    config.scrolledBgColor || websiteConfig.scrolledBgColor
  );
  const [scrolledTextColor, setScrolledTextColor] = useState(
    config.scrolledTextColor || websiteConfig.scrolledTextColor
  );
  const [hoverColor, setHoverColor] = useState(
    config.hoverColor || websiteConfig.hoverColor
  );
  const [borderColor, setBorderColor] = useState(
    config.borderColor || websiteConfig.borderColor
  );

  // Auto-save configuration to localStorage only (not database) whenever colors change
  useEffect(() => {
    // Skip if still loading initial data
    if (isLoading) return;

    const currentConfig = {
      siteTitle,
      siteDescription,
      favicon,
      primaryColor,
      secondaryColor,
      accentColor,
      backgroundColor,
      textColor,
      scrolledBgColor,
      scrolledTextColor,
      hoverColor,
      borderColor,
      labels,
      image,
      // Keep original properties for backward compatibility
      title: siteTitle,
      description: siteDescription,
    };

    // Save to localStorage only (for instant preview)
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("websiteConfig", JSON.stringify(currentConfig));
      } catch (error) {
        console.error("Error saving config to localStorage:", error);
      }
    }

    setConfig(currentConfig);

    // Only mark as unsaved if not during initial load
    if (!isInitialLoadRef.current) {
      setHasUnsavedChanges(true);
    }

    // Dispatch custom event to notify other pages about color changes
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("websiteConfigUpdate", {
          detail: currentConfig,
        })
      );
    }
  }, [
    siteTitle,
    siteDescription,
    favicon,
    primaryColor,
    secondaryColor,
    accentColor,
    backgroundColor,
    textColor,
    scrolledBgColor,
    scrolledTextColor,
    hoverColor,
    borderColor,
    labels,
    image,
    isLoading,
  ]);

  // Listen for configuration updates from other pages (disabled to prevent infinite loops)
  // This was causing setState loops when combined with auto-save useEffect
  /*
  useEffect(() => {
    const handleConfigUpdate = (event) => {
      const updatedConfig = event.detail;

      // Update state with new configuration
      setSiteTitle(updatedConfig.siteTitle || updatedConfig.title);
      setSiteDescription(
        updatedConfig.siteDescription || updatedConfig.description
      );
      setFavicon(updatedConfig.favicon);
      setPrimaryColor(updatedConfig.primaryColor);
      setSecondaryColor(updatedConfig.secondaryColor);
      setAccentColor(updatedConfig.accentColor);
      setBackgroundColor(updatedConfig.backgroundColor);
      setTextColor(updatedConfig.textColor);
      setScrolledBgColor(updatedConfig.scrolledBgColor);
      setScrolledTextColor(updatedConfig.scrolledTextColor);
      setHoverColor(updatedConfig.hoverColor);
      setBorderColor(updatedConfig.borderColor);
      setLabels(updatedConfig.labels || DEFAULT_LABELS);
      setImage(updatedConfig.image);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("websiteConfigUpdate", handleConfigUpdate);

      return () => {
        window.removeEventListener("websiteConfigUpdate", handleConfigUpdate);
      };
    }
  }, []);
  */

  // Simulate scroll effect for preview
  useEffect(() => {
    if (viewMode === "desktop") {
      const timer = setTimeout(() => {
        setIsScrolled(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  // Update document title when siteTitle changes
  useEffect(() => {
    document.title = siteTitle;
  }, [siteTitle]);

  const handleLabelChange = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedFile = await uploadImage(file, {
        onSuccess: (fileData) => {
          setImage(fileData.url);
        },
      });
    }
  };

  const handleFaviconChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadedFile = await uploadImage(file, {
        onSuccess: (fileData) => {
          setFavicon(fileData.url);
          // Update favicon in real-time
          const faviconLink =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
          faviconLink.type = "image/x-icon";
          faviconLink.rel = "shortcut icon";
          faviconLink.href = fileData.url;
          document.getElementsByTagName("head")[0].appendChild(faviconLink);
        },
      });
    }
  };

  const scrollToSection = (sectionName) => {
    setActiveSection(sectionName);
    setIsMobileMenuOpen(false);
  };

  // Manual save function for explicit saves to database
  const saveConfiguration = async () => {
    try {
      setIsLoading(true);

      const configToSave = {
        siteTitle,
        siteDescription,
        favicon,
        primaryColor,
        secondaryColor,
        accentColor,
        backgroundColor,
        textColor,
        scrolledBgColor,
        scrolledTextColor,
        hoverColor,
        borderColor,
        labels,
        image,
        title: siteTitle,
        description: siteDescription,
      };

      // Save to database only (localStorage already updated by useEffect)
      await saveConfigToDatabase(configToSave);

      // Update localStorage again to ensure sync
      if (typeof window !== "undefined") {
        localStorage.setItem("websiteConfig", JSON.stringify(configToSave));
      }

      // Dispatch event to notify other pages
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("websiteConfigUpdate", {
            detail: configToSave,
          })
        );
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false); // Clear unsaved changes flag
      toast.success("Configuration saved to database successfully!");
    } catch (error) {
      console.error("Error saving configuration:", error);
      toast.error("Failed to save configuration to database");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset to defaults
  const resetToDefaults = () => {
    if (
      confirm("Are you sure you want to reset all settings to default values?")
    ) {
      setSiteTitle(websiteConfig.title);
      setSiteDescription(websiteConfig.description);
      setFavicon(websiteConfig.favicon);
      setPrimaryColor(websiteConfig.primaryColor);
      setSecondaryColor(websiteConfig.secondaryColor);
      setAccentColor(websiteConfig.accentColor);
      setBackgroundColor(websiteConfig.backgroundColor);
      setTextColor(websiteConfig.textColor);
      setScrolledBgColor(websiteConfig.scrolledBgColor);
      setScrolledTextColor(websiteConfig.scrolledTextColor);
      setHoverColor(websiteConfig.hoverColor);
      setBorderColor(websiteConfig.borderColor);
      setLabels(DEFAULT_LABELS);
      setImage(DEFAULT_IMAGE);
    }
  };

  const PreviewComponent = ({ isMobile }) => (
    // ...existing PreviewComponent code remains the same...
    <div
      className={`border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: borderColor,
      }}
    >
      {/* Header */}
      <section
        className="w-full h-fit relative flex items-center justify-center"
        style={{
          backgroundColor:
            isScrolled && !isMobile ? scrolledBgColor : primaryColor,
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-center absolute inset-0 transition-all duration-300 ease-in-out ${
            isScrolled && !isMobile
              ? "backdrop-blur-sm shadow-lg"
              : "bg-transparent"
          }`}
          style={{
            backgroundColor:
              isScrolled && !isMobile ? `${scrolledBgColor}F2` : "transparent",
          }}
        />
        <div className="w-full h-fit flex items-center justify-between px-4 py-3 relative z-10">
          {/* Logo */}
          <div className="flex-shrink-0">
            {image ? (
              <img
                className={`cursor-pointer transition-all duration-300 ${
                  isMobile ? "w-[120px] h-[30px]" : "w-[140px] h-[36px]"
                }`}
                src={image}
                onClick={() => scrollToSection("home")}
                alt="Logo"
                style={{
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                className={`cursor-pointer transition-all duration-300 border-2 border-dashed rounded-lg flex items-center justify-center ${
                  isMobile ? "w-[120px] h-[30px]" : "w-[140px] h-[36px]"
                }`}
                onClick={() => scrollToSection("home")}
                style={{
                  borderColor:
                    isScrolled && !isMobile
                      ? `${scrolledTextColor}80`
                      : `${textColor}80`,
                  color:
                    isScrolled && !isMobile
                      ? `${scrolledTextColor}B3`
                      : `${textColor}B3`,
                }}
              >
                <span
                  className={`text-xs ${isMobile ? "text-[10px]" : "text-xs"}`}
                >
                  Logo
                </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <ul className="flex items-center justify-center gap-6 text-[14px] font-semibold">
              {labels.map((link, index) => {
                const isActive = activeSection === link;
                return (
                  <li
                    key={index}
                    onClick={() => scrollToSection(link)}
                    className="cursor-pointer transition-all duration-200 ease-in-out relative group"
                    style={{
                      color: isActive
                        ? accentColor
                        : isScrolled
                        ? scrolledTextColor
                        : textColor,
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.target.style.color = hoverColor;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.target.style.color = isScrolled
                          ? scrolledTextColor
                          : textColor;
                      }
                    }}
                  >
                    {link.toUpperCase()}
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ease-in-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                      style={{ backgroundColor: accentColor }}
                    />
                  </li>
                );
              })}
            </ul>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              className="p-2 transition-all duration-300 active:scale-95 hover:bg-black/10 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                color: isScrolled ? scrolledTextColor : textColor,
              }}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <IoMdMenu
                  size={24}
                  className={`absolute transition-all duration-300 transform ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <IoClose
                  size={24}
                  className={`absolute transition-all duration-300 transform ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <div
              className={`absolute top-full left-0 right-0 transition-all duration-300 ease-out transform ${
                isMobileMenuOpen
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-4 pointer-events-none"
              }`}
            >
              <div
                className="backdrop-blur-md shadow-xl border-t rounded-b-lg mx-2 border-gray-200"
                style={{
                  backgroundColor: backgroundColor,
                  borderColor: borderColor,
                }}
              >
                <ul className="flex flex-col py-2">
                  {labels.map((link, index) => {
                    const isActive = activeSection === link;
                    return (
                      <li
                        key={index}
                        onClick={() => scrollToSection(link)}
                        className="cursor-pointer px-6 py-4 text-[14px] font-semibold border-l-4 transition-all duration-300 ease-out relative overflow-hidden group"
                        style={{
                          color: isActive ? accentColor : textColor,
                          borderLeftColor: isActive
                            ? accentColor
                            : "transparent",
                          backgroundColor: isActive
                            ? `${primaryColor}20`
                            : "transparent",
                          animationDelay: isMobileMenuOpen
                            ? `${index * 50}ms`
                            : "0ms",
                        }}
                      >
                        <div
                          className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                          style={{
                            background: `linear-gradient(to right, ${primaryColor}10, ${secondaryColor}10)`,
                          }}
                        />
                        <span className="relative z-10 block transform transition-transform duration-200 group-hover:translate-x-1">
                          {link.toUpperCase()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sample content area */}
      <div
        className="p-8 min-h-[600px]"
        style={{ backgroundColor: `${backgroundColor}F5` }}
      >
        <div className="text-center" style={{ color: `${textColor}80` }}>
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: primaryColor }}
          >
            {siteTitle}
          </h2>
          <p className="mb-4">{siteDescription}</p>
          <p>Content area preview</p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Loading configuration from database...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
      {/* Preview Section */}
      <div className="h-full w-[70%] bg-white rounded-lg p-4 overflow-auto">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "desktop"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                backgroundColor:
                  viewMode === "desktop" ? primaryColor : "transparent",
              }}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "mobile"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                backgroundColor:
                  viewMode === "mobile" ? primaryColor : "transparent",
              }}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex justify-center items-center w-full">
          <div
            className="transition-all duration-500 ease-in-out mx-auto"
            style={{
              width: viewMode === "mobile" ? "22rem" : "100%",
              transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
            }}
          >
            <PreviewComponent isMobile={viewMode === "mobile"} />
          </div>
        </div>
      </div>

      {/* Configuration Section */}
      <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          Website Configuration
        </h3>

        {/* Database Status */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm font-medium text-blue-800">
              Database Connected
            </span>
          </div>
          <p className="text-xs text-blue-600">
            Configuration is automatically synced with your MongoDB database.
            Changes are saved to both localStorage (for instant preview) and
            database (for persistence).
          </p>
        </div>

        {/* Site Info */}
        <div className="mb-6 space-y-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            Site Information
          </h4>

          {/* Site Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Website Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              placeholder="Enter website title"
            />
          </div>

          {/* Site Description */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Website Description
            </label>
            <textarea
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows="3"
              placeholder="Enter website description"
            />
          </div>
        </div>

        {/* Color System */}
        <div className="mb-6 space-y-4">
          <h4 className="text-md font-semibold text-gray-800 mb-3">
            Color System
          </h4>

          {/* Primary Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Secondary Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Accent Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Background Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Background Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Text Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Hover Color */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Hover Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={hoverColor}
                onChange={(e) => setHoverColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={hoverColor}
                onChange={(e) => setHoverColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          {/* Scrolled States */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scrolled Background Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={scrolledBgColor}
                onChange={(e) => setScrolledBgColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={scrolledBgColor}
                onChange={(e) => setScrolledBgColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Scrolled Text Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={scrolledTextColor}
                onChange={(e) => setScrolledTextColor(e.target.value)}
                className="w-12 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={scrolledTextColor}
                onChange={(e) => setScrolledTextColor(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="text-xs text-orange-600 text-center bg-orange-50 p-2 rounded border border-orange-200">
              ⚠️ You have unsaved changes. Click "Save" to persist to database.
            </div>
          )}

          {/* Last Saved Indicator */}
          {lastSaved && !hasUnsavedChanges && (
            <div className="text-xs text-green-600 text-center bg-green-50 p-2 rounded border border-green-200">
              ✓ Last saved to database: {lastSaved.toLocaleString()}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={saveConfiguration}
            disabled={isLoading}
            className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isLoading ? "#9CA3AF" : primaryColor,
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = secondaryColor;
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.backgroundColor = primaryColor;
              }
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Saving to Database...
              </div>
            ) : hasUnsavedChanges ? (
              "💾 Save Changes to Database"
            ) : (
              "✓ Saved to Database"
            )}
          </button>

          {/* Reset Button */}
          <button
            onClick={resetToDefaults}
            className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors font-medium"
          >
            Reset to Defaults
          </button>

          {/* Test Database Connection Button */}
          <button
            onClick={async () => {
              try {
                setIsLoading(true);
                const response = await api.sections.getBySectionName(
                  "general-info"
                );
                if (response.success) {
                  toast.success(
                    `Database connected! Found ${response.data.length} general-info sections.`
                  );
                } else {
                  toast.error("Database connection failed.");
                }
              } catch (error) {
                toast.error(`Database error: ${error.message}`);
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors font-medium text-sm disabled:opacity-50"
          >
            Test Database Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
