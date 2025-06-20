"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { useFileUpload } from "../../../../../../hooks/useFileUpload";

// Default section1 data structure
const defaultSection1Data = {
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
        It looks like the our_work section1 data doesn't exist in the database.
        <br />
        You can create it with default data or retry loading.
      </div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4 space-y-4">
      <button
        onClick={onCreate}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
      >
        Create Section1 Data
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
const PreviewComponent = ({ section1Data, colors, isMobile }) => (
  <div
    className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{ borderColor: colors.borderColor }}
  >
    <section
      className="p-8 min-h-[800px]"
      style={{ backgroundColor: colors.backgroundColor }}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1
          className="text-4xl font-bold mb-4"
          style={{
            color: colors.primaryColor,
            background: `linear-gradient(to right, ${colors.primaryColor}, ${colors.secondaryColor})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {section1Data?.title || "Case Studies"}
        </h1>
        <p
          className="text-lg max-w-3xl mx-auto"
          style={{ color: colors.textColor }}
        >
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
                background: `linear-gradient(to bottom right, ${colors.primaryColor}20, ${colors.secondaryColor}20)`,
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
                style={{ color: colors.textColor }}
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
                  style={{ color: colors.primaryColor }}
                >
                  {project.category}
                </span>
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: colors.textColor }}
              >
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-1 mb-3">
                {(project.tags || []).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${colors.primaryColor}10`,
                      color: colors.primaryColor,
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
const EditorForm = ({ section1Data, onDataChange, colors, uploading, uploadImage }) => {
  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section1Data,
      [field]: value,
    });
  };

  const handleProjectChange = (index, field, value) => {
    onDataChange({
      ...section1Data,
      projects: (section1Data.projects || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleTagsChange = (index, tagsString) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    handleProjectChange(index, "tags", tags);
  };

  const handleImageUpload = async (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const uploadedFile = await uploadImage(file, {
        onSuccess: (fileData) => {
          handleProjectChange(index, "image", fileData.url);
        },
      });
    }
  };

  const addNewProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Project",
      category: "Category",
      tags: ["Tag1", "Tag2"],
      description: "Project description",
      image: "",
    };

    onDataChange({
      ...section1Data,
      projects: [...(section1Data.projects || []), newProject],
    });
  };

  const removeProject = (index) => {
    onDataChange({
      ...section1Data,
      projects: (section1Data.projects || []).filter((_, i) => i !== index),
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
          value={section1Data?.title || ""}
          onChange={(e) => handleTitleChange("title", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Section title"
        />
        <textarea
          value={section1Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          rows="3"
          placeholder="Section subtitle"
        />
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Projects ({section1Data?.projects?.length || 0})
          </h3>
          <button
            onClick={addNewProject}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.primaryColor }}
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
                placeholder="Project title"
              />
              <input
                type="text"
                value={project.category || ""}
                onChange={(e) =>
                  handleProjectChange(index, "category", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                placeholder="Project category"
              />
              <input
                type="text"
                value={(project.tags || []).join(", ")}
                onChange={(e) => handleTagsChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                placeholder="Tags (comma separated)"
              />
              <textarea
                value={project.description || ""}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                rows="2"
                placeholder="Project description"
              />

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-xs text-gray-500">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(index, e)}
                  disabled={uploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
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
                      onClick={() => handleProjectChange(index, "image", "")}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      title="Зураг устгах"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-400">
                      {uploading ? "Ачаалж байна..." : "Зураг сонгоно уу"}
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
      <p>• Section: our_work/section1</p>
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

  // File upload hook
  const { uploadImage, uploading } = useFileUpload();

  // Create section1 data with defaults
  const createSection1Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section1 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "our_work",
        subsectionName: "section1",
        title: "Case Studies",
        content: "Our work section 1 content",
        data: defaultSection1Data,
      });

      if (result.success) {
        setSection1Data(defaultSection1Data);
        toast.success("Section1 data created successfully!", {
          id: "creating",
        });
      } else {
        throw new Error("Failed to create section1 data");
      }
    } catch (error) {
      console.error("Error creating section1 data:", error);
      setError("Failed to create section1 data");
      toast.error("Failed to create section1 data", { id: "creating" });
    } finally {
      setIsLoading(false);
    }
  };

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔍 Loading our_work section1 data...");
      const result = await api.getSubsection("our_work", "section1");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection1Data(result.data.data);
        toast.success("Section1 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No our_work section1 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading our_work section1 data:", error);
      setError("Failed to load our_work section1 data");
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
        sectionName: "our_work",
        subsectionName: "section1",
        title: "Case Studies",
        content: "Our work section 1 content",
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
      console.error("Error saving our_work section1 data:", error);
      setError("Failed to save our_work section1 data");
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
    return (
      <LoadingScreen message="Loading our_work section1 data from backend..." />
    );
  }

  if (error && !section1Data) {
    return (
      <ErrorScreen
        error={error}
        onRetry={loadData}
        onCreate={createSection1Data}
      />
    );
  }

  const colors = section1Data?.colors || defaultSection1Data.colors;

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
                section1Data={section1Data || defaultSection1Data}
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
            <p className="text-xs text-gray-500 mb-4">
              Section 1 нь Case Studies хэсэг бөгөөд таны төслүүдийн
              жишээнүүдийг харуулна.
            </p>
          </div>

          <EditorForm
            section1Data={section1Data}
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

export default Section1Page;
