"use client";
import { useState, useEffect, useCallback } from "react";

const section1Info = {
  title: "Section 1",
  content:
    "Section 1 нь Case Studies хэсэг бөгөөд таны төслүүдийн жишээнүүдийг харуулна.",
  key: "section1",
};

const DEFAULT_SECTION1_DATA = {
  title: "Case Studies",
  subtitle:
    "Inspiring and functional branding, development, consulting, websites, online services, and apps.",
  projects: [
    {
      id: 1,
      title: "Creative Ring",
      category: "Product Design",
      tags: ["Agency", "App Design", "Services"],
      description: "Product Design",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Ugly Delicious",
      category: "Agency / Services / UI&UX",
      tags: ["Agency", "Services", "UI&UX"],
      description: "Ugly Delicious",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Kitchen Stories",
      category: "Personal",
      tags: ["App Design", "Services", "UI&UX"],
      description: "Kitchen Stories",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Commercial",
      category: "Client: Themeforest",
      tags: ["Agency", "App Design", "Services"],
      description: "Commercial",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Lamp Mock Up",
      category: "Special",
      tags: ["App Design", "Services"],
      description: "Lamp Mock Up",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Enside Web",
      category: "Perfect for Home",
      tags: ["Agency"],
      description: "Enside Web",
      image:
        "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      title: "Pixel Days",
      category: "Mock up components",
      tags: ["Agency", "App Design", "Services", "UI&UX"],
      description: "Pixel Days",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "Particles",
      category: "Digital",
      tags: ["Agency", "App Design", "Services", "UI&UX"],
      description: "Particles",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
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
  const [isInitialized, setIsInitialized] = useState(false);

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

  // Memoized save function to prevent recreation on every render
  const saveSection1Config = useCallback(() => {
    if (!isClient || !isInitialized) return;

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
  }, [websiteConfig, section1Data, isClient, isInitialized]);

  // Load configuration from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);

    // Ensure section1Data has the correct structure with projects array
    const validSection1Data = {
      ...DEFAULT_SECTION1_DATA,
      ...(loadedConfig.section1Data || {}),
      projects:
        loadedConfig.section1Data?.projects || DEFAULT_SECTION1_DATA.projects,
    };
    setSection1Data(validSection1Data);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
    setBackgroundColor(loadedConfig.backgroundColor);

    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  // Auto-save when section1Data changes (but only after initialization)
  useEffect(() => {
    if (isInitialized && isClient) {
      const timeoutId = setTimeout(() => {
        saveSection1Config();
      }, 500); // Debounce to prevent too frequent saves

      return () => clearTimeout(timeoutId);
    }
  }, [section1Data, isInitialized, isClient, saveSection1Config]);

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

      // Update section1 data if it exists in the config, ensuring projects array exists
      if (updatedConfig.section1Data) {
        const validSection1Data = {
          ...DEFAULT_SECTION1_DATA,
          ...updatedConfig.section1Data,
          projects:
            updatedConfig.section1Data.projects ||
            DEFAULT_SECTION1_DATA.projects,
        };
        setSection1Data(validSection1Data);
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
    setSection1Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectChange = (index, field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      projects: (prev.projects || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleTagsChange = (index, tagsString) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    handleProjectChange(index, "tags", tags);
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
        handleProjectChange(index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new project function
  const addNewProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "Category",
      tags: ["Tag1", "Tag2"],
      description: "Project description",
      image: "",
    };

    setSection1Data((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProject],
    }));
  };

  // Remove project function
  const removeProject = (index) => {
    setSection1Data((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index),
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{ borderColor: websiteConfig.borderColor }}
    >
      <section className="p-8 min-h-[800px]" style={{ backgroundColor }}>
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold mb-4"
            style={{
              color: primaryColor,
              background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {section1Data?.title || "Case Studies"}
          </h1>
          <p className="text-lg max-w-3xl mx-auto" style={{ color: textColor }}>
            {section1Data?.subtitle || "Loading..."}
          </p>
        </div>

        {/* Projects Grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-6"
              : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          }`}
        >
          {(section1Data?.projects || []).map((project, index) => (
            <div
              key={project.id}
              className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Project Image */}
              <div
                className="relative h-48 overflow-hidden"
                style={{
                  background: `linear-gradient(to bottom right, ${primaryColor}20, ${secondaryColor}20)`,
                }}
              >
                {project.image && project.image.trim() !== "" ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`${
                    project.image && project.image.trim() !== ""
                      ? "hidden"
                      : "flex"
                  } w-full h-full items-center justify-center absolute inset-0`}
                  style={{ color: textColor }}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <div>Image Placeholder</div>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-4">
                <div className="mb-2">
                  <span
                    className="text-xs font-medium"
                    style={{ color: primaryColor }}
                  >
                    {project.category}
                  </span>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: textColor }}
                >
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {(project.tags || []).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${primaryColor}10`,
                        color: primaryColor,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
          Section 1 засварлах
        </h2>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: textColor }}
        >
          {section1Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section1Info.content}</p>

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
              value={section1Data?.title || ""}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                focusRingColor: primaryColor,
                "--tw-ring-color": primaryColor,
              }}
              placeholder="Section title"
            />
            <textarea
              value={section1Data?.subtitle || ""}
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

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium" style={{ color: textColor }}>
                Projects ({section1Data?.projects?.length || 0})
              </h3>
              <button
                onClick={addNewProject}
                className="text-xs px-2 py-1 rounded text-white"
                style={{ backgroundColor: primaryColor }}
                title="Шинэ төсөл нэмэх"
              >
                + Add
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {(section1Data?.projects || []).map((project, index) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-md p-3 relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeProject(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    title="Төсөл устгах"
                  >
                    ×
                  </button>

                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Project {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={project.title || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Project title"
                  />
                  <input
                    type="text"
                    value={project.category || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "category", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Project category"
                  />
                  <input
                    type="text"
                    value={(project.tags || []).join(", ")}
                    onChange={(e) => handleTagsChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    placeholder="Tags (comma separated)"
                  />
                  <textarea
                    value={project.description || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                    style={{
                      focusRingColor: primaryColor,
                      "--tw-ring-color": primaryColor,
                    }}
                    rows="2"
                    placeholder="Project description"
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
                    {project.image && project.image.trim() !== "" ? (
                      <div className="relative">
                        <img
                          src={project.image}
                          alt="Preview"
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          onClick={() =>
                            handleProjectChange(index, "image", "")
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
                    value={project.image || ""}
                    onChange={(e) =>
                      handleProjectChange(index, "image", e.target.value)
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
