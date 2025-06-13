"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const section3Info = {
  title: "Section 3",
  content:
    "Section 3 нь таны unique space болон creative creativity-ийн тухай хэсэг бөгөөд зүүн талд accordion, баруун талд зураг агуулна.",
  key: "section3",
};

const DEFAULT_SECTION3_DATA = {
  uniqueSpace: {
    title: "UNIQUE SPACE",
    subtitle: "Slight Differences Can Trigger Creativity",
    description:
      "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  },
  accordion: [
    {
      id: 1,
      title: "Design Excellence",
      content:
        "We create visually stunning and user-friendly designs that capture your brand essence and engage your audience effectively.",
    },
    {
      id: 2,
      title: "Technology Innovation",
      content:
        "Our cutting-edge technology solutions help businesses stay ahead in the rapidly evolving digital landscape.",
    },
    {
      id: 3,
      title: "Digital Strategy",
      content:
        "We develop comprehensive digital strategies that align with your business goals and drive measurable results.",
    },
  ],
  image: {
    src: "https://i.pinimg.com/736x/dd/1c/5b/dd1c5b14fc8446a4741fdb979c4fe3cc.jpg",
    alt: "Creative workspace",
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
  section3Data: DEFAULT_SECTION3_DATA,
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
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();

  // Initialize with default configuration
  const [websiteConfig, setWebsiteConfig] = useState(defaultWebsiteConfig);
  const [section3Data, setSection3Data] = useState(DEFAULT_SECTION3_DATA);

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
    setSection3Data(loadedConfig.section3Data || DEFAULT_SECTION3_DATA);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);
  }, []);

  // Auto-save function for section3 data
  const saveSection3Config = () => {
    if (!isClient) return;

    const updatedConfig = {
      ...websiteConfig,
      section3Data,
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

  // Auto-save when section3Data changes
  useEffect(() => {
    if (isClient) {
      saveSection3Config();
    }
  }, [section3Data, isClient]);

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

      // Update section3 data if it exists in the config
      if (updatedConfig.section3Data) {
        setSection3Data(updatedConfig.section3Data);
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

  const handleUniqueSpaceChange = (field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      uniqueSpace: { ...prev.uniqueSpace, [field]: value },
    }));
  };

  const handleAccordionChange = (index, field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      accordion: prev.accordion.map((item, i) =>
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
        setSection3Data((prev) => ({
          ...prev,
          image: { ...prev.image, src: e.target.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSection3Data((prev) => ({
      ...prev,
      image: { ...prev.image, src: "" },
    }));
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
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
      <section
        className="p-8 min-h-[600px]"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}10 0%, ${accentColor}10 100%)`,
        }}
      >
        <div
          className={`flex ${
            isMobile ? "flex-col gap-6" : "flex-row gap-8"
          } h-full`}
        >
          {/* Left Side - Content */}
          <div className={`${isMobile ? "w-full" : "w-1/2"} flex flex-col`}>
            {/* Top Section - Unique Space */}
            <div className="mb-6">
              <h1
                className="text-sm font-bold mb-2 tracking-wider"
                style={{ color: `${textColor}99` }}
              >
                {section3Data.uniqueSpace.title}
              </h1>
              <h2
                className={`${
                  isMobile ? "text-2xl" : "text-3xl"
                } font-bold mb-4`}
                style={{
                  background: `linear-gradient(to right, ${primaryColor} 0%, ${accentColor} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {section3Data.uniqueSpace.subtitle}
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: `${textColor}CC` }}
              >
                {section3Data.uniqueSpace.description}
              </p>
            </div>

            {/* Bottom Section - Accordion */}
            <div className="space-y-2">
              {section3Data.accordion.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${websiteConfig.borderColor}` }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-3 py-2 text-left transition-colors flex justify-between items-center"
                    style={{
                      backgroundColor: backgroundColor,
                      color: textColor,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = `${primaryColor}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = backgroundColor;
                    }}
                  >
                    <span
                      className={`font-medium ${isMobile ? "text-sm" : ""}`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`transform transition-transform ${
                        activeAccordion === index ? "rotate-180" : ""
                      }`}
                      style={{ color: primaryColor }}
                    >
                      ▼
                    </span>
                  </button>
                  {activeAccordion === index && (
                    <div
                      className="px-3 py-2 border-t"
                      style={{
                        backgroundColor: `${primaryColor}05`,
                        borderColor: websiteConfig.borderColor,
                      }}
                    >
                      <p
                        className="text-xs"
                        style={{ color: `${textColor}B3` }}
                      >
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className={`${
              isMobile ? "w-full h-[600px]" : "w-1/2"
            } flex items-center justify-center`}
          >
            <div
              className={`w-full ${
                isMobile ? "h-[600px]" : "h-full min-h-[600px]"
              } rounded-lg flex items-center justify-center overflow-hidden`}
              style={{
                background: `linear-gradient(135deg, ${primaryColor}20 0%, ${accentColor}20 100%)`,
              }}
            >
              {section3Data.image.src ? (
                <img
                  src={section3Data.image.src}
                  alt={section3Data.image.alt}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ color: `${textColor}60` }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div>Image Placeholder</div>
                  </div>
                </div>
              )}
              <div
                className="hidden w-full h-full items-center justify-center"
                style={{ color: `${textColor}60` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
          Section 3 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section3Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section3Info.content}</p>

        <div className="space-y-6">
          {/* Unique Space Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Unique Space Content
            </h3>
            <input
              type="text"
              value={section3Data.uniqueSpace.title}
              onChange={(e) => handleUniqueSpaceChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Unique Space title"
            />
            <input
              type="text"
              value={section3Data.uniqueSpace.subtitle}
              onChange={(e) =>
                handleUniqueSpaceChange("subtitle", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Subtitle"
            />
            <textarea
              value={section3Data.uniqueSpace.description}
              onChange={(e) =>
                handleUniqueSpaceChange("description", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              rows="4"
              placeholder="Description"
            />
          </div>

          {/* Accordion Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Accordion Items
            </h3>
            {section3Data.accordion.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md p-3 mb-3"
              >
                <h4 className="text-xs font-medium text-gray-600 mb-2">
                  Item {index + 1}
                </h4>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleAccordionChange(index, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                  style={{
                    "--tw-ring-color": primaryColor,
                    focusRingColor: primaryColor,
                  }}
                  placeholder="Accordion title"
                />
                <textarea
                  value={item.content}
                  onChange={(e) =>
                    handleAccordionChange(index, "content", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                  style={{
                    "--tw-ring-color": primaryColor,
                    focusRingColor: primaryColor,
                  }}
                  rows="2"
                  placeholder="Accordion content"
                />
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Image Settings
            </h3>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs text-gray-500">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />

              {/* Image Preview */}
              {section3Data.image.src ? (
                <div className="relative">
                  <img
                    src={section3Data.image.src}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
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
                <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-400">
                    Зураг сонгоно уу
                  </span>
                </div>
              )}
            </div>

            <input
              type="text"
              value={section3Data.image.alt}
              onChange={(e) =>
                setSection3Data((prev) => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mt-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Image alt text"
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
          onClick={saveSection3Config}
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
