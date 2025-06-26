"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { IoUmbrellaOutline } from "react-icons/io5";
import { PiLego } from "react-icons/pi";
import { TbHammer } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { RiToolsFill } from "react-icons/ri";

// Default section1 data structure
const defaultSection1Data = {
  title: "Capabilities",
  subtitle: "Taking care of the new products's launch and user support",
  categories: ["Prototypes", "Development", "Support", "Design"],
  mainText: "All you need is Enside, a modern & simple template",
  description:
    "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  layoutSettings: {
    desktop: {
      categoriesPerRow: 4,
      statisticsPerRow: 3,
    },
    mobile: {
      categoriesPerRow: 2,
      statisticsPerRow: 1,
    },
  },
  statistics: {
    mainTitle: "We create human experience in a digital world",
    stats: [
      {
        number: "97",
        label:
          "Percent of users recommend us recommend us to friends and family",
      },
      {
        number: "350",
        label: "Companies have shifted to using us recently",
      },
      {
        number: "35",
        label: "We deliver so much more than the competition",
      },
    ],
  },
  sections: {
    Prototypes: {
      leftContent: {
        title: "All you need is Enside, a modern & simple template",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      rightContent: [
        {
          icon: "IoUmbrellaOutline",
          title: "We bring the brand to life",
          subtitle: "We only hire great people who strike to push their idea",
          backgroundImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        },
        {
          icon: "PiLego",
          title: "Build Your Dream",
          subtitle: "We only hire great people who strike to push their idea",
          backgroundImage:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
        },
      ],
    },
    Development: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: "TbHammer",
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "PiStudent",
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "FaRegUserCircle",
          title: "Great Service",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "RiToolsFill",
          title: "Fast Support",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
    },
    Support: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: "TbHammer",
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "PiStudent",
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "FaRegUserCircle",
          title: "Great Service",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "RiToolsFill",
          title: "Fast Support",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
    },
    Design: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: "TbHammer",
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: "PiStudent",
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
      rightCard: {
        icon: "PiLego",
        title: "We bring the brand to life",
        subtitle: "We only hire great people who strike to push their idea",
        backgroundImage:
          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      },
    },
  },
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

// Icon mapping helper
const getIconComponent = (iconName) => {
  const iconMap = {
    IoUmbrellaOutline: <IoUmbrellaOutline />,
    PiLego: <PiLego />,
    TbHammer: <TbHammer />,
    PiStudent: <PiStudent />,
    FaRegUserCircle: <FaRegUserCircle />,
    RiToolsFill: <RiToolsFill />,
  };
  return iconMap[iconName] || <IoUmbrellaOutline />;
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
        It looks like the services section1 data doesn't exist in the database.
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
const PreviewComponent = ({
  section1Data,
  colors,
  isMobile,
  activeTab,
  setActiveTab,
}) => {
  const currentLayout =
    section1Data.layoutSettings[isMobile ? "mobile" : "desktop"];

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{
        backgroundColor: colors.backgroundColor,
        borderColor: colors.borderColor,
      }}
    >
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-8 min-h-[800px]">
        {/* Header */}
        <div className="text-center mb-12 opacity-100">
          <p className="text-gray-500 text-sm uppercase mb-2">TECHNOLOGY</p>
          <h1
            className="text-5xl font-bold mb-4"
            style={{ color: colors.textColor }}
          >
            {section1Data.title}
          </h1>
          <div
            className="w-9 h-1 mx-auto mb-4 rounded-full"
            style={{
              background: `linear-gradient(to right, ${colors.primaryColor}, ${colors.accentColor})`,
            }}
          ></div>
          <p
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: `${colors.textColor}CC` }}
          >
            {section1Data.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div
            className="grid gap-2 p-4 bg-white rounded-lg shadow-md"
            style={{
              gridTemplateColumns: `repeat(${currentLayout.categoriesPerRow}, minmax(0, 1fr))`,
            }}
          >
            {section1Data.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`border py-3 px-4 min-w-[120px] rounded-lg text-sm font-medium transition-all duration-200 ease-in-out`}
                style={{
                  backgroundColor:
                    activeTab === category
                      ? colors.primaryColor
                      : "transparent",
                  color: activeTab === category ? "#FFFFFF" : colors.textColor,
                  borderColor:
                    activeTab === category
                      ? colors.primaryColor
                      : colors.borderColor,
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="opacity-100 transform translate-y-0">
          {activeTab === "Prototypes" && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-2/5"
                } flex flex-col gap-6`}
              >
                <h2
                  className="text-3xl font-bold"
                  style={{ color: colors.textColor }}
                >
                  {section1Data.sections.Prototypes.leftContent.title}
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: `${colors.textColor}CC` }}
                >
                  {section1Data.sections.Prototypes.leftContent.description}
                </p>
              </div>

              {/* Right Cards */}
              <div
                className={`${isMobile ? "w-full" : "w-3/5"} flex ${
                  isMobile ? "flex-col" : "flex-row"
                } gap-6`}
              >
                {section1Data.sections.Prototypes.rightContent.map(
                  (card, index) => (
                    <div
                      key={index}
                      className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${card.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-[#00000080] bg-opacity-50"></div>
                      <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center text-white">
                        <div className="text-4xl mb-4">
                          {getIconComponent(card.icon)}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-sm">{card.subtitle}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {(activeTab === "Development" || activeTab === "Support") && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-2/5"
                } flex flex-col gap-6`}
              >
                <h2
                  className="text-3xl font-bold"
                  style={{ color: colors.textColor }}
                >
                  {section1Data.sections[activeTab].leftContent.title}
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: `${colors.textColor}CC` }}
                >
                  {section1Data.sections[activeTab].leftContent.description}
                </p>
              </div>

              {/* Right Services Grid */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-3/5"
                } grid grid-cols-1 sm:grid-cols-2 gap-6`}
              >
                {section1Data.sections[activeTab].services.map(
                  (service, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div
                        className="text-2xl hover:scale-110 transition-transform duration-200"
                        style={{ color: colors.primaryColor }}
                      >
                        {getIconComponent(service.icon)}
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold mb-2"
                          style={{ color: colors.textColor }}
                        >
                          {service.title}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: `${colors.textColor}CC` }}
                        >
                          {service.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "Design" && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-1/3"
                } flex flex-col gap-6`}
              >
                <h2
                  className="text-3xl font-bold"
                  style={{ color: colors.textColor }}
                >
                  {section1Data.sections.Design.leftContent.title}
                </h2>
                <p
                  className="leading-relaxed"
                  style={{ color: `${colors.textColor}CC` }}
                >
                  {section1Data.sections.Design.leftContent.description}
                </p>
              </div>

              {/* Middle Services */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-1/3"
                } flex flex-col gap-6`}
              >
                {section1Data.sections.Design.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div
                      className="text-2xl hover:scale-110 transition-transform duration-200"
                      style={{ color: colors.primaryColor }}
                    >
                      {getIconComponent(service.icon)}
                    </div>
                    <div>
                      <h3
                        className="text-lg font-semibold mb-2"
                        style={{ color: colors.textColor }}
                      >
                        {service.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: `${colors.textColor}CC` }}
                      >
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Card */}
              <div className={`${isMobile ? "w-full" : "w-1/3"}`}>
                <div
                  className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${section1Data.sections.Design.rightCard.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-[#00000070] bg-opacity-50"></div>
                  <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center text-white">
                    <div className="text-4xl mb-4">
                      {getIconComponent(
                        section1Data.sections.Design.rightCard.icon
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {section1Data.sections.Design.rightCard.title}
                    </h3>
                    <p className="text-sm">
                      {section1Data.sections.Design.rightCard.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`${
                isMobile ? "text-2xl" : "text-3xl"
              } font-bold text-center mb-12`}
              style={{ color: colors.textColor }}
            >
              {section1Data.statistics.mainTitle}
            </h2>
            <div
              className="grid gap-8"
              style={{
                gridTemplateColumns: `repeat(${currentLayout.statisticsPerRow}, minmax(0, 1fr))`,
              }}
            >
              {section1Data.statistics.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className={`${
                      isMobile ? "text-4xl" : "text-5xl"
                    } font-bold mb-4`}
                    style={{ color: colors.primaryColor }}
                  >
                    {stat.number}
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-base"
                    } leading-relaxed`}
                    style={{ color: `${colors.textColor}CC` }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
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

// Storage Info Component
const StorageInfo = ({ isSaving }) => (
  <div className="mt-4 p-3 bg-gray-100 rounded-lg">
    <h4 className="text-xs font-medium text-gray-700 mb-2">Storage Info</h4>
    <div className="text-xs text-gray-600 space-y-1">
      <p>• Backend: MongoDB Atlas</p>
      <p>• Section: services/section1</p>
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
  const [activeTab, setActiveTab] = useState("Prototypes");
  const router = useRouter();

  // Create section1 data with defaults
  const createSection1Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section1 data...", { id: "creating" });

      const result = await api.saveSection({
        sectionName: "services",
        subsectionName: "section1",
        title: "Services Overview",
        content: "Services section 1 content",
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

      console.log("🔍 Loading services section1 data...");
      const result = await api.getSubsection("services", "section1");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection1Data(result.data.data);
        toast.success("Section1 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No services section1 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading services section1 data:", error);
      setError("Failed to load services section1 data");
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
        sectionName: "services",
        subsectionName: "section1",
        title: "Services Overview",
        content: "Services section 1 content",
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
      console.error("Error saving services section1 data:", error);
      setError("Failed to save services section1 data");
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

  const handleTitleChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLayoutChange = (setting, value) => {
    setSection1Data((prev) => ({
      ...prev,
      layoutSettings: {
        ...prev.layoutSettings,
        [viewMode]: {
          ...prev.layoutSettings[viewMode],
          [setting]: parseInt(value),
        },
      },
    }));
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
      <LoadingScreen message="Loading services section1 data from backend..." />
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
                activeTab={activeTab}
                setActiveTab={setActiveTab}
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
              Services Overview
            </label>
            <p className="text-xs text-gray-500">
              Section 1 нь Services Overview хэсэг бөгөөд таны үйлчилгээний
              төрлүүдийг харуулна.
            </p>
          </div>

          <div className="space-y-6">
            {/* View Mode Indicator */}
            <div className="bg-gray-100 p-2 rounded-md">
              <p className="text-sm text-gray-600">
                Editing for:{" "}
                <span className="font-medium capitalize">{viewMode}</span> View
              </p>
            </div>

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
              <textarea
                value={section1Data?.subtitle || ""}
                onChange={(e) => handleTitleChange("subtitle", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Section subtitle"
              />
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Categories
              </h3>
              <input
                type="text"
                value={section1Data?.categories?.join(", ") || ""}
                onChange={(e) => {
                  const categories = e.target.value
                    .split(",")
                    .map((cat) => cat.trim())
                    .filter((cat) => cat);
                  handleTitleChange("categories", categories);
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Categories (comma separated)"
              />
            </div>

            {/* Layout Configuration */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Layout Settings ({viewMode})
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Categories per row:
                  </label>
                  <select
                    value={
                      section1Data?.layoutSettings?.[viewMode]
                        ?.categoriesPerRow || 4
                    }
                    onChange={(e) =>
                      handleLayoutChange("categoriesPerRow", e.target.value)
                    }
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 column</option>
                    <option value={2}>2 columns</option>
                    <option value={3}>3 columns</option>
                    <option value={4}>4 columns</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Statistics per row:
                  </label>
                  <select
                    value={
                      section1Data?.layoutSettings?.[viewMode]
                        ?.statisticsPerRow || 3
                    }
                    onChange={(e) =>
                      handleLayoutChange("statisticsPerRow", e.target.value)
                    }
                    className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 column</option>
                    <option value={2}>2 columns</option>
                    <option value={3}>3 columns</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Statistics Section Editor */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Statistics Section
              </h3>
              <input
                type="text"
                value={section1Data?.statistics?.mainTitle || ""}
                onChange={(e) => {
                  setSection1Data((prev) => ({
                    ...prev,
                    statistics: {
                      ...prev.statistics,
                      mainTitle: e.target.value,
                    },
                  }));
                }}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
                placeholder="Statistics main title"
              />

              {section1Data?.statistics?.stats?.map((stat, index) => (
                <div
                  key={index}
                  className="space-y-2 mb-4 p-3 bg-gray-50 rounded-md"
                >
                  <label className="text-xs text-gray-600">
                    Statistic {index + 1}
                  </label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => {
                      setSection1Data((prev) => ({
                        ...prev,
                        statistics: {
                          ...prev.statistics,
                          stats: prev.statistics.stats.map((s, i) =>
                            i === index ? { ...s, number: e.target.value } : s
                          ),
                        },
                      }));
                    }}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number"
                  />
                  <textarea
                    value={stat.label}
                    onChange={(e) => {
                      setSection1Data((prev) => ({
                        ...prev,
                        statistics: {
                          ...prev.statistics,
                          stats: prev.statistics.stats.map((s, i) =>
                            i === index ? { ...s, label: e.target.value } : s
                          ),
                        },
                      }));
                    }}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Description"
                  />
                </div>
              ))}
            </div>

            {/* Active Tab Content Editor */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                {activeTab} Tab Content
              </h3>

              {/* Left Content Editor */}
              {section1Data?.sections?.[activeTab]?.leftContent && (
                <div className="space-y-3 mb-4">
                  <h4 className="text-xs font-medium text-gray-600">
                    Left Content
                  </h4>
                  <input
                    type="text"
                    value={
                      section1Data.sections[activeTab].leftContent.title || ""
                    }
                    onChange={(e) => {
                      setSection1Data((prev) => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          [activeTab]: {
                            ...prev.sections[activeTab],
                            leftContent: {
                              ...prev.sections[activeTab].leftContent,
                              title: e.target.value,
                            },
                          },
                        },
                      }));
                    }}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Left section title"
                  />
                  <textarea
                    value={
                      section1Data.sections[activeTab].leftContent
                        .description || ""
                    }
                    onChange={(e) => {
                      setSection1Data((prev) => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          [activeTab]: {
                            ...prev.sections[activeTab],
                            leftContent: {
                              ...prev.sections[activeTab].leftContent,
                              description: e.target.value,
                            },
                          },
                        },
                      }));
                    }}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Left section description"
                  />
                </div>
              )}

              {/* Tab-specific content editors */}
              {activeTab === "Prototypes" &&
                section1Data?.sections?.Prototypes?.rightContent && (
                  <div className="space-y-4 mb-4">
                    <h4 className="text-xs font-medium text-gray-600">
                      Right Content Cards
                    </h4>
                    {section1Data.sections.Prototypes.rightContent.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-md space-y-2"
                        >
                          <label className="text-xs text-gray-600">
                            Card {index + 1}
                          </label>
                          <select
                            value={item.icon}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Prototypes: {
                                    ...prev.sections.Prototypes,
                                    rightContent:
                                      prev.sections.Prototypes.rightContent.map(
                                        (c, i) =>
                                          i === index
                                            ? { ...c, icon: e.target.value }
                                            : c
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="IoUmbrellaOutline">Umbrella</option>
                            <option value="PiLego">Lego</option>
                            <option value="TbHammer">Hammer</option>
                            <option value="PiStudent">Student</option>
                            <option value="FaRegUserCircle">User Circle</option>
                            <option value="RiToolsFill">Tools</option>
                          </select>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Prototypes: {
                                    ...prev.sections.Prototypes,
                                    rightContent:
                                      prev.sections.Prototypes.rightContent.map(
                                        (c, i) =>
                                          i === index
                                            ? { ...c, title: e.target.value }
                                            : c
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Card title"
                          />
                          <input
                            type="text"
                            value={item.subtitle}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Prototypes: {
                                    ...prev.sections.Prototypes,
                                    rightContent:
                                      prev.sections.Prototypes.rightContent.map(
                                        (c, i) =>
                                          i === index
                                            ? { ...c, subtitle: e.target.value }
                                            : c
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Card subtitle"
                          />
                          <input
                            type="url"
                            value={item.backgroundImage}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Prototypes: {
                                    ...prev.sections.Prototypes,
                                    rightContent:
                                      prev.sections.Prototypes.rightContent.map(
                                        (c, i) =>
                                          i === index
                                            ? {
                                                ...c,
                                                backgroundImage: e.target.value,
                                              }
                                            : c
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Background image URL"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

              {activeTab === "Development" &&
                section1Data?.sections?.Development?.services && (
                  <div className="space-y-4 mb-4">
                    <h4 className="text-xs font-medium text-gray-600">
                      Services
                    </h4>
                    {section1Data.sections.Development.services.map(
                      (service, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-md space-y-2"
                        >
                          <label className="text-xs text-gray-600">
                            Service {index + 1}
                          </label>
                          <select
                            value={service.icon}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Development: {
                                    ...prev.sections.Development,
                                    services:
                                      prev.sections.Development.services.map(
                                        (s, i) =>
                                          i === index
                                            ? { ...s, icon: e.target.value }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="TbHammer">Hammer</option>
                            <option value="PiStudent">Student</option>
                            <option value="FaRegUserCircle">User Circle</option>
                            <option value="RiToolsFill">Tools</option>
                            <option value="IoUmbrellaOutline">Umbrella</option>
                            <option value="PiLego">Lego</option>
                          </select>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Development: {
                                    ...prev.sections.Development,
                                    services:
                                      prev.sections.Development.services.map(
                                        (s, i) =>
                                          i === index
                                            ? { ...s, title: e.target.value }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Service title"
                          />
                          <textarea
                            value={service.description}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Development: {
                                    ...prev.sections.Development,
                                    services:
                                      prev.sections.Development.services.map(
                                        (s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                description: e.target.value,
                                              }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                            placeholder="Service description"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

              {activeTab === "Design" && section1Data?.sections?.Design && (
                <>
                  {/* Services for Design tab */}
                  {section1Data.sections.Design.services && (
                    <div className="space-y-4 mb-4">
                      <h4 className="text-xs font-medium text-gray-600">
                        Services
                      </h4>
                      {section1Data.sections.Design.services.map(
                        (service, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-md space-y-2"
                          >
                            <label className="text-xs text-gray-600">
                              Service {index + 1}
                            </label>
                            <select
                              value={service.icon}
                              onChange={(e) => {
                                setSection1Data((prev) => ({
                                  ...prev,
                                  sections: {
                                    ...prev.sections,
                                    Design: {
                                      ...prev.sections.Design,
                                      services:
                                        prev.sections.Design.services.map(
                                          (s, i) =>
                                            i === index
                                              ? { ...s, icon: e.target.value }
                                              : s
                                        ),
                                    },
                                  },
                                }));
                              }}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="TbHammer">Hammer</option>
                              <option value="PiStudent">Student</option>
                              <option value="FaRegUserCircle">
                                User Circle
                              </option>
                              <option value="RiToolsFill">Tools</option>
                              <option value="IoUmbrellaOutline">
                                Umbrella
                              </option>
                              <option value="PiLego">Lego</option>
                            </select>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => {
                                setSection1Data((prev) => ({
                                  ...prev,
                                  sections: {
                                    ...prev.sections,
                                    Design: {
                                      ...prev.sections.Design,
                                      services:
                                        prev.sections.Design.services.map(
                                          (s, i) =>
                                            i === index
                                              ? { ...s, title: e.target.value }
                                              : s
                                        ),
                                    },
                                  },
                                }));
                              }}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Service title"
                            />
                            <textarea
                              value={service.description}
                              onChange={(e) => {
                                setSection1Data((prev) => ({
                                  ...prev,
                                  sections: {
                                    ...prev.sections,
                                    Design: {
                                      ...prev.sections.Design,
                                      services:
                                        prev.sections.Design.services.map(
                                          (s, i) =>
                                            i === index
                                              ? {
                                                  ...s,
                                                  description: e.target.value,
                                                }
                                              : s
                                        ),
                                    },
                                  },
                                }));
                              }}
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="2"
                              placeholder="Service description"
                            />
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Right Card for Design tab */}
                  {section1Data.sections.Design.rightCard && (
                    <div className="space-y-3 mb-4">
                      <h4 className="text-xs font-medium text-gray-600">
                        Right Card
                      </h4>
                      <div className="p-3 bg-gray-50 rounded-md space-y-2">
                        <select
                          value={
                            section1Data?.sections?.Design?.rightCard?.icon ||
                            "PiLego"
                          }
                          onChange={(e) => {
                            setSection1Data((prev) => ({
                              ...prev,
                              sections: {
                                ...prev.sections,
                                Design: {
                                  ...prev.sections.Design,
                                  rightCard: {
                                    ...prev.sections.Design.rightCard,
                                    icon: e.target.value,
                                  },
                                },
                              },
                            }));
                          }}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="IoUmbrellaOutline">Umbrella</option>
                          <option value="PiLego">Lego</option>
                          <option value="TbHammer">Hammer</option>
                          <option value="PiStudent">Student</option>
                          <option value="FaRegUserCircle">User Circle</option>
                          <option value="RiToolsFill">Tools</option>
                        </select>
                        <input
                          type="text"
                          value={
                            section1Data?.sections?.Design?.rightCard?.title ||
                            ""
                          }
                          onChange={(e) => {
                            setSection1Data((prev) => ({
                              ...prev,
                              sections: {
                                ...prev.sections,
                                Design: {
                                  ...prev.sections.Design,
                                  rightCard: {
                                    ...prev.sections.Design.rightCard,
                                    title: e.target.value,
                                  },
                                },
                              },
                            }));
                          }}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Card title"
                        />
                        <input
                          type="text"
                          value={
                            section1Data?.sections?.Design?.rightCard
                              ?.subtitle || ""
                          }
                          onChange={(e) => {
                            setSection1Data((prev) => ({
                              ...prev,
                              sections: {
                                ...prev.sections,
                                Design: {
                                  ...prev.sections.Design,
                                  rightCard: {
                                    ...prev.sections.Design.rightCard,
                                    subtitle: e.target.value,
                                  },
                                },
                              },
                            }));
                          }}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Card subtitle"
                        />
                        <input
                          type="url"
                          value={
                            section1Data?.sections?.Design?.rightCard
                              ?.backgroundImage || ""
                          }
                          onChange={(e) => {
                            setSection1Data((prev) => ({
                              ...prev,
                              sections: {
                                ...prev.sections,
                                Design: {
                                  ...prev.sections.Design,
                                  rightCard: {
                                    ...prev.sections.Design.rightCard,
                                    backgroundImage: e.target.value,
                                  },
                                },
                              },
                            }));
                          }}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Background image URL"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Support tab editor */}
              {activeTab === "Support" &&
                section1Data?.sections?.Support?.services && (
                  <div className="space-y-4 mb-4">
                    <h4 className="text-xs font-medium text-gray-600">
                      Services
                    </h4>
                    {section1Data.sections.Support.services.map(
                      (service, index) => (
                        <div
                          key={index}
                          className="p-3 bg-gray-50 rounded-md space-y-2"
                        >
                          <label className="text-xs text-gray-600">
                            Service {index + 1}
                          </label>
                          <select
                            value={service.icon}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Support: {
                                    ...prev.sections.Support,
                                    services:
                                      prev.sections.Support.services.map(
                                        (s, i) =>
                                          i === index
                                            ? { ...s, icon: e.target.value }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="TbHammer">Hammer</option>
                            <option value="PiStudent">Student</option>
                            <option value="FaRegUserCircle">User Circle</option>
                            <option value="RiToolsFill">Tools</option>
                            <option value="IoUmbrellaOutline">Umbrella</option>
                            <option value="PiLego">Lego</option>
                          </select>
                          <input
                            type="text"
                            value={service.title}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Support: {
                                    ...prev.sections.Support,
                                    services:
                                      prev.sections.Support.services.map(
                                        (s, i) =>
                                          i === index
                                            ? { ...s, title: e.target.value }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Service title"
                          />
                          <textarea
                            value={service.description}
                            onChange={(e) => {
                              setSection1Data((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  Support: {
                                    ...prev.sections.Support,
                                    services:
                                      prev.sections.Support.services.map(
                                        (s, i) =>
                                          i === index
                                            ? {
                                                ...s,
                                                description: e.target.value,
                                              }
                                            : s
                                      ),
                                  },
                                },
                              }));
                            }}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                            placeholder="Service description"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}

              {/* Main Text Editor (global) */}
              <div className="space-y-3 mb-4">
                <h4 className="text-xs font-medium text-gray-600">
                  Main Text & Description
                </h4>
                <input
                  type="text"
                  value={section1Data?.mainText || ""}
                  onChange={(e) => {
                    setSection1Data((prev) => ({
                      ...prev,
                      mainText: e.target.value,
                    }));
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Main text"
                />
                <textarea
                  value={section1Data?.description || ""}
                  onChange={(e) => {
                    setSection1Data((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Main description"
                />
              </div>

              {/* Responsive Layout Info */}
              <div className="bg-blue-50 p-3 rounded-md mb-4">
                <p className="text-xs text-blue-700">
                  <strong>Current Layout ({viewMode}):</strong>
                  <br />
                  Categories:{" "}
                  {section1Data?.layoutSettings?.[viewMode]?.categoriesPerRow ||
                    4}{" "}
                  per row
                  <br />
                  Statistics:{" "}
                  {section1Data?.layoutSettings?.[viewMode]?.statisticsPerRow ||
                    3}{" "}
                  per row
                  <br />
                  {viewMode === "mobile"
                    ? "Content stacked vertically for mobile view"
                    : activeTab === "Design"
                    ? "Three column layout (Left content | Services | Right card)"
                    : "Two column layout (Left content | Right content)"}
                </p>
              </div>
            </div>

            {/* Color Settings */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Color Settings
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Primary Color:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section1Data?.colors?.primaryColor || "#3B82F6"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            primaryColor: e.target.value,
                          },
                        }));
                      }}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={section1Data?.colors?.primaryColor || "#3B82F6"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            primaryColor: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Secondary Color:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section1Data?.colors?.secondaryColor || "#1E40AF"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            secondaryColor: e.target.value,
                          },
                        }));
                      }}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={section1Data?.colors?.secondaryColor || "#1E40AF"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            secondaryColor: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#1E40AF"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Text Color:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section1Data?.colors?.textColor || "#1F2937"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            textColor: e.target.value,
                          },
                        }));
                      }}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={section1Data?.colors?.textColor || "#1F2937"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            textColor: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#1F2937"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Background Color:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={section1Data?.colors?.backgroundColor || "#FFFFFF"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            backgroundColor: e.target.value,
                          },
                        }));
                      }}
                      className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={section1Data?.colors?.backgroundColor || "#FFFFFF"}
                      onChange={(e) => {
                        setSection1Data((prev) => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            backgroundColor: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

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
