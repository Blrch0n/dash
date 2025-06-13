"use client";
import { useState, useEffect } from "react";

const section2Info = {
  title: "Section 2",
  content:
    "Section 2 нь Capabilities хэсэг бөгөөд таны чадварууд болон үйлчилгээнүүдийг харуулна.",
  key: "section2",
};

const DEFAULT_SECTION2_DATA = {
  title: "Capabilities",
  subtitle: "Creative concept or System Design",
  description:
    "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  capabilities: [
    {
      title: "Tailored",
      description:
        "We believe in a collaborative partnership where we work with you to create the perfect solution",
    },
    {
      title: "Strategic",
      description:
        "Our energy is focus in inspiring projects, activation campaigns and influence strategies",
    },
    {
      title: "Quality",
      description:
        "Development – every solution needs a conceptual design that the further work will be based on.",
    },
    {
      title: "Complete",
      description:
        "We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
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
  section2Data: DEFAULT_SECTION2_DATA,
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

  // Initialize with default configuration
  const [websiteConfig, setWebsiteConfig] = useState(defaultWebsiteConfig);
  const [section2Data, setSection2Data] = useState(DEFAULT_SECTION2_DATA);

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

  // Load configuration from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);
    setSection2Data(loadedConfig.section2Data || DEFAULT_SECTION2_DATA);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);
  }, []);

  // Auto-save function for section2 data
  const saveSection2Config = () => {
    if (!isClient) return;

    const updatedConfig = {
      ...websiteConfig,
      section2Data,
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

  // Auto-save when section2Data changes
  useEffect(() => {
    if (isClient) {
      saveSection2Config();
    }
  }, [section2Data, isClient]);

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

      // Update section2 data if it exists in the config
      if (updatedConfig.section2Data) {
        setSection2Data(updatedConfig.section2Data);
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
    setSection2Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCapabilityChange = (index, field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
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
      reader.onload = (e) => {
        setSection2Data((prev) => ({
          ...prev,
          image: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
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
        className="p-8 min-h-[800px]"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10 0%, ${accentColor}10 100%)`,
        }}
      >
        {/* Header */}
        <div className="mb-12">
          {/* Content and Image Section */}
          <div
            className={`flex ${
              isMobile ? "flex-col" : "flex-row"
            } items-center gap-8 max-w-6xl mx-auto mb-8`}
          >
            <div className={`${isMobile ? "w-full" : "w-1/2"} text-left`}>
              <div className="text-start">
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {section2Data?.title || "Capabilities"}
                </h1>
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{ color: textColor }}
                >
                  {section2Data?.subtitle || "Loading..."}
                </h2>
              </div>
              <p
                className="text-lg leading-relaxed"
                style={{ color: `${textColor}CC` }}
              >
                {section2Data?.description || "Loading..."}
              </p>
            </div>
            <div
              className={`${isMobile ? "w-full" : "w-1/2"} flex justify-center`}
            >
              {section2Data?.image && section2Data.image.trim() !== "" ? (
                <img
                  src={section2Data.image}
                  alt="Capabilities"
                  className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className={`${
                  section2Data?.image && section2Data.image.trim() !== ""
                    ? "hidden"
                    : "flex"
                } w-full max-w-md h-64 items-center justify-center rounded-lg shadow-lg`}
                style={{
                  color: `${textColor}60`,
                  backgroundColor: `${primaryColor}10`,
                }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="w-full h-px mb-8"
          style={{
            background: `linear-gradient(to right, transparent, ${websiteConfig.borderColor}, transparent)`,
          }}
        ></div>

        {/* Capabilities Section */}
        <div className="max-w-6xl mx-auto">
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-4"} gap-8`}
          >
            {(section2Data?.capabilities || []).map((capability, index) => (
              <div
                key={index}
                className="text-center rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                style={{ backgroundColor: backgroundColor }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${primaryColor}05`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = backgroundColor;
                }}
              >
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: primaryColor }}
                >
                  {capability.title}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: `${textColor}B3` }}
                >
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
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
          Section 2 засварлах
        </h2>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: textColor }}
        >
          {section2Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section2Info.content}</p>

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
              value={section2Data?.title || ""}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Section title"
            />
            <input
              type="text"
              value={section2Data?.subtitle || ""}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Section subtitle"
            />
            <textarea
              value={section2Data?.description || ""}
              onChange={(e) => handleTitleChange("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              rows="4"
              placeholder="Section description"
            />

            {/* Image Upload Section */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Image Preview */}
              {section2Data?.image && section2Data.image.trim() !== "" ? (
                <div className="relative">
                  <img
                    src={section2Data.image}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                  />
                  <button
                    onClick={() =>
                      setSection2Data((prev) => ({ ...prev, image: "" }))
                    }
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Зураг устгах"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    Зураг сонгоно уу
                  </span>
                </div>
              )}
            </div>

            <input
              type="text"
              value={section2Data?.image || ""}
              onChange={(e) => handleTitleChange("image", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Image URL (эсвэл дээрээс файл сонгоно уу)"
            />
          </div>

          {/* Capabilities Section */}
          <div>
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: textColor }}
            >
              Capabilities ({section2Data?.capabilities?.length || 0})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {(section2Data?.capabilities || []).map((capability, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Capability {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={capability.title || ""}
                    onChange={(e) =>
                      handleCapabilityChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Capability title"
                  />
                  <textarea
                    value={capability.description || ""}
                    onChange={(e) =>
                      handleCapabilityChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    rows="3"
                    placeholder="Capability description"
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
          onClick={saveSection2Config}
          className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium mt-6"
          style={{ backgroundColor: primaryColor }}
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
