"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { useFileUpload } from "../../../../../../hooks/useFileUpload";

// Default section2 data structure
const defaultSection2Data = {
  title: "Capabilities",
  subtitle: "Creative concept or System Design",
  description:
    "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  capabilities: [
    {
      title: "Tailored",
      description:
        "We believe in a collaborative partnership where we work with you to create the perfect solution",
    },
    {
      title: "Strategic",
      description:
        "Our energy is focus in inspiring projects, activation campaigns and influence strategies",
    },
    {
      title: "Quality",
      description:
        "Development – every solution needs a conceptual design that the further work will be based on.",
    },
    {
      title: "Complete",
      description:
        "We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
    },
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
        It looks like the our_work section2 data doesn't exist in the database.
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
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <section
      className="p-8 min-h-[800px]"
      style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}10 0%, ${colors.accentColor}10 100%)`,
      }}
    >
      {/* Header */}
      <div className="mb-12">
        {/* Content and Image Section */}
        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } items-center gap-8 max-w-6xl mx-auto mb-8`}
        >
          <div className={`${isMobile ? "w-full" : "w-1/2"} text-left`}>
            <div className="text-start">
              <h1
                className="text-4xl font-bold mb-4"
                style={{
                  background: `linear-gradient(to right, ${colors.primaryColor} 0%, ${colors.secondaryColor} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {section2Data?.title || "Capabilities"}
              </h1>
              <h2
                className="text-2xl font-semibold mb-4"
                style={{ color: colors.textColor }}
              >
                {section2Data?.subtitle || "Loading..."}
              </h2>
            </div>
            <p
              className="text-lg leading-relaxed"
              style={{ color: `${colors.textColor}CC` }}
            >
              {section2Data?.description || "Loading..."}
            </p>
          </div>
          <div
            className={`${isMobile ? "w-full" : "w-1/2"} flex justify-center`}
          >
            {section2Data?.image && section2Data.image.trim() !== "" ? (
              <img
                src={section2Data.image}
                alt="Capabilities"
                className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`${
                section2Data?.image && section2Data.image.trim() !== ""
                  ? "hidden"
                  : "flex"
              } w-full max-w-md h-64 items-center justify-center rounded-lg shadow-lg`}
              style={{
                color: `${colors.textColor}60`,
                backgroundColor: `${colors.primaryColor}10`,
              }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">🖼️</div>
                <div>Image Placeholder</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="w-full h-px mb-8"
        style={{
          background: `linear-gradient(to right, transparent, ${colors.borderColor}, transparent)`,
        }}
      ></div>

      {/* Capabilities Section */}
      <div className="max-w-6xl mx-auto">
        <div
          className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-4"} gap-8`}
        >
          {(section2Data?.capabilities || []).map((capability, index) => (
            <div
              key={index}
              className="text-center rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              style={{ backgroundColor: colors.backgroundColor }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${colors.primaryColor}05`;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = colors.backgroundColor;
              }}
            >
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: colors.primaryColor }}
              >
                {capability.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: `${colors.textColor}B3` }}
              >
                {capability.description}
              </p>
            </div>
          ))}
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
const EditorForm = ({ section2Data, onDataChange, colors, uploading, uploadImage }) => {
  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section2Data,
      [field]: value,
    });
  };

  const handleCapabilityChange = (index, field, value) => {
    onDataChange({
      ...section2Data,
      capabilities: (section2Data.capabilities || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadedFile = await uploadImage(file, {
        onSuccess: (fileData) => {
          onDataChange({
            ...section2Data,
            image: fileData.url,
          });
        },
      });
    }
  };

  const handleRemoveImage = () => {
    onDataChange({
      ...section2Data,
      image: "",
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Section title"
        />
        <input
          type="text"
          value={section2Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Section subtitle"
        />
        <textarea
          value={section2Data?.description || ""}
          onChange={(e) => handleTitleChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          rows="4"
          placeholder="Section description"
        />

        {/* Image Upload Section */}
        <div className="space-y-2">
          <label className="text-xs text-gray-500">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
          />

          {/* Image Preview */}
          {section2Data?.image && section2Data.image.trim() !== "" ? (
            <div className="relative">
              <img
                src={section2Data.image}
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
                {uploading ? "Ачаалж байна..." : "Зураг сонгоно уу"}
              </span>
            </div>
          )}
        </div>

        <input
          type="text"
          value={section2Data?.image || ""}
          onChange={(e) => handleTitleChange("image", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          placeholder="Image URL (эсвэл дээрээс файл сонгоно уу)"
        />
      </div>

      {/* Capabilities Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Capabilities ({section2Data?.capabilities?.length || 0})
        </h3>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {(section2Data?.capabilities || []).map((capability, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <h4 className="text-xs font-medium text-gray-600 mb-2">
                Capability {index + 1}
              </h4>
              <input
                type="text"
                value={capability.title || ""}
                onChange={(e) =>
                  handleCapabilityChange(index, "title", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                placeholder="Capability title"
              />
              <textarea
                value={capability.description || ""}
                onChange={(e) =>
                  handleCapabilityChange(index, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                rows="3"
                placeholder="Capability description"
              />
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
      <p>• Section: our_work/section2</p>
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
        sectionName: "our_work",
        subsectionName: "section2",
        title: "Capabilities",
        content: "Our work section 2 content",
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

      console.log("🔍 Loading our_work section2 data...");
      const result = await api.getSubsection("our_work", "section2");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection2Data(result.data.data);
        toast.success("Section2 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No our_work section2 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading our_work section2 data:", error);
      setError("Failed to load our_work section2 data");
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
        sectionName: "our_work",
        subsectionName: "section2",
        title: "Capabilities",
        content: "Our work section 2 content",
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
      console.error("Error saving our_work section2 data:", error);
      setError("Failed to save our_work section2 data");
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
      <LoadingScreen message="Loading our_work section2 data from backend..." />
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
              Section 2
            </label>
            <p className="text-xs text-gray-500">
              Section 2 нь Capabilities хэсэг бөгөөд таны чадварууд болон
              үйлчилгээнүүдийг харуулна.
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
