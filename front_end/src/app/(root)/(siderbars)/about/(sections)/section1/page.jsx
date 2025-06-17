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

// Error Screen Component
const ErrorScreen = ({ error, onRetry }) => (
  <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
    <div className="h-full w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4">
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
const PreviewComponent = ({ section1Data, colors, isMobile }) => (
  <div
    className={`border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <div
      className="w-full h-fit flex py-[110px] md:py-[80px] sm:py-[60px] px-4 sm:px-6 md:px-8 flex-col gap-10 items-center justify-center"
      style={{
        backgroundColor: colors.backgroundColor,
        color: colors.textColor,
      }}
    >
      <div className="w-full h-fit flex flex-col items-center justify-center text-center">
        <h3
          className="text-sm sm:text-base"
          style={{ color: `${colors.textColor}80` }}
        >
          {section1Data?.welcome?.title || "Welcome"}
        </h3>
        <h2
          className={`w-full max-w-[520px] px-4 font-bold ${
            isMobile
              ? "text-[24px]"
              : "text-[32px] sm:text-[48px] md:text-[60px] lg:text-[72px]"
          }`}
          style={{ color: colors.textColor }}
        >
          {section1Data?.features?.title || "Outstanding Features"}
        </h2>
        <span
          className="block h-[6px] w-[35px] rounded-full my-4"
          style={{
            background: `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
          }}
        />
        <p
          className={`w-full max-w-[570px] px-4 ${
            isMobile
              ? "text-[14px]"
              : "text-[14px] sm:text-[16px] md:text-[18px]"
          }`}
          style={{ color: `${colors.textColor}B3` }}
        >
          {section1Data?.welcome?.content || "Welcome content..."}
        </p>
      </div>

      <div className="w-full h-fit flex flex-wrap items-center justify-center gap-4 md:gap-6">
        {section1Data?.features?.items?.map((item, index) => (
          <div
            className={`w-full h-fit flex flex-col gap-6 md:gap-10 items-center justify-center text-center mx-2 hover:transform hover:-translate-y-2 transition-all duration-300 ${
              isMobile ? "max-w-[280px]" : "sm:w-[350px] md:w-[370px]"
            }`}
            key={index}
            style={{
              borderColor: `${colors.textColor}20`,
            }}
          >
            {item.image ? (
              <img
                className={`w-full object-cover bg-center bg-cover rounded-lg ${
                  isMobile ? "h-[180px]" : "h-[200px] sm:h-[240px] md:h-[270px]"
                }`}
                src={item.image}
                alt={item.title}
              />
            ) : (
              <div
                className={`w-full rounded-lg border-2 border-dashed flex items-center justify-center ${
                  isMobile ? "h-[180px]" : "h-[200px] sm:h-[240px] md:h-[270px]"
                }`}
                style={{
                  borderColor: `${colors.textColor}40`,
                  backgroundColor: `${colors.textColor}10`,
                }}
              >
                <span
                  style={{ color: `${colors.textColor}60` }}
                  className="text-sm"
                >
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
              style={{ color: colors.textColor }}
            >
              {item.title}
            </h1>
            <p
              className={`px-4 leading-relaxed ${
                isMobile
                  ? "text-[14px]"
                  : "text-[14px] sm:text-[15px] md:text-[16px]"
              }`}
              style={{ color: `${colors.textColor}99` }}
            >
              {item.description}
            </p>
            <span
              className="w-1/2 h-[1px]"
              style={{ backgroundColor: `${colors.textColor}30` }}
            />
          </div>
        ))}
      </div>

      <button
        className="px-[18px] sm:px-[24px] rounded-[5px] text-white py-3 sm:py-4 text-sm sm:text-base hover:transform hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-200"
        style={{
          background: `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
        }}
        onMouseEnter={(e) => {
          e.target.style.background = `linear-gradient(to right, ${colors.secondaryColor} 0%, ${colors.accentColor} 100%)`;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`;
        }}
      >
        {section1Data?.exploreButton?.text || "Explore All Features"}
      </button>
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
const EditorForm = ({ section1Data, onDataChange, colors }) => {
  const handleWelcomeChange = (field, value) => {
    onDataChange({
      ...section1Data,
      welcome: { ...section1Data.welcome, [field]: value },
    });
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...(section1Data.features?.items || [])];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    onDataChange({
      ...section1Data,
      features: { ...section1Data.features, items: newFeatures },
    });
  };

  const handleButtonChange = (field, value) => {
    onDataChange({
      ...section1Data,
      exploreButton: { ...section1Data.exploreButton, [field]: value },
    });
  };

  // Handle image upload for features
  const handleImageUpload = (index, event) => {
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
        handleFeatureChange(index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    handleFeatureChange(index, "image", "");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Welcome Section
        </h3>
        <input
          type="text"
          value={section1Data?.welcome?.title || ""}
          onChange={(e) => handleWelcomeChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Welcome title"
        />
        <textarea
          value={section1Data?.welcome?.content || ""}
          onChange={(e) => handleWelcomeChange("content", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
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
          value={section1Data?.features?.title || ""}
          onChange={(e) =>
            onDataChange({
              ...section1Data,
              features: { ...section1Data.features, title: e.target.value },
            })
          }
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          placeholder="Features title"
        />
      </div>

      {/* Features Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Feature Items
        </h3>
        {section1Data?.features?.items?.map((feature, idx) => (
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
              value={feature.title || ""}
              onChange={(e) =>
                handleFeatureChange(idx, "title", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              placeholder="Feature title"
            />
            <textarea
              value={feature.description || ""}
              onChange={(e) =>
                handleFeatureChange(idx, "description", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
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
          value={section1Data?.exploreButton?.text || ""}
          onChange={(e) => handleButtonChange("text", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Button text"
        />
        <input
          type="text"
          value={section1Data?.exploreButton?.link || ""}
          onChange={(e) => handleButtonChange("link", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          placeholder="Button link"
        />
      </div>
    </div>
  );
};

// Color Preview Component
const ColorPreview = ({ colors }) => (
  <div className="p-4 bg-gray-50 rounded-lg mt-6">
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
      <p>• Section: about/section1</p>
      <p>• Status: {isSaving ? "Saving..." : "Saved"}</p>
    </div>
  </div>
);

// Main Section1 Page Component
const Section1Page = () => {
  // State management
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [section1Data, setSection1Data] = useState(null);
  const router = useRouter();

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await api.getSubsection("about", "section1");

      if (result.success && result.data?.data) {
        setSection1Data(result.data.data);
        toast.success("Section1 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        setError("No section1 data found in database");
        toast.error("Section1 өгөгдөл олдсонгүй!");
      }
    } catch (error) {
      console.error("Error loading section1 data:", error);
      setError("Failed to load section1 data");
      toast.error("Section1 мэдээлэл ачаалахад алдаа гарлаа!");
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
        subsectionName: "section1",
        title: "Our Story",
        content: "About section 1 content",
        data: dataToSave,
      });

      if (result.success) {
        if (showToast) {
          toast.success("Section1 амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving section1 data:", error);
      setError("Failed to save section1 data");
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
    if (section1Data) {
      saveData(section1Data, true);
    }
  };

  const handleDataChange = (newData) => {
    setSection1Data(newData);
  };

  // Effects
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient || isLoading || !section1Data) return;

    const timeoutId = setTimeout(() => {
      saveData(section1Data, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [section1Data, isClient, isLoading]);

  // Render conditions
  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading section1 data from backend..." />;
  }

  if (error || !section1Data) {
    return <ErrorScreen error={error} onRetry={loadData} />;
  }

  const colors = section1Data?.colors || {};

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

          <div className="flex justify-center items-center w-full">
            <div
              className="transition-all duration-500 ease-in-out mx-auto"
              style={{
                width: viewMode === "mobile" ? "22rem" : "100%",
                transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
              }}
            >
              <PreviewComponent
                section1Data={section1Data}
                colors={colors}
                isMobile={viewMode === "mobile"}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Section 1 засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 1
            </label>
            <p className="text-xs text-gray-500">
              Section 1 нь таны вэбсайтын эхний хэсэг бөгөөд танилцуулга болон
              онцлог шинж чанаруудыг агуулна.
            </p>
          </div>

          <EditorForm
            section1Data={section1Data}
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
          >
            {isSaving ? "Хадгалж байна..." : "Хадгалах"}
          </button>

          <StorageInfo isSaving={isSaving} />
        </div>
      </div>
    </>
  );
};

export default Section1Page;
