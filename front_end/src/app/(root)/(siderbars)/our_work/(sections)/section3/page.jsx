"use client";
import { useState, useEffect, useCallback } from "react";

const section3Info = {
  title: "Section 3",
  content:
    "Section 3 нь Unique Services хэсэг бөгөөд таны үйлчилгээний давуу талуудыг харуулна.",
  key: "section3",
};

const DEFAULT_SECTION3_DATA = {
  title: "Unique services",
  subtitle: "Our Approach",
  description: "We offer custom solutions to industry leading companies",
  services: [
    {
      id: 1,
      title: "STRATEGY",
      description:
        "Enside allows you to build a fully functional and feature rich onepage WordPress site, whatever your agency or business, without any knowledge of coding.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "INSIGHT",
      description:
        "Effortlessly beautiful, Enside offers a collection of pre-built demos, with one-click import, and you can make your site your own using WP Bakery for WordPress.",
      image:
        "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "EXPERIENCE",
      description:
        "We've created a wide selection of stunning and powerful demos so that you can find the best starting point for your personal, business or agency website.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "PERFORMANCE",
      description:
        "The admin panel invites you to get creative and make your site unique in seconds. You get to choose how your users engage with you and your business.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
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
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Memoized save function to prevent recreation on every render
  const saveSection3Config = useCallback(() => {
    if (!isClient || !isInitialized) return;

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
  }, [websiteConfig, section3Data, isClient, isInitialized]);

  // Load configuration from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);

    // Ensure section3Data has the correct structure with services array
    const validSection3Data = {
      ...DEFAULT_SECTION3_DATA,
      ...(loadedConfig.section3Data || {}),
      services:
        loadedConfig.section3Data?.services || DEFAULT_SECTION3_DATA.services,
    };
    setSection3Data(validSection3Data);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);

    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Auto-save when section3Data changes (but only after initialization)
  useEffect(() => {
    if (isInitialized && isClient) {
      const timeoutId = setTimeout(() => {
        saveSection3Config();
      }, 500); // Debounce to prevent too frequent saves

      return () => clearTimeout(timeoutId);
    }
  }, [section3Data, isInitialized, isClient, saveSection3Config]);

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

      // Update section3 data if it exists in the config, ensuring services array exists
      if (updatedConfig.section3Data) {
        const validSection3Data = {
          ...DEFAULT_SECTION3_DATA,
          ...updatedConfig.section3Data,
          services:
            updatedConfig.section3Data.services ||
            DEFAULT_SECTION3_DATA.services,
        };
        setSection3Data(validSection3Data);
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
    setSection3Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      services: (prev.services || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  // Add image upload handler
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
        handleServiceChange(index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new service function
  const addNewService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      description: "Service description",
      image: "",
    };

    setSection3Data((prev) => ({
      ...prev,
      services: [...(prev.services || []), newService],
    }));
  };

  // Remove service function
  const removeService = (index) => {
    setSection3Data((prev) => ({
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
            {section3Data?.title || "Unique services"}
          </h1>
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: textColor }}
          >
            {section3Data?.subtitle || "Our Approach"}
          </h2>
          <p
            className="text-lg leading-relaxed"
            style={{ color: `${textColor}CC` }}
          >
            {section3Data?.description || "Loading..."}
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-6"
              : "grid-cols-4 gap-6 max-w-7xl mx-auto"
          }`}
        >
          {(section3Data?.services || []).map((service, index) => (
            <div
              key={service.id}
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              {service.image && service.image.trim() !== "" ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${service.image})`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300"></div>
                </div>
              ) : (
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
              )}

              {/* Centered Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">
                  {service.title}
                </h3>
                <p className="text-white text-sm leading-relaxed">
                  {service.description}
                </p>
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
          Section 3 засварлах
        </h2>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: textColor }}
        >
          {section3Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section3Info.content}</p>

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
              value={section3Data?.title || ""}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Main title"
            />
            <input
              type="text"
              value={section3Data?.subtitle || ""}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Subtitle"
            />
            <textarea
              value={section3Data?.description || ""}
              onChange={(e) => handleTitleChange("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              rows="3"
              placeholder="Description"
            />
          </div>

          {/* Services Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium" style={{ color: textColor }}>
                Services ({section3Data?.services?.length || 0})
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
              {(section3Data?.services || []).map((service, index) => (
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

                  {/* Image Upload Section */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-500">
                      Upload Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />

                    {/* Image Preview */}
                    {service.image && service.image.trim() !== "" ? (
                      <div className="relative">
                        <img
                          src={service.image}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          onClick={() =>
                            handleServiceChange(index, "image", "")
                          }
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          title="Зураг устгах"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                        <span className="text-xs text-gray-400">
                          Зураг сонгоно уу
                        </span>
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    value={service.image || ""}
                    onChange={(e) =>
                      handleServiceChange(index, "image", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mt-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Image URL (эсвэл дээрээс файл сонгоно уу)"
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
