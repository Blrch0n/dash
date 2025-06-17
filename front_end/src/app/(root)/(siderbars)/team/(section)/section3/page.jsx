"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section3 data structure
const defaultSection3Data = {
  title: "Get in touch",
  subtitle: "Want to Know More About Us? Get In Touch",
  buttonText: "See all Features",
  gradientColors: {
    background: "linear-gradient(to right, #664ed3 0%, #87d14b 100%)",
    button: "linear-gradient(to right, #9888ef 0%, #8978d3 100%)",
  },
  textColors: {
    title: "#ffffff",
    subtitle: "#b8b8b8",
    button: "#ffffff",
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
        It looks like the team section3 data doesn't exist in the database.
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
const PreviewComponent = ({ section3Data, colors, isMobile }) => (
  <div
    className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <div
      className="w-full h-fit"
      style={{
        background:
          section3Data?.gradientColors?.background ||
          defaultSection3Data.gradientColors.background,
      }}
    >
      <div
        className={`max-w-[1200px] w-full mx-auto h-fit flex ${
          isMobile ? "flex-col" : "flex-col md:flex-row"
        } items-center justify-between p-4 md:p-8 gap-6 md:gap-0`}
      >
        <div className="text-center md:text-left">
          <h2
            className={`text-[24px] ${
              isMobile ? "text-[20px]" : "md:text-[30px]"
            } mb-2 font-bold`}
            style={{
              color:
                section3Data?.textColors?.title ||
                defaultSection3Data.textColors.title,
            }}
          >
            {section3Data?.title || defaultSection3Data.title}
          </h2>
          <p
            className={`text-sm ${isMobile ? "text-xs" : "md:text-base"}`}
            style={{
              color:
                section3Data?.textColors?.subtitle ||
                defaultSection3Data.textColors.subtitle,
            }}
          >
            {section3Data?.subtitle || defaultSection3Data.subtitle}
          </p>
        </div>
        <button
          style={{
            background:
              section3Data?.gradientColors?.button ||
              defaultSection3Data.gradientColors.button,
            color:
              section3Data?.textColors?.button ||
              defaultSection3Data.textColors.button,
          }}
          className={`py-3 px-6 md:px-8 rounded-[5px] ${
            isMobile ? "w-full" : "sm:w-fit w-full md:w-auto"
          } text-sm md:text-base hover:shadow-lg active:scale-95 transition-all duration-200 font-medium`}
        >
          {section3Data?.buttonText || defaultSection3Data.buttonText}
        </button>
      </div>
    </div>
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
  const handleDataChange = (field, value) => {
    onDataChange({
      ...section3Data,
      [field]: value,
    });
  };

  const handleNestedChange = (category, field, value) => {
    onDataChange({
      ...section3Data,
      [category]: {
        ...section3Data[category],
        [field]: value,
      },
    });
  };

  const presetGradients = [
    "linear-gradient(to right, #667eea 0%, #764ba2 100%)",
    "linear-gradient(to right, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(to right, #fa709a 0%, #fee140 100%)",
    "linear-gradient(to right, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(to right, #ff8a80 0%, #ea80fc 100%)",
  ];

  return (
    <div className="space-y-6">
      {/* Text Content */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Text Content</h3>
        <input
          type="text"
          value={section3Data?.title || ""}
          onChange={(e) => handleDataChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="Main title"
        />
        <textarea
          value={section3Data?.subtitle || ""}
          onChange={(e) => handleDataChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          rows="2"
          placeholder="Subtitle"
        />
        <input
          type="text"
          value={section3Data?.buttonText || ""}
          onChange={(e) => handleDataChange("buttonText", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Button text"
        />
      </div>

      {/* Text Colors */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Text Colors</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Title Color
            </label>
            <input
              type="color"
              value={
                section3Data?.textColors?.title ||
                defaultSection3Data.textColors.title
              }
              onChange={(e) =>
                handleNestedChange("textColors", "title", e.target.value)
              }
              className="w-full h-8 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Subtitle Color
            </label>
            <input
              type="color"
              value={
                section3Data?.textColors?.subtitle ||
                defaultSection3Data.textColors.subtitle
              }
              onChange={(e) =>
                handleNestedChange("textColors", "subtitle", e.target.value)
              }
              className="w-full h-8 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Button Text Color
            </label>
            <input
              type="color"
              value={
                section3Data?.textColors?.button ||
                defaultSection3Data.textColors.button
              }
              onChange={(e) =>
                handleNestedChange("textColors", "button", e.target.value)
              }
              className="w-full h-8 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Gradient Styles */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Gradient Styles
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Background Gradient
            </label>
            <input
              type="text"
              value={section3Data?.gradientColors?.background || ""}
              onChange={(e) =>
                handleNestedChange(
                  "gradientColors",
                  "background",
                  e.target.value
                )
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              placeholder="linear-gradient(to right, #664ed3 0%, #87d14b 100%)"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Button Gradient
            </label>
            <input
              type="text"
              value={section3Data?.gradientColors?.button || ""}
              onChange={(e) =>
                handleNestedChange("gradientColors", "button", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              placeholder="linear-gradient(to right, #9888ef 0%, #8978d3 100%)"
            />
          </div>
        </div>
      </div>

      {/* Preset Gradients */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Preset Background Gradients
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {presetGradients.map((gradient, index) => (
            <button
              key={index}
              onClick={() =>
                handleNestedChange("gradientColors", "background", gradient)
              }
              className="h-8 rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
              style={{ background: gradient }}
              title={gradient}
            />
          ))}
        </div>
      </div>

      {/* Preset Button Gradients */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Preset Button Gradients
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {presetGradients.slice(0, 4).map((gradient, index) => (
            <button
              key={index}
              onClick={() =>
                handleNestedChange("gradientColors", "button", gradient)
              }
              className="h-8 rounded-md border border-gray-300 hover:border-gray-400 transition-colors"
              style={{ background: gradient }}
              title={gradient}
            />
          ))}
        </div>
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
        <span>Secondary:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.secondaryColor }}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>Accent:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.accentColor }}
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
      <p>• Section: team/section3</p>
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
  const router = useRouter();

  // Create section3 data with defaults
  const createSection3Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section3 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "team",
        subsectionName: "section3",
        title: "Team Contact",
        content: "Team section 3 content",
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

      console.log("🔍 Loading team section3 data...");
      const result = await api.getSubsection("team", "section3");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection3Data(result.data.data);
        toast.success("Section3 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No team section3 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading team section3 data:", error);
      setError("Failed to load team section3 data");
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
        sectionName: "team",
        subsectionName: "section3",
        title: "Team Contact",
        content: "Team section 3 content",
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
      console.error("Error saving team section3 data:", error);
      setError("Failed to save team section3 data");
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
    return (
      <LoadingScreen message="Loading team section3 data from backend..." />
    );
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
              Team Contact
            </label>
            <p className="text-xs text-gray-500">
              Section 3 нь Team Contact хэсэг бөгөөд хэрэглэгчдийг холбоо барих
              хэсэг руу чиглүүлнэ.
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
