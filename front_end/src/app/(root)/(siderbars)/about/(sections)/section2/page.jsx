"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

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
        It looks like the section2 data doesn't exist in the database.
        <br />
        You can create it with default data or retry loading.
      </div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4 space-y-4">
      <button
        onClick={onCreate}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Create Section2 Data
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
const PreviewComponent = ({ section2Data, colors, isMobile }) => (
  <div
    className={`border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      background: `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
      borderColor: colors.borderColor,
    }}
  >
    <div
      className="w-full h-fit flex flex-col lg:flex-row items-center gap-4 justify-between text-white p-4 lg:p-8 mx-auto max-w-[1200px]"
      style={{ flexDirection: isMobile ? "column" : "row" }}
    >
      <div className="w-full lg:w-1/2 h-full flex flex-col items-center lg:items-start justify-center mb-6 lg:mb-0">
        <h1 className="text-[24px] sm:text-[28px] lg:text-[30px] mb-3 sm:mb-4 text-center lg:text-left">
          {section2Data?.creativeSpirit?.title || "Creative Spirit"}
        </h1>
        <p
          className="text-center lg:text-start text-sm sm:text-base leading-relaxed"
          style={{ color: `${colors.backgroundColor}CC` }}
        >
          {section2Data?.creativeSpirit?.content || "Creative content..."}
        </p>
      </div>
      <button
        style={{
          background: `linear-gradient(to right, ${colors.secondaryColor} 0%, ${colors.textColor} 100%)`,
          color: colors.backgroundColor,
          border: "none",
          padding: "0.6rem 1.5rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
        className="transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 text-sm sm:text-base whitespace-nowrap"
        onMouseEnter={(e) => {
          e.target.style.background = `linear-gradient(to right, ${colors.textColor} 0%, ${colors.secondaryColor} 100%)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = `linear-gradient(to right, ${colors.secondaryColor} 0%, ${colors.textColor} 100%)`;
        }}
      >
        {section2Data?.actionButton?.text || "See all Features"}
      </button>
    </div>
  </div>
);

// View Mode Toggle Component
const ViewModeToggle = ({ viewMode, setViewMode, primaryColor }) => (
  <div className="flex justify-center mb-4 lg:mb-6">
    <div className="bg-gray-200 rounded-lg p-1 flex">
      {["desktop", "mobile"].map((mode) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`px-3 lg:px-4 py-2 rounded-md transition-all text-sm lg:text-base ${
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
const EditorForm = ({ section2Data, onDataChange, colors }) => {
  const handleCreativeSpiritChange = (field, value) => {
    onDataChange({
      ...section2Data,
      creativeSpirit: { ...section2Data.creativeSpirit, [field]: value },
    });
  };

  const handleButtonChange = (field, value) => {
    onDataChange({
      ...section2Data,
      actionButton: { ...section2Data.actionButton, [field]: value },
    });
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Creative Spirit Section */}
      <div>
        <h3 className="text-xs lg:text-sm font-medium text-gray-700 mb-2">
          Creative Spirit Content
        </h3>
        <input
          type="text"
          value={section2Data?.creativeSpirit?.title || ""}
          onChange={(e) => handleCreativeSpiritChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2 text-sm lg:text-base"
          placeholder="Creative Spirit title"
        />
        <textarea
          value={section2Data?.creativeSpirit?.content || ""}
          onChange={(e) =>
            handleCreativeSpiritChange("content", e.target.value)
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent text-sm lg:text-base"
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
          value={section2Data?.actionButton?.text || ""}
          onChange={(e) => handleButtonChange("text", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2 text-sm lg:text-base"
          placeholder="Button text"
        />
        <input
          type="text"
          value={section2Data?.actionButton?.link || ""}
          onChange={(e) => handleButtonChange("link", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent text-sm lg:text-base"
          placeholder="Button link"
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
      <p>• Section: about/section2</p>
      <p>• Status: {isSaving ? "Saving..." : "Saved"}</p>
    </div>
  </div>
);

// Main Section2 Page Component
const Section2Page = () => {
  // State management
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [section2Data, setSection2Data] = useState(null);
  const router = useRouter();

  // Create section2 data with defaults
  const createSection2Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section2 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "about",
        subsectionName: "section2",
        title: "Our Mission",
        content: "About section 2 content",
        data: defaultSection2Data,
      });

      if (result.success) {
        setSection2Data(defaultSection2Data);
        toast.success("Section2 data created successfully!", {
          id: "creating",
        });
      } else {
        throw new Error("Failed to create section2 data");
      }
    } catch (error) {
      console.error("Error creating section2 data:", error);
      setError("Failed to create section2 data");
      toast.error("Failed to create section2 data", { id: "creating" });
    } finally {
      setIsLoading(false);
    }
  };

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Loading section2 data...");
      const result = await api.getSubsection("about", "section2");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection2Data(result.data.data);
        toast.success("Section2 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No section2 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading section2 data:", error);
      setError("Failed to load section2 data");
      toast.error("Section2 мэдээлэл ачаалахад алдаа гарлаа!");
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
        subsectionName: "section2",
        title: "Our Mission",
        content: "About section 2 content",
        data: dataToSave,
      });

      if (result.success) {
        if (showToast) {
          toast.success("Section2 амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving section2 data:", error);
      setError("Failed to save section2 data");
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
    if (section2Data) {
      saveData(section2Data, true);
    }
  };

  const handleDataChange = (newData) => {
    setSection2Data(newData);
  };

  // Effects
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient || isLoading || !section2Data) return;

    const timeoutId = setTimeout(() => {
      saveData(section2Data, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [section2Data, isClient, isLoading]);

  // Render conditions
  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading section2 data from backend..." />;
  }

  if (error && !section2Data) {
    return (
      <ErrorScreen
        error={error}
        onRetry={loadData}
        onCreate={createSection2Data}
      />
    );
  }

  const colors = section2Data?.colors || defaultSection2Data.colors;

  return (
    <>
      <ToastContainer />

      <div className="w-full h-full flex flex-col lg:flex-row gap-3 lg:gap-5 bg-gray-50 p-3 lg:p-5">
        {/* Preview Section */}
        <div className="h-full w-full lg:w-[70%] bg-white rounded-lg p-3 lg:p-4 overflow-auto">
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
                width: viewMode === "mobile" ? "20rem" : "100%",
                transform: viewMode === "mobile" ? "scale(0.9)" : "scale(1)",
              }}
            >
              <PreviewComponent
                section2Data={section2Data || defaultSection2Data}
                colors={colors}
                isMobile={viewMode === "mobile"}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-full lg:w-[30%] bg-white rounded-lg p-3 lg:p-4 overflow-auto">
          <h2 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-gray-800">
            Section 2 засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-xs lg:text-sm font-medium text-gray-700 mb-2">
              Section 2
            </label>
            <p className="text-xs text-gray-500 mb-3 lg:mb-4">
              Section 2 нь таны creative spirit болон бүтээлч сэтгэлгээний тухай
              хэсэг бөгөөд зөвхөн нэг товчлуур агуулна.
            </p>
          </div>

          <EditorForm
            section2Data={section2Data}
            onDataChange={handleDataChange}
            colors={colors}
          />

          <ColorPreview colors={colors} />

          {/* Save Button */}
          <button
            onClick={handleManualSave}
            disabled={isLoading || isSaving}
            className="w-full text-white py-2 lg:py-3 px-4 rounded-md transition-colors font-medium mt-4 lg:mt-6 text-sm lg:text-base disabled:opacity-50"
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

export default Section2Page;
