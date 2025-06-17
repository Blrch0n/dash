"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section4 data structure
const defaultSection4Data = {
  title: "Our Services",
  subtitle: "We provide exceptional digital solutions tailored to your needs",
  services: [
    {
      id: 1,
      title: "Unlimited Colors",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "🎨",
      bgColor: "from-purple-400 to-pink-400",
    },
    {
      id: 2,
      title: "High Quality Design",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "✨",
      bgColor: "from-blue-400 to-cyan-400",
    },
    {
      id: 3,
      title: "Luxurious Layouts",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "💎",
      bgColor: "from-green-400 to-teal-400",
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
        It looks like the our_work section4 data doesn't exist in the database.
        <br />
        You can create it with default data or retry loading.
      </div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4 space-y-4">
      <button
        onClick={onCreate}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Create Section4 Data
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
const PreviewComponent = ({ section4Data, colors, isMobile }) => (
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
      className="py-16 px-8 min-h-[800px]"
      style={{
        background: `linear-gradient(135deg, ${colors.primaryColor}10 0%, ${colors.accentColor}10 100%)`,
      }}
    >
      {/* Header */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h1
          className="text-5xl font-bold mb-6"
          style={{
            background: `linear-gradient(to right, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {section4Data?.title || "Our Services"}
        </h1>
        <p
          className="text-lg leading-relaxed"
          style={{ color: `${colors.textColor}CC` }}
        >
          {section4Data?.subtitle || "Loading..."}
        </p>
      </div>

      {/* Services Grid */}
      <div
        className={`grid ${
          isMobile
            ? "grid-cols-1 gap-8"
            : "grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        }`}
      >
        {(section4Data?.services || []).map((service, index) => (
          <div
            key={service.id}
            className="group relative rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
            style={{
              backgroundColor: colors.backgroundColor,
              borderColor: colors.borderColor,
              border: `1px solid ${colors.borderColor}`,
            }}
          >
            {/* Background Gradient */}
            <div
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.accentColor})`,
              }}
            ></div>

            {/* Content */}
            <div className="relative p-8 text-center">
              {/* Icon */}
              <div
                className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
                }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: colors.textColor }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p
                className="leading-relaxed"
                style={{ color: `${colors.textColor}B3` }}
              >
                {service.description}
              </p>

              {/* Decorative Element */}
              <div
                className="w-16 h-1 mx-auto mt-6 rounded-full"
                style={{
                  background: `linear-gradient(to right, ${colors.primaryColor}, ${colors.accentColor})`,
                }}
              ></div>
            </div>
          </div>
        ))}
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
const EditorForm = ({ section4Data, onDataChange, colors }) => {
  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section4Data,
      [field]: value,
    });
  };

  const handleServiceChange = (index, field, value) => {
    onDataChange({
      ...section4Data,
      services: (section4Data.services || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const addNewService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      description: "Service description",
      icon: "🔧",
      bgColor: "from-gray-400 to-gray-600",
    };

    onDataChange({
      ...section4Data,
      services: [...(section4Data.services || []), newService],
    });
  };

  const removeService = (index) => {
    onDataChange({
      ...section4Data,
      services: (section4Data.services || []).filter((_, i) => i !== index),
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
          value={section4Data?.title || ""}
          onChange={(e) => handleTitleChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Section title"
        />
        <textarea
          value={section4Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          rows="3"
          placeholder="Section subtitle"
        />
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Services ({section4Data?.services?.length || 0})
          </h3>
          <button
            onClick={addNewService}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.primaryColor }}
            title="Шинэ үйлчилгээ нэмэх"
          >
            + Add
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {(section4Data?.services || []).map((service, index) => (
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
                placeholder="Service title"
              />
              <textarea
                value={service.description || ""}
                onChange={(e) =>
                  handleServiceChange(index, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                rows="3"
                placeholder="Service description"
              />
              <input
                type="text"
                value={service.icon || ""}
                onChange={(e) =>
                  handleServiceChange(index, "icon", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                placeholder="Icon (emoji or text)"
              />
              <input
                type="text"
                value={service.bgColor || ""}
                onChange={(e) =>
                  handleServiceChange(index, "bgColor", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
                placeholder="Background gradient (optional)"
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
      <p>• Section: our_work/section4</p>
      <p>• Status: {isSaving ? "Saving..." : "Saved"}</p>
    </div>
  </div>
);

// Main Section4 Page Component
const Section4Page = () => {
  // State management
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [section4Data, setSection4Data] = useState(null);
  const router = useRouter();

  // Create section4 data with defaults
  const createSection4Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section4 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "our_work",
        subsectionName: "section4",
        title: "Our Services",
        content: "Our work section 4 content",
        data: defaultSection4Data,
      });

      if (result.success) {
        setSection4Data(defaultSection4Data);
        toast.success("Section4 data created successfully!", {
          id: "creating",
        });
      } else {
        throw new Error("Failed to create section4 data");
      }
    } catch (error) {
      console.error("Error creating section4 data:", error);
      setError("Failed to create section4 data");
      toast.error("Failed to create section4 data", { id: "creating" });
    } finally {
      setIsLoading(false);
    }
  };

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Loading our_work section4 data...");
      const result = await api.getSubsection("our_work", "section4");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection4Data(result.data.data);
        toast.success("Section4 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No our_work section4 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading our_work section4 data:", error);
      setError("Failed to load our_work section4 data");
      toast.error("Section4 мэдээлэл ачаалахад алдаа гарлаа!");
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
        subsectionName: "section4",
        title: "Our Services",
        content: "Our work section 4 content",
        data: dataToSave,
      });

      if (result.success) {
        if (showToast) {
          toast.success("Section4 амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving our_work section4 data:", error);
      setError("Failed to save our_work section4 data");
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
    if (section4Data) {
      saveData(section4Data, true);
    }
  };

  const handleDataChange = (newData) => {
    setSection4Data(newData);
  };

  // Effects
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient || isLoading || !section4Data) return;

    const timeoutId = setTimeout(() => {
      saveData(section4Data, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [section4Data, isClient, isLoading]);

  // Render conditions
  if (!isClient || isLoading) {
    return (
      <LoadingScreen message="Loading our_work section4 data from backend..." />
    );
  }

  if (error && !section4Data) {
    return (
      <ErrorScreen
        error={error}
        onRetry={loadData}
        onCreate={createSection4Data}
      />
    );
  }

  const colors = section4Data?.colors || defaultSection4Data.colors;

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
                section4Data={section4Data || defaultSection4Data}
                colors={colors}
                isMobile={viewMode === "mobile"}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Section 4 засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section 4
            </label>
            <p className="text-xs text-gray-500">
              Section 4 нь Services хэсэг бөгөөд таны үйлчилгээний онцлог давуу
              талуудыг харуулна.
            </p>
          </div>

          <EditorForm
            section4Data={section4Data}
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

export default Section4Page;
