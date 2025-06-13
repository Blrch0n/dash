"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const section1Info = {
  title: "Section 1",
  content:
    "Section 1 нь таны вэбсайтын эхний хэсэг бөгөөд танилцуулга болон онцлог шинж чанаруудыг агуулна.",
  key: "section1",
};

const DEFAULT_SECTION1_DATA = {
  welcome: {
    title: "Welcome",
    content:
      "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  },
  features: {
    title: "Outstanding Features",
    items: [
      {
        title: "Brand Development",
        description:
          "Our energy and expertise are focus in inspiring projects, activation campaigns and influence strategies with our brands",
        image:
          "https://max-themes.net/demos/enside/main/upload/man-business-landscape.jpg",
      },
      {
        title: "Content Strategy",
        description:
          "We believe in a collaborative partnership where we work with you and your brand to create the perfect solution",
        image:
          "https://max-themes.net/demos/enside/main/upload/office-hand.jpg",
      },
      {
        title: "Ecommerce & Technology",
        description:
          "Development and Design – every solution needs a conceptual design that the further work will be based on.",
        image:
          "https://max-themes.net/demos/enside/main/upload/women-house-interior.jpg",
      },
    ],
  },
  exploreButton: {
    text: "Explore All Features",
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
  section1Data: DEFAULT_SECTION1_DATA,
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
  const [section1Data, setSection1Data] = useState(DEFAULT_SECTION1_DATA);

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
    setSection1Data(loadedConfig.section1Data || DEFAULT_SECTION1_DATA);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);
  }, []);

  // Auto-save function for section1 data
  const saveSection1Config = () => {
    if (!isClient) return;

    const updatedConfig = {
      ...websiteConfig,
      section1Data,
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

  // Auto-save when section1Data changes
  useEffect(() => {
    if (isClient) {
      saveSection1Config();
    }
  }, [section1Data, isClient]);

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

      // Update section1 data if it exists in the config
      if (updatedConfig.section1Data) {
        setSection1Data(updatedConfig.section1Data);
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

  const handleWelcomeChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      welcome: { ...prev.welcome, [field]: value },
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...section1Data.features.items];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setSection1Data((prev) => ({
      ...prev,
      features: { ...prev.features, items: newFeatures },
    }));
  };

  const handleButtonChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      exploreButton: { ...prev.exploreButton, [field]: value },
    }));
  };

  // Handle image upload for features
  const handleImageUpload = (index, event) => {
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
        handleFeatureChange(index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    handleFeatureChange(index, "image", "");
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
        backgroundColor: backgroundColor,
        borderColor: websiteConfig.borderColor,
      }}
    >
      <div
        className="w-full h-fit flex py-[110px] md:py-[80px] sm:py-[60px] px-4 sm:px-6 md:px-8 flex-col gap-10 items-center justify-center"
        style={{ backgroundColor: backgroundColor, color: textColor }}
      >
        <div className="w-full h-fit flex flex-col items-center justify-center text-center">
          <h3
            className="text-sm sm:text-base"
            style={{ color: `${textColor}80` }}
          >
            {section1Data.welcome.title}
          </h3>
          <h2
            className={`w-full max-w-[520px] px-4 font-bold ${
              isMobile
                ? "text-[24px]"
                : "text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px]"
            }`}
            style={{ color: textColor }}
          >
            {section1Data.features.title}
          </h2>
          <span
            className="block h-[6px] w-[35px] rounded-full my-4"
            style={{
              background: `linear-gradient(to right, ${primaryColor} 0%, ${accentColor} 100%)`,
            }}
          />
          <p
            className={`w-full max-w-[570px] px-4 ${
              isMobile
                ? "text-[14px]"
                : "text-[14px] sm:text-[16px] md:text-[18px]"
            }`}
            style={{ color: `${textColor}B3` }}
          >
            {section1Data.welcome.content}
          </p>
        </div>

        <div className="w-full h-fit flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {section1Data.features.items.map((item, index) => (
            <div
              className={`w-full h-fit flex flex-col gap-6 md:gap-10 items-center justify-center text-center mx-2 hover:transform hover:-translate-y-2 transition-all duration-300 ${
                isMobile ? "max-w-[280px]" : "sm:w-[350px] md:w-[370px]"
              }`}
              key={index}
              style={{
                borderColor: `${textColor}20`,
              }}
            >
              {item.image ? (
                <img
                  className={`w-full object-cover bg-center bg-cover rounded-lg ${
                    isMobile
                      ? "h-[180px]"
                      : "h-[200px] sm:h-[240px] md:h-[270px]"
                  }`}
                  src={item.image}
                  alt={item.title}
                />
              ) : (
                <div
                  className={`w-full rounded-lg border-2 border-dashed flex items-center justify-center ${
                    isMobile
                      ? "h-[180px]"
                      : "h-[200px] sm:h-[240px] md:h-[270px]"
                  }`}
                  style={{
                    borderColor: `${textColor}40`,
                    backgroundColor: `${textColor}10`,
                  }}
                >
                  <span style={{ color: `${textColor}60` }} className="text-sm">
                    No image
                  </span>
                </div>
              )}
              <h1
                className={`px-4 font-semibold ${
                  isMobile
                    ? "text-[16px]"
                    : "text-[18px] sm:text-[20px] md:text-[21px]"
                }`}
                style={{ color: textColor }}
              >
                {item.title}
              </h1>
              <p
                className={`px-4 leading-relaxed ${
                  isMobile
                    ? "text-[14px]"
                    : "text-[14px] sm:text-[15px] md:text-[16px]"
                }`}
                style={{ color: `${textColor}99` }}
              >
                {item.description}
              </p>
              <span
                className="w-1/2 h-[1px]"
                style={{ backgroundColor: `${textColor}30` }}
              />
            </div>
          ))}
        </div>

        <button
          className="px-[18px] sm:px-[24px] rounded-[5px] text-white py-3 sm:py-4 text-sm sm:text-base hover:transform hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-200"
          style={{
            background: `linear-gradient(to right, ${primaryColor} 0%, ${accentColor} 100%)`,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = `linear-gradient(to right, ${secondaryColor} 0%, ${accentColor} 100%)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.background = `linear-gradient(to right, ${primaryColor} 0%, ${accentColor} 100%)`;
          }}
          onClick={() => router.push(section1Data.exploreButton.link)}
        >
          {section1Data.exploreButton.text}
        </button>
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
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Section 1 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section1Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section1Info.content}</p>

        <div className="space-y-6">
          {/* Welcome Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Welcome Section
            </h3>
            <input
              type="text"
              value={section1Data.welcome.title}
              onChange={(e) => handleWelcomeChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Welcome title"
            />
            <textarea
              value={section1Data.welcome.content}
              onChange={(e) => handleWelcomeChange("content", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              rows="4"
              placeholder="Welcome content"
            />
          </div>

          {/* Features Title */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Features Title
            </h3>
            <input
              type="text"
              value={section1Data.features.title}
              onChange={(e) =>
                setSection1Data((prev) => ({
                  ...prev,
                  features: { ...prev.features, title: e.target.value },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Features title"
            />
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Feature Items
            </h3>
            {section1Data.features.items.map((feature, idx) => (
              <div key={idx} className="space-y-2 mb-4 p-3 border rounded-lg">
                <label className="text-xs font-medium text-gray-600">
                  Feature {idx + 1}
                </label>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-xs text-gray-500">Feature Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(idx, e)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />

                  {/* Image Preview */}
                  {feature.image ? (
                    <div className="relative">
                      <img
                        src={feature.image}
                        alt={`Feature ${idx + 1} preview`}
                        className="w-full h-32 object-cover rounded border"
                      />
                      <button
                        onClick={() => handleRemoveImage(idx)}
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
                  value={feature.title}
                  onChange={(e) =>
                    handleFeatureChange(idx, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                  style={{
                    "--tw-ring-color": primaryColor,
                    focusRingColor: primaryColor,
                  }}
                  placeholder="Feature title"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    handleFeatureChange(idx, "description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                  style={{
                    "--tw-ring-color": primaryColor,
                    focusRingColor: primaryColor,
                  }}
                  rows="3"
                  placeholder="Feature description"
                />
              </div>
            ))}
          </div>

          {/* Explore Button Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Explore Button
            </h3>
            <input
              type="text"
              value={section1Data.exploreButton.text}
              onChange={(e) => handleButtonChange("text", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Button text"
            />
            <input
              type="text"
              value={section1Data.exploreButton.link}
              onChange={(e) => handleButtonChange("link", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
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
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSection1Config}
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
