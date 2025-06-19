"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../services/api";

// Default configuration
const DEFAULT_CONFIG = {
  labels: [
    "Нүүр хуудас",
    "Тухай",
    "Үйлчилгээ",
    "Холбоо барих",
    "Блог",
    "Тусламж",
  ],
  image: null,
  primaryColor: "#3B82F6",
  accentColor: "#EF4444",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
};

// Loading Component
const LoadingScreen = ({ message = "Loading..." }) => (
  <div className="w-full h-full flex flex-col lg:flex-row gap-4 md:gap-5 bg-gray-50 p-4 md:p-5">
    <div className="h-64 lg:h-full w-full lg:w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
    <div className="h-64 lg:h-full w-full lg:w-[30%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse bg-gray-300 h-4 w-20 rounded mx-auto mb-2"></div>
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorScreen = ({ error, onRetry }) => (
  <div className="w-full h-full flex flex-col lg:flex-row gap-4 md:gap-5 bg-gray-50 p-4 md:p-5">
    <div className="h-64 lg:h-full w-full lg:w-[70%] bg-white rounded-lg p-4 md:p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="text-red-600 font-medium">Error: {error}</div>
      </div>
    </div>
    <div className="h-64 lg:h-full w-full lg:w-[30%] bg-white rounded-lg p-4 md:p-6">
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
      >
        Retry Loading
      </button>
    </div>
  </div>
);

// Navigation Component
const Navigation = ({
  labels,
  activeSection,
  onSectionClick,
  colors,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <ul className="flex flex-col py-2">
        {labels.map((label, index) => {
          const isActive = activeSection === label;
          return (
            <li
              key={index}
              onClick={() => onSectionClick(label)}
              className="cursor-pointer px-6 py-4 text-sm font-semibold border-l-4 transition-all duration-300"
              style={{
                color: isActive ? colors.accentColor : colors.textColor,
                borderLeftColor: isActive ? colors.accentColor : "transparent",
                backgroundColor: isActive
                  ? `${colors.primaryColor}20`
                  : "transparent",
              }}
            >
              {label.toUpperCase()}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex items-center justify-center gap-6 text-sm font-semibold">
      {labels.map((label, index) => {
        const isActive = activeSection === label;
        return (
          <li
            key={index}
            onClick={() => onSectionClick(label)}
            className="cursor-pointer transition-all duration-200 relative group"
            style={{
              color: isActive ? colors.accentColor : colors.textColor,
            }}
          >
            {label.toUpperCase()}
            <div
              className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
              style={{ backgroundColor: colors.accentColor }}
            />
          </li>
        );
      })}
    </ul>
  );
};

// Logo Component
const Logo = ({ image, onLogoClick, colors, isMobile = false }) => {
  const size = isMobile
    ? { width: "120px", height: "30px" }
    : { width: "140px", height: "36px" };

  if (image) {
    return (
      <img
        className="cursor-pointer transition-all duration-300"
        src={image}
        onClick={onLogoClick}
        alt="Logo"
        style={{ objectFit: "contain", ...size }}
      />
    );
  }

  return (
    <div
      className="cursor-pointer transition-all duration-300 border-2 border-dashed rounded-lg flex items-center justify-center"
      onClick={onLogoClick}
      style={{
        borderColor: `${colors.textColor}80`,
        color: `${colors.textColor}B3`,
        ...size,
      }}
    >
      <span className="text-xs">Logo</span>
    </div>
  );
};

// Header Preview Component
const HeaderPreview = ({
  config,
  isMobile,
  activeSection,
  onSectionClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => (
  <div
    className={`border rounded-lg overflow-hidden shadow-lg ${
      isMobile ? "w-80 mx-auto" : "w-full"
    }`}
    style={{
      backgroundColor: config.backgroundColor,
      borderColor: "#E5E7EB",
    }}
  >
    {/* Header Section */}
    <section
      className="w-full h-fit relative flex items-center justify-center"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className="w-full h-fit flex items-center justify-between px-4 py-3 relative z-10">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo
            image={config.image}
            onLogoClick={() => onSectionClick("home")}
            colors={config}
            isMobile={isMobile}
          />
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Navigation
            labels={config.labels}
            activeSection={activeSection}
            onSectionClick={onSectionClick}
            colors={config}
          />
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            className="p-2 transition-all duration-300 hover:bg-black/10 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: config.textColor }}
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <IoMdMenu
                size={24}
                className={`absolute transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-0 rotate-90"
                    : "opacity-100 rotate-0"
                }`}
              />
              <IoClose
                size={24}
                className={`absolute transition-all duration-300 ${
                  isMobileMenuOpen
                    ? "opacity-100 rotate-0"
                    : "opacity-0 -rotate-90"
                }`}
              />
            </div>
          </button>
        )}

        {/* Mobile Navigation */}
        {isMobile && (
          <div
            className={`absolute top-full left-0 right-0 transition-all duration-300 ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div
              className="backdrop-blur-md shadow-xl border-t rounded-b-lg mx-2"
              style={{ backgroundColor: config.backgroundColor }}
            >
              <Navigation
                labels={config.labels}
                activeSection={activeSection}
                onSectionClick={onSectionClick}
                colors={config}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Content Preview */}
    <div
      className="p-8 min-h-[400px]"
      style={{ backgroundColor: `${config.backgroundColor}F5` }}
    ></div>
  </div>
);

// Editor Panel Component
const EditorPanel = ({
  config,
  onConfigChange,
  onSave,
  isLoading,
  isSaving,
}) => (
  <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
    <h2 className="text-xl font-bold mb-4 text-gray-800">Header засварлах</h2>

    {/* Logo Upload */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Лого зураг
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            if (!file.type.startsWith("image/")) {
              toast.error("Зөвхөн зургийн файл сонгоно уу!");
              return;
            }
            if (file.size > 5 * 1024 * 1024) {
              toast.error("Зургийн хэмжээ 5MB-аас бага байх ёстой!");
              return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
              onConfigChange({ ...config, image: ev.target.result });
              toast.success("Зураг амжилттай байршуулагдлаа!");
            };
            reader.readAsDataURL(file);
          }
        }}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 bg-center file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Image Preview */}
      <div className="mt-2">
        {config.image ? (
          <div className="relative">
            <img
              src={config.image}
              alt="Logo Preview"
              className="w-full rounded bg-gray-100 border"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                height: "100px",
              }}
            />
            <button
              onClick={() => {
                onConfigChange({ ...config, image: null });
                toast.success("Зураг устгагдлаа!");
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className="w-full border-2 border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center text-gray-400"
            style={{ height: "50px" }}
          >
            <span className="text-sm">Зураг сонгоно уу</span>
          </div>
        )}
      </div>
    </div>

    {/* Navigation Labels */}
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Навигацийн цэсний нэрс
      </label>
      <div className="space-y-3">
        {config.labels.map((label, idx) => (
          <input
            key={idx}
            type="text"
            value={label}
            onChange={(e) => {
              const newLabels = [...config.labels];
              newLabels[idx] = e.target.value;
              onConfigChange({ ...config, labels: newLabels });
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Цэсний нэр ${idx + 1}`}
          />
        ))}
      </div>
    </div>

    {/* Color Preview */}
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Одоогийн өнгөний тохиргоо
      </h3>
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span>Primary:</span>
          <div
            className="w-6 h-4 rounded border"
            style={{ backgroundColor: config.primaryColor }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Accent:</span>
          <div
            className="w-6 h-4 rounded border"
            style={{ backgroundColor: config.accentColor }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span>Text:</span>
          <div
            className="w-6 h-4 rounded border"
            style={{ backgroundColor: config.textColor }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
      </p>
    </div>

    {/* Save Button */}
    <button
      onClick={onSave}
      disabled={isLoading || isSaving}
      className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium disabled:opacity-50"
      style={{ backgroundColor: config.primaryColor }}
    >
      {isSaving ? "Хадгалж байна..." : "Хадгалах"}
    </button>
  </div>
);

// Main Header Component
const HeaderPage = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  // Load data from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await api.getSubsection("header", "main");

      if (result.success && result.data) {
        const data = result.data.data || DEFAULT_CONFIG;
        setConfig({ ...DEFAULT_CONFIG, ...data });
        toast.success("Header мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        await saveData(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error("Error loading header data:", error);
      setError("Failed to load header data");
      toast.error("Header мэдээлэл ачаалахад алдаа гарлаа!");
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to backend
  const saveData = async (configToSave = config, showToast = false) => {
    try {
      if (showToast) {
        setIsSaving(true);
        toast.loading("Хадгалж байна...", { id: "saving" });
      }

      const result = await api.saveSection({
        sectionName: "header",
        subsectionName: "main",
        title: "Header Configuration",
        content: "Header section with navigation and logo",
        data: configToSave,
      });

      if (result.success) {
        console.log("Header data saved successfully");
        if (showToast) {
          toast.success("Header амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        setError("Failed to save header data");
        if (showToast) {
          toast.error("Хадгалахад алдаа гарлаа!", { id: "saving" });
        }
      }
    } catch (error) {
      console.error("Error saving header data:", error);
      setError("Failed to save header data");
      if (showToast) {
        toast.error("Хадгалахад алдаа гарлаа!", { id: "saving" });
      }
    } finally {
      if (showToast) {
        setIsSaving(false);
      }
    }
  };

  // Manual save with toast
  const handleManualSave = () => {
    saveData(config, true);
  };

  // Initialize component
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  // Auto-save with debounce (no toast for auto-save)
  useEffect(() => {
    if (!isClient || isLoading) return;

    const timeoutId = setTimeout(() => {
      saveData(config, false); // No toast for auto-save
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [config, isClient, isLoading]);

  // Handle section click
  const handleSectionClick = (sectionName) => {
    setActiveSection(sectionName);
    setIsMobileMenuOpen(false);
  };

  // Show loading screen
  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading header data from backend..." />;
  }

  // Show error screen
  if (error) {
    return <ErrorScreen error={error} onRetry={loadData} />;
  }

  return (
    <>
      {/* Toast Container */}
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
            style: {
              border: "1px solid #22c55e",
            },
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              border: "1px solid #ef4444",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <div className="w-full h-full flex flex-col xl:flex-row gap-4 md:gap-5 bg-gray-50 p-4 md:p-5">
        {/* Preview Section */}
        <div className="h-96 xl:h-full w-full xl:w-[70%] bg-white rounded-lg p-4 md:p-6 overflow-auto">
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              {["desktop", "mobile"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 md:px-4 py-2 rounded-md transition-all text-sm md:text-base ${
                    viewMode === mode
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  style={{
                    backgroundColor:
                      viewMode === mode ? config.primaryColor : "transparent",
                  }}
                >
                  {mode === "desktop" ? "Desktop" : "Mobile"}
                </button>
              ))}
            </div>
          </div>

          {/* Preview Container */}
          <div className="flex justify-center items-center w-full">
            <div
              className="transition-all duration-500 ease-in-out mx-auto"
              style={{
                width: viewMode === "mobile" ? "min(22rem, 100%)" : "100%",
                transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
              }}
            >
              <HeaderPreview
                config={config}
                isMobile={viewMode === "mobile"}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
              />
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="w-full xl:w-[30%]">
          <EditorPanel
            config={config}
            onConfigChange={setConfig}
            onSave={handleManualSave}
            isLoading={isLoading}
            isSaving={isSaving}
          />
        </div>
      </div>
    </>
  );
};

export default HeaderPage;
