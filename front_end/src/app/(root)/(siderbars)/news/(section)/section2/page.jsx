"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section2 data structure
const defaultSection2Data = {
  title: "Our Partners and Brands",
  subtitle:
    "Our team of strategists, designers, and engineers deliver valuable, tangible customer experiences",
  partners: [
    "https://max-themes.net/demos/enside/main/upload/logo-b-2.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-3.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-4.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-7.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-8.png",
  ],
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
        It looks like the news section2 data doesn't exist in the database.
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
    className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <div className="w-full h-fit bg-[#fff] py-[60px] sm:py-[80px] lg:py-[110px]">
      <div className="max-w-[1200px] mx-auto w-full h-fit px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 w-full h-fit flex flex-col items-center justify-center">
          <h3 className="text-[#828282] font-semibold text-[12px] sm:text-[14px] lg:text-[16px] uppercase tracking-wider mb-2">
            partners
          </h3>
          <h2
            className="text-[32px] sm:text-[48px] lg:text-[72px] w-full sm:w-[480px] lg:w-[570px] text-center leading-tight mb-4 px-4"
            style={{ color: colors.textColor }}
          >
            {section2Data?.title || defaultSection2Data.title}
          </h2>
          <span
            className="block h-1 sm:h-1.5 w-6 sm:w-8 rounded-full mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
            }}
          />
          <p className="text-[#808080] w-full sm:w-[480px] lg:w-[570px] text-center text-sm sm:text-base lg:text-lg leading-relaxed px-4">
            {section2Data?.subtitle || defaultSection2Data.subtitle}
          </p>
        </div>

        {/* Logo Grid */}
        <div
          className={`w-full h-fit grid ${
            isMobile
              ? "grid-cols-2 gap-3"
              : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
          } p-4 sm:p-6 lg:p-8`}
        >
          {(section2Data?.partners || []).map((partner, index) => (
            <div
              key={index}
              className="w-full h-full flex flex-row items-center justify-center p-2 sm:p-3 lg:p-4 hover:scale-[102%] transition-transform duration-300"
            >
              {partner ? (
                <img
                  src={partner}
                  alt={`Partner logo ${index + 1}`}
                  className="grayscale hover:grayscale-0 w-full max-w-[120px] sm:max-w-[160px] lg:max-w-[210px] h-auto transition-all duration-300 hover:scale-[102%]"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div className="hidden w-full h-24 items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-xs">Logo {index + 1}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
const EditorForm = ({ section2Data, onDataChange, colors }) => {
  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section2Data,
      [field]: value,
    });
  };

  const handlePartnerChange = (index, value) => {
    onDataChange({
      ...section2Data,
      partners: (section2Data.partners || []).map((partner, i) =>
        i === index ? value : partner
      ),
    });
  };

  const addPartner = () => {
    onDataChange({
      ...section2Data,
      partners: [...(section2Data.partners || []), ""],
    });
  };

  const removePartner = (index) => {
    onDataChange({
      ...section2Data,
      partners: (section2Data.partners || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Header Content
        </h3>
        <input
          type="text"
          value={section2Data?.title || ""}
          onChange={(e) => handleTitleChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="Section title"
        />
        <textarea
          value={section2Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Section subtitle"
        />
      </div>

      {/* Partners Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Partners ({section2Data?.partners?.length || 0})
          </h3>
          <button
            onClick={addPartner}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.primaryColor }}
          >
            + Add
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-3">
          {(section2Data?.partners || []).map((partner, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-md p-3 relative"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-medium text-gray-600">
                  Partner {index + 1}
                </h4>
                {(section2Data?.partners || []).length > 1 && (
                  <button
                    onClick={() => removePartner(index)}
                    className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={partner}
                onChange={(e) => handlePartnerChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Partner logo URL"
              />
              {partner && (
                <div className="mt-2">
                  <img
                    src={partner}
                    alt={`Partner ${index + 1}`}
                    className="w-20 h-12 object-contain border rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
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
      <p>• Section: news/section2</p>
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
        sectionName: "news",
        subsectionName: "section2",
        title: "News Partners",
        content: "News section 2 content",
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

      console.log("🔍 Loading news section2 data...");
      const result = await api.getSubsection("news", "section2");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection2Data(result.data.data);
        toast.success("Section2 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No news section2 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading news section2 data:", error);
      setError("Failed to load news section2 data");
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
        sectionName: "news",
        subsectionName: "section2",
        title: "News Partners",
        content: "News section 2 content",
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
      console.error("Error saving news section2 data:", error);
      setError("Failed to save news section2 data");
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
    return (
      <LoadingScreen message="Loading news section2 data from backend..." />
    );
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
                section2Data={section2Data || defaultSection2Data}
                colors={colors}
                isMobile={viewMode === "mobile"}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Section 2 засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              News Partners
            </label>
            <p className="text-xs text-gray-500">
              Section 2 нь News Partners хэсэг бөгөөд хамтрагч болон брэндүүдийг
              харуулна.
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

export default Section2Page;
