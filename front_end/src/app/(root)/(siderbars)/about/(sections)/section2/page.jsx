"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const section2Info = {
  title: "Section 2",
  content:
    "Section 2 нь таны creative spirit болон бүтээлч сэтгэлгээний тухай хэсэг бөгөөд зөвхөн нэг товчлуур агуулна.",
  key: "section2",
};

const DEFAULT_SECTION2_DATA = {
  creativeSpirit: {
    title: "Creative Spirit",
    content:
      "The pieces we make are the free thoughts that come with daily work given a physical form",
  },
  actionButton: {
    text: "See all Features",
    link: "/",
  },
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
  const router = useRouter();

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

  const handleCreativeSpiritChange = (field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      creativeSpirit: { ...prev.creativeSpirit, [field]: value },
    }));
  };

  const handleButtonChange = (field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      actionButton: { ...prev.actionButton, [field]: value },
    }));
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
        background: `linear-gradient(to right, ${primaryColor} 0%, ${accentColor} 100%)`,
        borderColor: websiteConfig.borderColor,
      }}
    >
      <div
        className="w-full h-fit flex flex-col lg:flex-row items-center gap-4 justify-between text-white p-4 lg:p-8 mx-auto max-w-[1200px]"
        style={{ flexDirection: isMobile ? "column" : "row" }}
      >
        <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start justify-center mb-6 lg:mb-0">
          <h1 className="text-[24px] sm:text-[28px] lg:text-[30px] mb-3 sm:mb-4 text-center lg:text-left">
            {section2Data.creativeSpirit.title}
          </h1>
          <p
            className="text-center lg:text-start text-sm sm:text-base leading-relaxed"
            style={{ color: `${backgroundColor}CC` }}
          >
            {section2Data.creativeSpirit.content}
          </p>
        </div>
        <button
          style={{
            background: `linear-gradient(to right, ${secondaryColor} 0%, ${textColor} 100%)`,
            color: backgroundColor,
            border: "none",
            padding: "0.6rem 1.5rem",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
          onClick={() => router.push(section2Data.actionButton.link)}
          className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 text-sm sm:text-base whitespace-nowrap"
          onMouseEnter={(e) => {
            e.target.style.background = `linear-gradient(to right, ${textColor} 0%, ${secondaryColor} 100%)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${textColor} 100%)`;
          }}
        >
          {section2Data.actionButton.text}
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col lg:flex-row gap-3 lg:gap-5 bg-gray-50 p-3 lg:p-5">
      {/* Preview Section */}
      <div className="h-full w-full lg:w-[70%] bg-white rounded-lg p-3 lg:p-4 overflow-auto">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-4 lg:mb-6">
          <div className="bg-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-3 lg:px-4 py-2 rounded-md transition-all text-sm lg:text-base ${
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
              className={`px-3 lg:px-4 py-2 rounded-md transition-all text-sm lg:text-base ${
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
              width: viewMode === "mobile" ? "20rem" : "100%",
              transform: viewMode === "mobile" ? "scale(0.9)" : "scale(1)",
            }}
          >
            <PreviewComponent isMobile={viewMode === "mobile"} />
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="h-full w-full lg:w-[30%] bg-white rounded-lg p-3 lg:p-4 overflow-auto">
        <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-gray-800">
          Section 2 засварлах
        </h2>
        <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
          {section2Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-3 lg:mb-4">
          {section2Info.content}
        </p>

        <div className="space-y-4 lg:space-y-6">
          {/* Creative Spirit Section */}
          <div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Creative Spirit Content
            </h3>
            <input
              type="text"
              value={section2Data.creativeSpirit.title}
              onChange={(e) =>
                handleCreativeSpiritChange("title", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2 text-sm lg:text-base"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Creative Spirit title"
            />
            <textarea
              value={section2Data.creativeSpirit.content}
              onChange={(e) =>
                handleCreativeSpiritChange("content", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent text-sm lg:text-base"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              rows="3"
              placeholder="Creative Spirit content"
            />
          </div>

          {/* Action Button Section */}
          <div>
            <h3 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Action Button
            </h3>
            <input
              type="text"
              value={section2Data.actionButton.text}
              onChange={(e) => handleButtonChange("text", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2 text-sm lg:text-base"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Button text"
            />
            <input
              type="text"
              value={section2Data.actionButton.link}
              onChange={(e) => handleButtonChange("link", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent text-sm lg:text-base"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Button link"
            />
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
          className="w-full text-white py-2 lg:py-3 px-4 rounded-md transition-colors font-medium mt-4 lg:mt-6 text-sm lg:text-base"
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
