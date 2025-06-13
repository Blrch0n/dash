"use client";
import { useState, useEffect, useCallback } from "react";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Services хэсэг бөгөөд таны үйлчилгээний онцлог давуу талуудыг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Services",
  subtitle: "We provide exceptional digital solutions tailored to your needs",
  services: [
    {
      id: 1,
      title: "Unlimited Colors",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "🎨",
      bgColor: "from-purple-400 to-pink-400",
    },
    {
      id: 2,
      title: "High Quality Design",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "✨",
      bgColor: "from-blue-400 to-cyan-400",
    },
    {
      id: 3,
      title: "Luxurious Layouts",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "💎",
      bgColor: "from-green-400 to-teal-400",
    },
  ],
};

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
  section4Data: DEFAULT_SECTION4_DATA,
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
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize with default configuration
  const [websiteConfig, setWebsiteConfig] = useState(defaultWebsiteConfig);
  const [section4Data, setSection4Data] = useState(DEFAULT_SECTION4_DATA);

  // Color states
  const [primaryColor, setPrimaryColor] = useState(
    defaultWebsiteConfig.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState(
    defaultWebsiteConfig.secondaryColor
  );
  const [accentColor, setAccentColor] = useState(
    defaultWebsiteConfig.accentColor
  );
  const [textColor, setTextColor] = useState(defaultWebsiteConfig.textColor);
  const [backgroundColor, setBackgroundColor] = useState(
    defaultWebsiteConfig.backgroundColor
  );

  // Memoized save function to prevent recreation on every render
  const saveSection4Config = useCallback(() => {
    if (!isClient || !isInitialized) return;

    const updatedConfig = {
      ...websiteConfig,
      section4Data,
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
  }, [websiteConfig, section4Data, isClient, isInitialized]);

  // Load configuration from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);

    // Ensure section4Data has the correct structure with services array
    const validSection4Data = {
      ...DEFAULT_SECTION4_DATA,
      ...(loadedConfig.section4Data || {}),
      services:
        loadedConfig.section4Data?.services || DEFAULT_SECTION4_DATA.services,
    };
    setSection4Data(validSection4Data);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);

    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Auto-save when section4Data changes (but only after initialization)
  useEffect(() => {
    if (isInitialized && isClient) {
      const timeoutId = setTimeout(() => {
        saveSection4Config();
      }, 500); // Debounce to prevent too frequent saves

      return () => clearTimeout(timeoutId);
    }
  }, [section4Data, isInitialized, isClient, saveSection4Config]);

  // Listen for configuration updates from other pages
  useEffect(() => {
    if (!isClient) return;

    const handleConfigUpdate = (event) => {
      const updatedConfig = event.detail;
      setWebsiteConfig(updatedConfig);

      // Update color states
      setPrimaryColor(updatedConfig.primaryColor);
      setSecondaryColor(updatedConfig.secondaryColor);
      setAccentColor(updatedConfig.accentColor);
      setTextColor(updatedConfig.textColor);
      setBackgroundColor(updatedConfig.backgroundColor);

      // Update section4 data if it exists in the config, ensuring services array exists
      if (updatedConfig.section4Data) {
        const validSection4Data = {
          ...DEFAULT_SECTION4_DATA,
          ...updatedConfig.section4Data,
          services:
            updatedConfig.section4Data.services ||
            DEFAULT_SECTION4_DATA.services,
        };
        setSection4Data(validSection4Data);
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

  const handleTitleChange = (field, value) => {
    setSection4Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setSection4Data((prev) => ({
      ...prev,
      services: (prev.services || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Add new service function
  const addNewService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      description: "Service description",
      icon: "🔧",
      bgColor: "from-gray-400 to-gray-600",
    };

    setSection4Data((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService],
    }));
  };

  // Remove service function
  const removeService = (index) => {
    setSection4Data((prev) => ({
      ...prev,
      services: (prev.services || []).filter((_, i) => i !== index),
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{
        backgroundColor: backgroundColor,
        borderColor: websiteConfig.borderColor,
      }}
    >
      <section
        className="py-16 px-8 min-h-[800px]"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10 0%, ${accentColor}10 100%)`,
        }}
      >
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {section4Data?.title || "Our Services"}
          </h1>
          <p
            className="text-lg leading-relaxed"
            style={{ color: `${textColor}CC` }}
          >
            {section4Data?.subtitle || "Loading..."}
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-8"
              : "grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          }`}
        >
          {(section4Data?.services || []).map((service, index) => (
            <div
              key={service.id}
              className="group relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: backgroundColor,
                borderColor: websiteConfig.borderColor,
                border: `1px solid ${websiteConfig.borderColor}`,
              }}
            >
              {/* Background Gradient */}
              <div
                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})`,
                }}
              ></div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ color: textColor }}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className="leading-relaxed"
                  style={{ color: `${textColor}B3` }}
                >
                  {service.description}
                </p>

                {/* Decorative Element */}
                <div
                  className="w-16 h-1 mx-auto mt-6 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

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
            className={`transition-all duration-500 ease-in-out mx-auto`}
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
        <h2 className="text-xl font-bold mb-4" style={{ color: textColor }}>
          Section 4 засварлах
        </h2>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: textColor }}
        >
          {section4Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section4Info.content}</p>

        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: textColor }}
            >
              Header Content
            </h3>
            <input
              type="text"
              value={section4Data?.title || ""}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Section title"
            />
            <textarea
              value={section4Data?.subtitle || ""}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              rows="3"
              placeholder="Section subtitle"
            />
          </div>

          {/* Services Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium" style={{ color: textColor }}>
                Services ({section4Data?.services?.length || 0})
              </h3>
              <button
                onClick={addNewService}
                className="text-xs px-2 py-1 rounded text-white"
                style={{ backgroundColor: primaryColor }}
                title="Шинэ үйлчилгээ нэмэх"
              >
                + Add
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {(section4Data?.services || []).map((service, index) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-md p-3 relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeService(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Үйлчилгээ устгах"
                  >
                    ×
                  </button>

                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Service {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={service.title || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Service title"
                  />
                  <textarea
                    value={service.description || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    rows="3"
                    placeholder="Service description"
                  />
                  <input
                    type="text"
                    value={service.icon || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "icon", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Icon (emoji or text)"
                  />
                  <input
                    type="text"
                    value={service.bgColor || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "bgColor", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Background gradient (optional)"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Color Preview Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
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
                <span>Secondary:</span>
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: secondaryColor }}
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
              <div className="flex items-center justify-between">
                <span>Background:</span>
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: backgroundColor }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSection4Config}
          className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium mt-6 hover:opacity-90"
          style={{ backgroundColor: primaryColor }}
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
};

export default page;
