"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { useFileUpload } from "../../../../../../hooks/useFileUpload";

// Default section2 data structure
const defaultSection2Data = {
  backgroundImage:
    "https://wallpapers.com/images/featured/8k-e16w8b36gngra7a4.jpg",
  smallText: "Want to be our client?",
  mainHeading: "No subscription, you only pay once.",
  buttonText: "Purchase theme",
  buttonLink: "/",
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
        It looks like the contact section2 data doesn't exist in the database.
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
const PreviewComponent = ({ section2Data, colors, isMobile }) => {
  const router = useRouter();

  return (
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
        className={`w-full h-[650px] sm:h-[500px] xs:h-[400px] relative bg-cover flex items-center bg-fixed justify-center bg-center px-4 ${
          isMobile ? "h-[400px]" : ""
        }`}
        style={{ backgroundImage: `url(${section2Data.backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-[#00000034]"></div>
        <div className="relative text-white flex flex-col w-full max-w-[500px] sm:max-w-[400px] xs:max-w-[320px] items-center justify-center text-center gap-4 sm:gap-3 xs:gap-2">
          <p className="text-[14px] sm:text-[13px] xs:text-[12px]">
            {section2Data.smallText}
          </p>
          <h2 className="text-[32px] sm:text-[40px] md:text-[45px] xs:text-[28px] leading-tight">
            {section2Data.mainHeading}
          </h2>
          <button
            style={{
              background: "linear-gradient(to right, #3452ff 0%, #ad3ed8 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => router.push(section2Data.buttonLink)}
            className="py-3 px-8 sm:py-2.5 sm:px-6 xs:py-2 xs:px-4 text-[16px] sm:text-[14px] xs:text-[13px] font-medium hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            {section2Data.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

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
const EditorForm = ({
  section2Data,
  onDataChange,
  colors,
  uploading,
  uploadImage,
}) => {
  const handleDataChange = (field, value) => {
    onDataChange({
      ...section2Data,
      [field]: value,
    });
  };

  const handleBackgroundImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadedFile = await uploadImage(file, {
        onSuccess: (fileData) => {
          handleDataChange("backgroundImage", fileData.url);
        },
      });
    }
  };

  const handleRemoveBackgroundImage = () => {
    handleDataChange("backgroundImage", "");
  };

  return (
    <div className="space-y-6">
      {/* Background Image */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Background Image
        </h3>

        {/* Image Upload Section */}
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />

          {/* Background Image Preview */}
          {section2Data.backgroundImage &&
          section2Data.backgroundImage.trim() !== "" ? (
            <div className="relative">
              <img
                src={section2Data.backgroundImage}
                alt="Background Preview"
                className="w-full h-32 object-cover rounded border"
              />
              <button
                onClick={handleRemoveBackgroundImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Зураг устгах"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
              <span className="text-sm text-gray-400">
                {uploading ? "Ачаалж байна..." : "Зураг сонгоно уу"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Small Text */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Small Text</h3>
        <input
          type="text"
          value={section2Data.smallText}
          onChange={(e) => handleDataChange("smallText", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Small descriptive text"
        />
      </div>

      {/* Main Heading */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Main Heading</h3>
        <textarea
          value={section2Data.mainHeading}
          onChange={(e) => handleDataChange("mainHeading", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Main heading text"
        />
      </div>

      {/* Button Text */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Button Text</h3>
        <input
          type="text"
          value={section2Data.buttonText}
          onChange={(e) => handleDataChange("buttonText", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Button text"
        />
      </div>

      {/* Button Link */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Button Link</h3>
        <input
          type="text"
          value={section2Data.buttonLink}
          onChange={(e) => handleDataChange("buttonLink", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Button link URL"
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
        <span>Secondary:</span>
        <div
          className="w-6 h-4 rounded border"
          style={{ backgroundColor: colors?.secondaryColor }}
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
      <p>• Section: contact/section2</p>
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

  // File upload hook
  const { uploadImage, uploading } = useFileUpload();

  // Create section2 data with defaults
  const createSection2Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section2 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "contact",
        subsectionName: "section2",
        title: "Our Location",
        content: "Contact section 2 content",
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

      console.log("🔍 Loading contact section2 data...");
      const result = await api.getSubsection("contact", "section2");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection2Data(result.data.data);
        toast.success("Section2 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No contact section2 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading contact section2 data:", error);
      setError("Failed to load contact section2 data");
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
        sectionName: "contact",
        subsectionName: "section2",
        title: "Our Location",
        content: "Contact section 2 content",
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
      console.error("Error saving contact section2 data:", error);
      setError("Failed to save contact section2 data");
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
      <LoadingScreen message="Loading contact section2 data from backend..." />
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
              Our Location
            </label>
            <p className="text-xs text-gray-500">
              Section 2 нь Contact хэсэг бөгөөд таны байршил болон call to
              action харуулна.
            </p>
          </div>

          <EditorForm
            section2Data={section2Data}
            onDataChange={handleDataChange}
            colors={colors}
            uploading={uploading}
            uploadImage={uploadImage}
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
