"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section3 data structure
const defaultSection3Data = {
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
  colors: {
    primaryColor: "#3B82F6",
    secondaryColor: "#1E40AF",
    accentColor: "#EF4444",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
    scrolledBgColor: "#FFFFFF",
    scrolledTextColor: "#1F2937",
    hoverColor: "#3B82F6",
    borderColor: "#E5E7EB",
  },
};

// Toast Container Component
const ToastContainer = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: "#fff",
        color: "#333",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
      },
      success: {
        style: { border: "1px solid #22c55e" },
        iconTheme: { primary: "#22c55e", secondary: "#fff" },
      },
      error: {
        style: { border: "1px solid #ef4444" },
        iconTheme: { primary: "#ef4444", secondary: "#fff" },
      },
    }}
  />
);

// Loading Screen Component
const LoadingScreen = ({ message = "Loading..." }) => (
  <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
    <div className="h-full w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-gray-500">{message}</div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-gray-500">Loading...</div>
    </div>
  </div>
);

// Error Screen Component with Create Option
const ErrorScreen = ({ error, onRetry, onCreate }) => (
  <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
    <div className="h-full w-[70%] bg-white rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="text-red-500 mb-4">Error: {error}</div>
      <div className="text-gray-600 text-sm text-center">
        It looks like the section3 data doesn't exist in the database.
        <br />
        You can create it with default data or retry loading.
      </div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4 space-y-4">
      <button
        onClick={onCreate}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Create Section3 Data
      </button>
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Retry Loading
      </button>
    </div>
  </div>
);

// Preview Component
const PreviewComponent = ({
  section3Data,
  colors,
  isMobile,
  activeAccordion,
  toggleAccordion,
}) => (
  <div
    className={`border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <section
      className="p-8 min-h-[600px]"
      style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}10 0%, ${colors.accentColor}10 100%)`,
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
              style={{ color: `${colors.textColor}99` }}
            >
              {section3Data?.uniqueSpace?.title || "UNIQUE SPACE"}
            </h1>
            <h2
              className={`${isMobile ? "text-2xl" : "text-3xl"} font-bold mb-4`}
              style={{
                background: `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {section3Data?.uniqueSpace?.subtitle ||
                "Slight Differences Can Trigger Creativity"}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: `${colors.textColor}CC` }}
            >
              {section3Data?.uniqueSpace?.description || "Description..."}
            </p>
          </div>

          {/* Bottom Section - Accordion */}
          <div className="space-y-2">
            {section3Data?.accordion?.map((item, index) => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden"
                style={{ border: `1px solid ${colors.borderColor}` }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-3 py-2 text-left transition-colors flex justify-between items-center"
                  style={{
                    backgroundColor: colors.backgroundColor,
                    color: colors.textColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = `${colors.primaryColor}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = colors.backgroundColor;
                  }}
                >
                  <span className={`font-medium ${isMobile ? "text-sm" : ""}`}>
                    {item.title}
                  </span>
                  <span
                    className={`transform transition-transform ${
                      activeAccordion === index ? "rotate-180" : ""
                    }`}
                    style={{ color: colors.primaryColor }}
                  >
                    ▼
                  </span>
                </button>
                {activeAccordion === index && (
                  <div
                    className="px-3 py-2 border-t"
                    style={{
                      backgroundColor: `${colors.primaryColor}05`,
                      borderColor: colors.borderColor,
                    }}
                  >
                    <p
                      className="text-xs"
                      style={{ color: `${colors.textColor}B3` }}
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
              background: `linear-gradient(135deg, ${colors.primaryColor}20 0%, ${colors.accentColor}20 100%)`,
            }}
          >
            {section3Data?.image?.src ? (
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
                style={{ color: `${colors.textColor}60` }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image Placeholder</div>
                </div>
              </div>
            )}
            <div
              className="hidden w-full h-full items-center justify-center"
              style={{ color: `${colors.textColor}60` }}
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

// View Mode Toggle Component
const ViewModeToggle = ({ viewMode, setViewMode, primaryColor }) => (
  <div className="flex justify-center mb-6">
    <div className="bg-gray-200 rounded-lg p-1 flex">
      {["desktop", "mobile"].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-4 py-2 rounded-md transition-all ${
            viewMode === mode
              ? "text-white shadow-md"
              : "text-gray-600 hover:text-gray-800"
          }`}
          style={{
            backgroundColor: viewMode === mode ? primaryColor : "transparent",
          }}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  </div>
);

// Editor Form Component
const EditorForm = ({ section3Data, onDataChange, colors }) => {
  const handleUniqueSpaceChange = (field, value) => {
    onDataChange({
      ...section3Data,
      uniqueSpace: { ...section3Data.uniqueSpace, [field]: value },
    });
  };

  const handleAccordionChange = (index, field, value) => {
    const newAccordion = [...(section3Data.accordion || [])];
    newAccordion[index] = { ...newAccordion[index], [field]: value };
    onDataChange({
      ...section3Data,
      accordion: newAccordion,
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Зөвхөн зургийн файл сонгоно уу!");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Зургийн хэмжээ 5MB-аас бага байх ёстой!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onDataChange({
          ...section3Data,
          image: { ...section3Data.image, src: e.target.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    onDataChange({
      ...section3Data,
      image: { ...section3Data.image, src: "" },
    });
  };

  return (
    <div className="space-y-6">
      {/* Unique Space Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Unique Space Content
        </h3>
        <input
          type="text"
          value={section3Data?.uniqueSpace?.title || ""}
          onChange={(e) => handleUniqueSpaceChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Unique Space title"
        />
        <input
          type="text"
          value={section3Data?.uniqueSpace?.subtitle || ""}
          onChange={(e) => handleUniqueSpaceChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Subtitle"
        />
        <textarea
          value={section3Data?.uniqueSpace?.description || ""}
          onChange={(e) =>
            handleUniqueSpaceChange("description", e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          rows="4"
          placeholder="Description"
        />
      </div>

      {/* Accordion Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Accordion Items
        </h3>
        {section3Data?.accordion?.map((item, index) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-md p-3 mb-3"
          >
            <h4 className="text-xs font-medium text-gray-600 mb-2">
              Item {index + 1}
            </h4>
            <input
              type="text"
              value={item.title || ""}
              onChange={(e) =>
                handleAccordionChange(index, "title", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              placeholder="Accordion title"
            />
            <textarea
              value={item.content || ""}
              onChange={(e) =>
                handleAccordionChange(index, "content", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
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
          {section3Data?.image?.src ? (
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
              <span className="text-sm text-gray-400">Зураг сонгоно уу</span>
            </div>
          )}
        </div>

        <input
          type="text"
          value={section3Data?.image?.alt || ""}
          onChange={(e) =>
            onDataChange({
              ...section3Data,
              image: { ...section3Data.image, alt: e.target.value },
            })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mt-2"
          placeholder="Image alt text"
        />
      </div>
    </div>
  );
};

// Color Preview Component
const ColorPreview = ({ colors }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    <h3 className="text-sm font-medium text-gray-700 mb-3">
      Одоогийн өнгөний тохиргоо
    </h3>
    <div className="space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span>Primary:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.primaryColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Accent:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.accentColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Text:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.textColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Background:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.backgroundColor }}
        />
      </div>
    </div>
    <p className="text-xs text-gray-500 mt-2">
      Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
    </p>
  </div>
);

// Storage Info Component
const StorageInfo = ({ isSaving }) => (
  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
    <h4 className="text-xs font-medium text-gray-700 mb-2">Storage Info</h4>
    <div className="text-xs text-gray-600 space-y-1">
      <p>• Backend: MongoDB Atlas</p>
      <p>• Section: about/section3</p>
      <p>• Status: {isSaving ? "Saving..." : "Saved"}</p>
    </div>
  </div>
);

// Main Section3 Page Component
const Section3Page = () => {
  // State management
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [section3Data, setSection3Data] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const router = useRouter();

  // Toggle accordion function
  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Create section3 data with defaults
  const createSection3Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section3 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "about",
        subsectionName: "section3",
        title: "Our Vision",
        content: "About section 3 content",
        data: defaultSection3Data,
      });

      if (result.success) {
        setSection3Data(defaultSection3Data);
        toast.success("Section3 data created successfully!", {
          id: "creating",
        });
      } else {
        throw new Error("Failed to create section3 data");
      }
    } catch (error) {
      console.error("Error creating section3 data:", error);
      setError("Failed to create section3 data");
      toast.error("Failed to create section3 data", { id: "creating" });
    } finally {
      setIsLoading(false);
    }
  };

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Loading section3 data...");
      const result = await api.getSubsection("about", "section3");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection3Data(result.data.data);
        toast.success("Section3 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No section3 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading section3 data:", error);
      setError("Failed to load section3 data");
      toast.error("Section3 мэдээлэл ачаалахад алдаа гарлаа!");
    } finally {
      setIsLoading(false);
    }
  };

  // Data saving to backend
  const saveData = async (dataToSave, showToast = false) => {
    try {
      if (showToast) {
        setIsSaving(true);
        toast.loading("Хадгалж байна...", { id: "saving" });
      }

      const result = await api.saveSection({
        sectionName: "about",
        subsectionName: "section3",
        title: "Our Vision",
        content: "About section 3 content",
        data: dataToSave,
      });

      if (result.success) {
        if (showToast) {
          toast.success("Section3 амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving section3 data:", error);
      setError("Failed to save section3 data");
      if (showToast) {
        toast.error("Хадгалахад алдаа гарлаа!", { id: "saving" });
      }
    } finally {
      if (showToast) {
        setIsSaving(false);
      }
    }
  };

  // Event handlers
  const handleManualSave = () => {
    if (section3Data) {
      saveData(section3Data, true);
    }
  };

  const handleDataChange = (newData) => {
    setSection3Data(newData);
  };

  // Effects
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient || isLoading || !section3Data) return;

    const timeoutId = setTimeout(() => {
      saveData(section3Data, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [section3Data, isClient, isLoading]);

  // Render conditions
  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading section3 data from backend..." />;
  }

  if (error && !section3Data) {
    return (
      <ErrorScreen
        error={error}
        onRetry={loadData}
        onCreate={createSection3Data}
      />
    );
  }

  const colors = section3Data?.colors || defaultSection3Data.colors;

  return (
    <>
      <ToastContainer />

      <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
        {/* Preview Section */}
        <div className="h-full w-[70%] bg-white rounded-lg p-4 overflow-auto">
          <ViewModeToggle
            viewMode={viewMode}
            setViewMode={setViewMode}
            primaryColor={colors.primaryColor}
          />

          {/* Preview Container */}
          <div className="flex justify-center items-center w-full">
            <div
              className={`transition-all duration-500 ease-in-out mx-auto`}
              style={{
                width: viewMode === "mobile" ? "22rem" : "100%",
                transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
              }}
            >
              <PreviewComponent
                section3Data={section3Data || defaultSection3Data}
                colors={colors}
                isMobile={viewMode === "mobile"}
                activeAccordion={activeAccordion}
                toggleAccordion={toggleAccordion}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Section 3 засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 3
            </label>
            <p className="text-xs text-gray-500">
              Section 3 нь таны unique space болон creative creativity-ийн тухай
              хэсэг бөгөөд зүүн талд accordion, баруун талд зураг агуулна.
            </p>
          </div>

          <EditorForm
            section3Data={section3Data}
            onDataChange={handleDataChange}
            colors={colors}
          />

          <ColorPreview colors={colors} />

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            disabled={isLoading || isSaving}
            className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium mt-6 disabled:opacity-50"
            style={{ backgroundColor: colors.primaryColor }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = colors.secondaryColor)
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor = colors.primaryColor)
            }
          >
            {isSaving ? "Хадгалж байна..." : "Хадгалах"}
          </button>

          <StorageInfo isSaving={isSaving} />
        </div>
      </div>
    </>
  );
};

export default Section3Page;
