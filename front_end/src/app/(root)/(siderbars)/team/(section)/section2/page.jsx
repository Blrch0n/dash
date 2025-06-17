"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { TbNotebook } from "react-icons/tb";
import { AiFillLike } from "react-icons/ai";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaAws,
  FaDatabase,
} from "react-icons/fa";
import { SiMongodb, SiGraphql, SiTypescript } from "react-icons/si";

// Default section2 data structure
const defaultSection2Data = {
  title: "Our Technology Stack",
  subtitle: "Our Concept",
  description:
    "Cutting-edge tools and technologies we use to deliver exceptional results and build modern applications",
  backgroundImage:
    "https://images.unsplash.com/photo-1565945985125-a59c660a9932?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
  projects: [
    {
      id: 1,
      title: "Parallax Section",
      description:
        "This is how we can be sure that your brand expands according to market goals and continues to be attractive in the future",
      iconType: "notebook",
    },
    {
      id: 2,
      title: "Responsive Design",
      description:
        "It is fundamental to have a strategy that takes into consideration the features that are important to the client",
      iconType: "like",
    },
    {
      id: 3,
      title: "React Development",
      description:
        "Building modern user interfaces with React.js for optimal performance and user experience",
      iconType: "react",
    },
    {
      id: 4,
      title: "Node.js Backend",
      description:
        "Scalable server-side applications using Node.js runtime environment",
      iconType: "nodejs",
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

// Icon mapping function
const getIconComponent = (iconType) => {
  const iconMap = {
    notebook: (
      <TbNotebook className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    like: (
      <AiFillLike className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    react: (
      <FaReact className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    nodejs: (
      <FaNodeJs className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    docker: (
      <FaDocker className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    git: (
      <FaGitAlt className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    aws: <FaAws className="text-4xl group-hover:text-black text-[#6d83ff]" />,
    database: (
      <FaDatabase className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    mongodb: (
      <SiMongodb className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    graphql: (
      <SiGraphql className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
    typescript: (
      <SiTypescript className="text-4xl group-hover:text-black text-[#6d83ff]" />
    ),
  };
  return iconMap[iconType] || iconMap.notebook;
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
        It looks like the team section2 data doesn't exist in the database.
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
    <div
      className="w-full min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-[100px] lg:flex-row items-center justify-between bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${section2Data?.backgroundImage})` }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-[#00000080] bg-opacity-30"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full lg:w-[45%] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
        {/* Main Content Card */}
        <div className="w-full rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-300">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-[#b8b8b8] font-semibold text-sm sm:text-[16px] uppercase tracking-wider mb-2">
              {section2Data?.subtitle || "Our Concept"}
            </h3>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
              {section2Data?.title || "Our Technology Stack"}
            </h2>
            <span
              className="block h-1.5 w-16 rounded-full mb-4 sm:mb-6"
              style={{
                background: `linear-gradient(135deg, ${colors.primaryColor} 0%, ${colors.accentColor} 100%)`,
              }}
            ></span>
            <p className="text-[#ffffff] text-sm sm:text-base lg:text-lg leading-relaxed">
              {section2Data?.description ||
                "Cutting-edge tools and technologies"}
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 my-6 sm:my-8" />

          {/* Technologies Grid */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
            } mt-8 gap-6 sm:gap-8`}
          >
            {(section2Data?.projects || [])
              .slice(0, isMobile ? 4 : 8)
              .map((data, index) => (
                <div
                  className="flex flex-col space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl transition-all duration-500 group"
                  key={data.id}
                >
                  <div
                    className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-transparent border rounded-xl hover:border-white hover:bg-white transition-colors duration-300"
                    style={{ borderColor: colors.primaryColor }}
                  >
                    {getIconComponent(data.iconType)}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white transition-colors duration-300">
                    {data.title}
                  </h3>
                  <p className="text-[#b8b8b8] text-sm sm:text-[16px] leading-relaxed">
                    {data.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Image Container - Hidden on mobile, visible on lg+ screens */}
      <div className="hidden lg:flex relative z-10 w-[50%] flex-col items-center justify-center p-6 lg:p-12">
        <div className="relative group w-full">
          <img
            src="https://max-themes.net/demos/enside/main/upload/images-ipad-phone.png"
            alt="Technology Stack Mockup"
            className="w-full h-auto drop-shadow-2xl transform transition-all duration-500 filter"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
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
  const iconOptions = [
    { value: "notebook", label: "Notebook" },
    { value: "like", label: "Like" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "docker", label: "Docker" },
    { value: "git", label: "Git" },
    { value: "aws", label: "AWS" },
    { value: "database", label: "Database" },
    { value: "mongodb", label: "MongoDB" },
    { value: "graphql", label: "GraphQL" },
    { value: "typescript", label: "TypeScript" },
  ];

  const handleTitleChange = (field, value) => {
    onDataChange({
      ...section2Data,
      [field]: value,
    });
  };

  const handleProjectChange = (index, field, value) => {
    onDataChange({
      ...section2Data,
      projects: (section2Data.projects || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const addNewProject = () => {
    const newProject = {
      id: Date.now(),
      title: "New Technology",
      description: "Description of the new technology",
      iconType: "notebook",
    };

    onDataChange({
      ...section2Data,
      projects: [...(section2Data.projects || []), newProject],
    });
  };

  const removeProject = (index) => {
    onDataChange({
      ...section2Data,
      projects: (section2Data.projects || []).filter((_, i) => i !== index),
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
        <input
          type="text"
          value={section2Data?.subtitle || ""}
          onChange={(e) => handleTitleChange("subtitle", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          placeholder="Section subtitle"
        />
        <textarea
          value={section2Data?.description || ""}
          onChange={(e) => handleTitleChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
          rows="3"
          placeholder="Section description"
        />
        <input
          type="text"
          value={section2Data?.backgroundImage || ""}
          onChange={(e) => handleTitleChange("backgroundImage", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Background image URL"
        />
      </div>

      {/* Technologies Section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Technologies ({section2Data?.projects?.length || 0})
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
          {(section2Data?.projects || []).map((project, index) => (
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
                value={project.description || ""}
                onChange={(e) =>
                  handleProjectChange(index, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                rows="3"
                placeholder="Technology description"
              />
              <select
                value={project.iconType || "notebook"}
                onChange={(e) =>
                  handleProjectChange(index, "iconType", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Icon Preview */}
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-xs text-gray-500">Icon Preview:</span>
                <div className="flex items-center justify-center w-8 h-8 border rounded">
                  {getIconComponent(project.iconType)}
                </div>
              </div>
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
      <p>• Section: team/section2</p>
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
        sectionName: "team",
        subsectionName: "section2",
        title: "Team Concept",
        content: "Team section 2 content",
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

      console.log("🔍 Loading team section2 data...");
      const result = await api.getSubsection("team", "section2");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection2Data(result.data.data);
        toast.success("Section2 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No team section2 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading team section2 data:", error);
      setError("Failed to load team section2 data");
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
        sectionName: "team",
        subsectionName: "section2",
        title: "Team Concept",
        content: "Team section 2 content",
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
      console.error("Error saving team section2 data:", error);
      setError("Failed to save team section2 data");
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
      <LoadingScreen message="Loading team section2 data from backend..." />
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
              Team Concept
            </label>
            <p className="text-xs text-gray-500">
              Section 2 нь Team Concept хэсэг бөгөөд таны ашигладаг технологи
              болон концепцыг харуулна.
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
