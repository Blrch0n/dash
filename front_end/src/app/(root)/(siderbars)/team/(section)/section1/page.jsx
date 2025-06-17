"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";

// Default section1 data structure
const defaultSection1Data = {
  title: "Our Technologies",
  subtitle: "TECH STACK",
  description:
    "Meet our powerful tech stack and tools we use to deliver exceptional results",
  projects: [
    {
      id: 1,
      title: "React.js",
      position:
        "A JavaScript library for building user interfaces with component-based architecture and virtual DOM for optimal performance.",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Node.js",
      position:
        "A JavaScript runtime built on Chrome's V8 engine for scalable server-side applications and real-time web services.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "MongoDB",
      position:
        "A NoSQL document database that provides high performance, high availability, and easy scalability for modern applications.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "AWS Cloud",
      position:
        "Amazon Web Services cloud platform providing reliable, scalable, and inexpensive cloud computing services worldwide.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Docker",
      position:
        "A containerization platform that enables developers to package applications with all dependencies for consistent deployment.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Git & GitHub",
      position:
        "Version control system and collaborative platform for tracking changes and managing code repositories effectively.",
      image:
        "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      title: "TypeScript",
      position:
        "A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "GraphQL",
      position:
        "A query language for APIs and runtime for executing queries with existing data, providing efficient data loading.",
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
        It looks like the team section1 data doesn't exist in the database.
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
    className={`border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <div className="w-full h-fit flex flex-col pt-[100px] gap-12 items-center justify-center bg-[#F5F5F5]">
      {/* Header Section */}
      <div className="w-full h-fit flex flex-col items-center gap-2">
        <h3 className="text-[16px] uppercase" style={{ color: "#828282" }}>
          {section1Data?.subtitle || "TECH STACK"}
        </h3>
        <h2
          className="text-[32px] sm:text-[72px]"
          style={{ color: colors.textColor }}
        >
          {section1Data?.title || "Our Technologies"}
        </h2>
        <p
          className="text-[18px] text-center sm:text-base"
          style={{ color: "#999999" }}
        >
          {section1Data?.description || "Meet our powerful tech stack"}
        </p>
      </div>

      {/* Technologies Grid */}
      <div
        className={`w-full grid ${
          isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        } items-center justify-center bg-white text-black`}
      >
        {(section1Data?.projects || []).map((data, index) => (
          <div
            key={data.id}
            className="flex flex-col items-center relative h-[420px] w-full justify-center text-center p-4 group overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            style={{
              backgroundImage: `url(${data.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 z-0 bg-transparent group-hover:bg-[#000000c2] transition-all duration-300 ease-in-out" />

            <h3 className="text-lg text-transparent duration-300 transition-all ease-in-out group-hover:text-white font-semibold relative z-10">
              {data.title}
            </h3>

            <p className="text-transparent duration-300 transition-all ease-in-out group-hover:text-white relative z-10 px-4">
              {data.position}
            </p>
          </div>
        ))}
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
const EditorForm = ({ section1Data, onDataChange, colors }) => {
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

  const addNewProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Technology",
      position: "Description of the new technology",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
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
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="Section title"
        />
        <input
          type="text"
          value={section1Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="Section subtitle"
        />
        <textarea
          value={section1Data?.description || ""}
          onChange={(e) => handleTitleChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="Section description"
        />
      </div>

      {/* Technologies Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Technologies ({section1Data?.projects?.length || 0})
          </h3>
          <button
            onClick={addNewProject}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.primaryColor }}
            title="Шинэ технологи нэмэх"
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
                title="Технологи устгах"
              >
                ×
              </button>

              <h4 className="text-xs font-medium text-gray-600 mb-2">
                Technology {index + 1}
              </h4>
              <input
                type="text"
                value={project.title || ""}
                onChange={(e) =>
                  handleProjectChange(index, "title", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                placeholder="Technology name"
              />
              <textarea
                value={project.position || ""}
                onChange={(e) =>
                  handleProjectChange(index, "position", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                rows="3"
                placeholder="Technology description"
              />
              <input
                type="text"
                value={project.image || ""}
                onChange={(e) =>
                  handleProjectChange(index, "image", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Image URL"
              />

              {/* Image Preview */}
              {project.image && (
                <div className="mt-2">
                  <img
                    src={project.image}
                    alt={`Preview for ${project.title}`}
                    className="w-full h-20 object-cover rounded border"
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
      <p>• Section: team/section1</p>
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

  // Create section1 data with defaults
  const createSection1Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section1 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "team",
        subsectionName: "section1",
        title: "Team Technologies",
        content: "Team section 1 content",
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

      console.log("🔍 Loading team section1 data...");
      const result = await api.getSubsection("team", "section1");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection1Data(result.data.data);
        toast.success("Section1 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No team section1 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading team section1 data:", error);
      setError("Failed to load team section1 data");
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
        sectionName: "team",
        subsectionName: "section1",
        title: "Team Technologies",
        content: "Team section 1 content",
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
      console.error("Error saving team section1 data:", error);
      setError("Failed to save team section1 data");
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
      <LoadingScreen message="Loading team section1 data from backend..." />
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
              Team Technologies
            </label>
            <p className="text-xs text-gray-500">
              Section 1 нь Team Technologies хэсэг бөгөөд таны ашигладаг
              технологи болон багажуудыг харуулна.
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
