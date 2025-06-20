"use client";
import { useState, useEffect } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../services/api";
import { useFileUpload } from "../../../../hooks/useFileUpload";

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
  <div className="h-full w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 overflow-auto">
    <div className="sticky top-0 bg-white pb-4 border-b border-gray-100 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </div>
        Header засварлах
      </h2>
      <p className="text-sm text-gray-500 mt-2">
        Та өөрийн вэбсайтын header хэсгийг засварлаж болно
      </p>
    </div>

    {/* Logo Upload */}
    <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-5 h-5 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <label className="text-sm font-semibold text-gray-700">
          Лого зураг
        </label>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            const uploadedFile = await uploadImage(file, {
              onSuccess: (fileData) => {
                onConfigChange({ ...config, image: fileData.url });
              },
            });
          }
        }}
        disabled={uploading}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
      />

      {/* Image Preview */}
      <div className="mt-4">
        {config.image ? (
          <div className="relative group">
            <img
              src={config.image}
              alt="Logo Preview"
              className="w-full rounded-lg bg-gray-100 border-2 border-gray-200 shadow-sm transition-transform duration-200 group-hover:scale-105"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                height: "120px",
              }}
            />
            <button
              onClick={() => {
                onConfigChange({ ...config, image: null });
                toast.success("Зураг устгагдлаа!");
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all duration-200 hover:scale-110"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
            style={{ height: "120px" }}
          >
            <svg
              className="w-8 h-8 mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span className="text-sm font-medium">Зураг сонгоно уу</span>
            <span className="text-xs text-gray-400 mt-1">
              PNG, JPG форматтай
            </span>
          </div>
        )}
      </div>
    </div>

    {/* Navigation Labels */}
    <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <label className="text-sm font-semibold text-gray-700">
          Навигацийн цэсний нэрс
        </label>
      </div>
      <div className="space-y-3">
        {config.labels.map((label, idx) => (
          <div key={idx} className="relative">
            <input
              type="text"
              value={label}
              onChange={(e) => {
                const newLabels = [...config.labels];
                newLabels[idx] = e.target.value;
                onConfigChange({ ...config, labels: newLabels });
              }}
              className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
              placeholder={`Цэсний нэр ${idx + 1}`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-green-600">
                {idx + 1}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Color Preview */}
    <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-5 h-5 text-purple-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-gray-700">
          Одоогийн өнгөний тохиргоо
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: config.primaryColor }}
            />
            <span className="text-sm font-medium text-gray-700">
              Primary Color
            </span>
          </div>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {config.primaryColor}
          </code>
        </div>
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: config.accentColor }}
            />
            <span className="text-sm font-medium text-gray-700">
              Accent Color
            </span>
          </div>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {config.accentColor}
          </code>
        </div>
        <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
              style={{ backgroundColor: config.textColor }}
            />
            <span className="text-sm font-medium text-gray-700">
              Text Color
            </span>
          </div>
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
            {config.textColor}
          </code>
        </div>
      </div>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-amber-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-amber-700 font-medium">
            Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
          </p>
        </div>
      </div>
    </div>

    {/* Save Button */}
    <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
      <button
        onClick={onSave}
        disabled={isLoading || isSaving}
        className="w-full text-white py-4 px-6 rounded-xl transition-all duration-200 font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
        style={{ backgroundColor: config.primaryColor }}
      >
        {isSaving ? (
          <>
            <svg
              className="animate-spin w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Хадгалж байна...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Өөрчлөлт хадгалах
          </>
        )}
      </button>
    </div>
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

  // File upload hook
  const { uploadImage, uploading } = useFileUpload();

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
