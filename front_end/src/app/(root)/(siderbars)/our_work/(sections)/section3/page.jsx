"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section3 data structure
const defaultSection3Data = {
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
        It looks like the our_work section3 data doesn't exist in the database.
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
          {section3Data?.title || "Unique services"}
        </h1>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: colors.textColor }}
        >
          {section3Data?.subtitle || "Our Approach"}
        </h2>
        <p
          className="text-lg leading-relaxed"
          style={{ color: `${colors.textColor}CC` }}
        >
          {section3Data?.description || "Loading..."}
        </p>
      </div>

      {/* Services Grid */}
      <div
        className={`grid ${
          isMobile ? "grid-cols-1 gap-6" : "grid-cols-4 gap-6 max-w-7xl mx-auto"
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
                  background: `linear-gradient(135deg, ${colors.primaryColor}, ${colors.secondaryColor})`,
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
  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section3Data,
      [field]: value,
    });
  };

  const handleServiceChange = (index, field, value) => {
    onDataChange({
      ...section3Data,
      services: (section3Data.services || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

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
        handleServiceChange(index, "image", e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addNewService = () => {
    const newService = {
      id: Date.now(),
      title: "New Service",
      description: "Service description",
      image: "",
    };

    onDataChange({
      ...section3Data,
      services: [...(section3Data.services || []), newService],
    });
  };

  const removeService = (index) => {
    onDataChange({
      ...section3Data,
      services: (section3Data.services || []).filter((_, i) => i !== index),
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
          value={section3Data?.title || ""}
          onChange={(e) => handleTitleChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Main title"
        />
        <input
          type="text"
          value={section3Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Subtitle"
        />
        <textarea
          value={section3Data?.description || ""}
          onChange={(e) => handleTitleChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          rows="3"
          placeholder="Description"
        />
      </div>

      {/* Services Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Services ({section3Data?.services?.length || 0})
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

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Upload Image</label>
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
                      onClick={() => handleServiceChange(index, "image", "")}
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
                placeholder="Image URL (эсвэл дээрээс файл сонгоно уу)"
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
      <p>• Section: our_work/section3</p>
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
        sectionName: "our_work",
        subsectionName: "section3",
        title: "Unique Services",
        content: "Our work section 3 content",
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

      console.log("🔍 Loading our_work section3 data...");
      const result = await api.getSubsection("our_work", "section3");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection3Data(result.data.data);
        toast.success("Section3 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No our_work section3 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading our_work section3 data:", error);
      setError("Failed to load our_work section3 data");
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
        sectionName: "our_work",
        subsectionName: "section3",
        title: "Unique Services",
        content: "Our work section 3 content",
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
      console.error("Error saving our_work section3 data:", error);
      setError("Failed to save our_work section3 data");
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
      <LoadingScreen message="Loading our_work section3 data from backend..." />
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
              Section 3
            </label>
            <p className="text-xs text-gray-500">
              Section 3 нь Unique Services хэсэг бөгөөд таны үйлчилгээний давуу
              талуудыг харуулна.
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
