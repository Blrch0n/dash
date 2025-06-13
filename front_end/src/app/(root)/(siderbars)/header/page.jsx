"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";

const headerInfo = {
  title: "Header",
  content:
    "Header нь таны вэбсайтын дээд хэсэг бөгөөд лого болон навигацийн цэсийг агуулдаг.",
  key: "header",
};

const DEFAULT_LABELS = [
  "Нүүр хуудас",
  "Тухай",
  "Үйлчилгээ",
  "Холбоо барих",
  "Блог",
  "Тусламж",
];

// Default website configuration
const defaultWebsiteConfig = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  accentColor: "#EF4444",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  scrolledBgColor: "#FFFFFF",
  scrolledTextColor: "#1F2937",
  hoverColor: "#3B82F6",
  borderColor: "#E5E7EB",
  image: null,
  labels: [
    "Нүүр хуудас",
    "Тухай",
    "Үйлчилгээ",
    "Холбоо барих",
    "Блог",
    "Тусламж",
  ],
};

// Helper function to load configuration from localStorage
const loadConfigFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("websiteConfig");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading config from localStorage:", error);
    }
  }
  return defaultWebsiteConfig;
};

// Helper function to save configuration to localStorage
const saveConfigToStorage = (config) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("websiteConfig", JSON.stringify(config));
    } catch (error) {
      console.error("Error saving config to localStorage:", error);
    }
  }
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClient, setIsClient] = useState(false);

  // Initialize with default configuration
  const [websiteConfig, setWebsiteConfig] = useState(defaultWebsiteConfig);
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [image, setImage] = useState(null);

  // Color state based on website configuration
  const [backgroundColor, setBackgroundColor] = useState(
    defaultWebsiteConfig.primaryColor
  );
  const [textColor, setTextColor] = useState(defaultWebsiteConfig.textColor);
  const [scrolledBgColor, setScrolledBgColor] = useState(
    defaultWebsiteConfig.scrolledBgColor
  );
  const [scrolledTextColor, setScrolledTextColor] = useState(
    defaultWebsiteConfig.scrolledTextColor
  );
  const [accentColor, setAccentColor] = useState(
    defaultWebsiteConfig.accentColor
  );
  const [hoverColor, setHoverColor] = useState(defaultWebsiteConfig.hoverColor);
  const [primaryColor, setPrimaryColor] = useState(
    defaultWebsiteConfig.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState(
    defaultWebsiteConfig.secondaryColor
  );
  const [borderColor, setBorderColor] = useState(
    defaultWebsiteConfig.borderColor
  );

  // Load configuration from localStorage after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);
    setLabels(loadedConfig.labels || DEFAULT_LABELS);
    setImage(loadedConfig.image || null);

    // Update color states
    setBackgroundColor(loadedConfig.primaryColor);
    setTextColor(loadedConfig.textColor);
    setScrolledBgColor(loadedConfig.scrolledBgColor);
    setScrolledTextColor(loadedConfig.scrolledTextColor);
    setAccentColor(loadedConfig.accentColor);
    setHoverColor(loadedConfig.hoverColor);
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setBorderColor(loadedConfig.borderColor);
  }, []);

  // Auto-save function for image and labels
  const saveHeaderConfig = () => {
    if (!isClient) return;

    const updatedConfig = {
      ...websiteConfig,
      labels,
      image,
    };

    setWebsiteConfig(updatedConfig);
    saveConfigToStorage(updatedConfig);

    // Dispatch event to notify other pages
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("websiteConfigUpdate", {
          detail: updatedConfig,
        })
      );
    }
  };

  // Auto-save when labels or image change (only after client mount)
  useEffect(() => {
    if (isClient) {
      saveHeaderConfig();
    }
  }, [labels, image, isClient]);

  // Listen for configuration updates from other pages
  useEffect(() => {
    if (!isClient) return;

    const handleConfigUpdate = (event) => {
      const updatedConfig = event.detail;
      setWebsiteConfig(updatedConfig);

      // Update color states
      setBackgroundColor(updatedConfig.primaryColor);
      setTextColor(updatedConfig.textColor);
      setScrolledBgColor(updatedConfig.scrolledBgColor);
      setScrolledTextColor(updatedConfig.scrolledTextColor);
      setAccentColor(updatedConfig.accentColor);
      setHoverColor(updatedConfig.hoverColor);
      setPrimaryColor(updatedConfig.primaryColor);
      setSecondaryColor(updatedConfig.secondaryColor);
      setBorderColor(updatedConfig.borderColor);

      // Update labels and image if they exist in the config
      if (updatedConfig.labels) {
        setLabels(updatedConfig.labels);
      }
      if (updatedConfig.hasOwnProperty("image")) {
        setImage(updatedConfig.image);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "websiteConfig") {
        try {
          const newConfig = JSON.parse(event.newValue);
          handleConfigUpdate({ detail: newConfig });
        } catch (error) {
          console.error("Error parsing storage change:", error);
        }
      }
    };

    window.addEventListener("websiteConfigUpdate", handleConfigUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("websiteConfigUpdate", handleConfigUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isClient]);

  // Simulate scroll effect for preview
  useEffect(() => {
    if (viewMode === "desktop") {
      const timer = setTimeout(() => {
        setIsScrolled(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  const handleLabelChange = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Зөвхөн зургийн файл сонгоно уу!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Зургийн хэмжээ 5MB-аас бага байх ёстой!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const scrollToSection = (sectionName) => {
    setActiveSection(sectionName);
    setIsMobileMenuOpen(false);
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
        <div className="h-full w-[70%] bg-white rounded-lg p-4 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{
        backgroundColor: websiteConfig.backgroundColor,
        borderColor: borderColor,
      }}
    >
      {/* Header */}
      <section
        className="w-full h-fit relative flex items-center justify-center"
        style={{
          backgroundColor:
            isScrolled && !isMobile ? scrolledBgColor : backgroundColor,
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
                  backgroundColor: websiteConfig.backgroundColor,
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
        style={{ backgroundColor: `${websiteConfig.backgroundColor}F5` }}
      >
        <div className="text-center" style={{ color: `${textColor}80` }}>
          <p>Content area preview</p>
        </div>
      </div>
    </div>
  );

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

      {/* Editor Section */}
      <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Header засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {headerInfo.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{headerInfo.content}</p>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Лого зураг
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-2">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Logo Preview"
                  className="rounded bg-gray-100 border"
                  style={{
                    objectFit: "contain",
                    width: "180px",
                    height: "50px",
                  }}
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  title="Зураг устгах"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center text-gray-400"
                style={{
                  width: "180px",
                  height: "50px",
                }}
              >
                <span className="text-sm">Зураг сонгоно уу</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Labels */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Навигацийн цэсний нэрс
          </label>
          <div className="space-y-3">
            {labels.map((label, idx) => (
              <input
                key={idx}
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(idx, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                style={{
                  focusRingColor: primaryColor,
                }}
                placeholder={`Цэсний нэр ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Color Preview Section */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Одоогийн өнгөний тохиргоо
          </h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span>Primary:</span>
              <div
                className="w-6 h-4 rounded border"
                style={{ backgroundColor: primaryColor }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Accent:</span>
              <div
                className="w-6 h-4 rounded border"
                style={{ backgroundColor: accentColor }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Text:</span>
              <div
                className="w-6 h-4 rounded border"
                style={{ backgroundColor: textColor }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
          </p>
        </div>

        {/* Manual Save Button */}
        <button
          onClick={saveHeaderConfig}
          className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium mt-6"
          style={{
            backgroundColor: primaryColor,
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = secondaryColor)
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = primaryColor)}
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
};

export default page;
