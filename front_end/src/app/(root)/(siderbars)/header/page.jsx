"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { IoMdMenu, IoClose } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../services/api";
import { useFileUpload } from "../../../../hooks/useFileUpload";

const LoadingScreen = ({ message = "Loading..." }) => (
  <div className="w-full h-full flex flex-col lg:flex-row gap-4 bg-gray-50 p-4">
    <div className="h-64 lg:h-full w-full lg:w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4" />
        <div className="text-gray-500">{message}</div>
      </div>
    </div>
    <div className="h-64 lg:h-full w-full lg:w-[30%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="animate-pulse bg-gray-300 h-4 w-20 rounded" />
    </div>
  </div>
);

const ErrorScreen = ({ error, onRetry }) => (
  <div className="w-full h-full flex flex-col lg:flex-row gap-4 bg-gray-50 p-4">
    <div className="h-64 lg:h-full w-full lg:w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 mb-4">⚠</div>
        <div className="text-red-600 font-medium">Error: {error}</div>
      </div>
    </div>
    <div className="h-64 lg:h-full w-full lg:w-[30%] bg-white rounded-lg p-4">
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        Retry Loading
      </button>
    </div>
  </div>
);

const Navigation = ({
  labels,
  activeSection,
  onSectionClick,
  colors,
  isMobile = false,
}) => {
  const navItems = useMemo(
    () =>
      labels.map((label, index) => ({
        label,
        index,
        isActive: activeSection === label,
      })),
    [labels, activeSection]
  );

  if (isMobile) {
    return (
      <ul className="flex flex-col py-2">
        {navItems.map(({ label, index, isActive }) => (
          <li
            key={index}
            onClick={() => onSectionClick(label)}
            className="cursor-pointer px-6 py-4 text-sm font-semibold border-l-4 transition-all"
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
        ))}
      </ul>
    );
  }

  return (
    <ul className="flex items-center justify-center gap-6 text-sm font-semibold">
      {navItems.map(({ label, index, isActive }) => (
        <li
          key={index}
          onClick={() => onSectionClick(label)}
          className="cursor-pointer transition-all relative group"
          style={{ color: isActive ? colors.accentColor : colors.textColor }}
        >
          {label.toUpperCase()}
          <div
            className={`absolute bottom-0 left-0 h-0.5 transition-all ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
            style={{ backgroundColor: colors.accentColor }}
          />
        </li>
      ))}
    </ul>
  );
};

const Logo = ({ image, onLogoClick, colors, isMobile = false }) => {
  const size = useMemo(
    () =>
      isMobile
        ? { width: "120px", height: "30px" }
        : { width: "140px", height: "36px" },
    [isMobile]
  );

  if (image) {
    return (
      <img
        className="cursor-pointer transition-all"
        src={image}
        onClick={onLogoClick}
        alt="Logo"
        style={{ objectFit: "contain", ...size }}
      />
    );
  }

  return (
    <div
      className="cursor-pointer transition-all border-2 border-dashed rounded-lg flex items-center justify-center"
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

const HeaderPreview = ({
  config,
  isMobile,
  activeSection,
  onSectionClick,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, [setIsMobileMenuOpen]);

  return (
    <div
      className={`border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{
        backgroundColor: config.backgroundColor,
        borderColor: "#E5E7EB",
      }}
    >
      <section
        className="w-full h-fit relative flex items-center justify-center"
        style={{ backgroundColor: config.backgroundColor }}
      >
        <div className="w-full h-fit flex items-center justify-between px-4 py-3 relative z-10">
          <div className="flex-shrink-0">
            <Logo
              image={config.image}
              onLogoClick={() => onSectionClick("home")}
              colors={config}
              isMobile={isMobile}
            />
          </div>

          {!isMobile && (
            <Navigation
              labels={config.labels}
              activeSection={activeSection}
              onSectionClick={onSectionClick}
              colors={config}
            />
          )}

          {isMobile && (
            <button
              className="p-2 transition-all hover:bg-black/10 rounded-lg"
              onClick={toggleMobileMenu}
              style={{ color: config.textColor }}
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <IoMdMenu
                  size={24}
                  className={`absolute transition-all ${
                    isMobileMenuOpen
                      ? "opacity-0 rotate-90"
                      : "opacity-100 rotate-0"
                  }`}
                />
                <IoClose
                  size={24}
                  className={`absolute transition-all ${
                    isMobileMenuOpen
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>
          )}

          {isMobile && (
            <div
              className={`absolute top-full left-0 right-0 transition-all ${
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

      <div
        className="p-8 min-h-[400px]"
        style={{ backgroundColor: `${config.backgroundColor}F5` }}
      />
    </div>
  );
};

const EditorPanel = ({
  config,
  onConfigChange,
  onSave,
  onRefreshColors,
  onRefreshAll,
  isLoading,
  isSaving,
  uploading,
  uploadImage,
}) => {
  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadImage(file, {
          onSuccess: (fileData) => {
            onConfigChange({ ...config, image: fileData.url });
          },
        });
      }
    },
    [config, onConfigChange, uploadImage]
  );

  const handleLabelChange = useCallback(
    (idx, value) => {
      const newLabels = [...config.labels];
      newLabels[idx] = value;
      onConfigChange({ ...config, labels: newLabels });
    },
    [config, onConfigChange]
  );

  const removeImage = useCallback(() => {
    onConfigChange({ ...config, image: null });
    toast.success("Зураг устгагдлаа!");
  }, [config, onConfigChange]);

  return (
    <div className="h-full w-full bg-white rounded-xl shadow-lg border border-gray-200 p-6 overflow-auto">
      <div className="sticky top-0 bg-white pb-4 border-b border-gray-100 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            ✏️
          </div>
          Header засварлах
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Та өөрийн вэбсайтын header хэсгийг засварлаж болно
        </p>
      </div>

      <div className="mb-8 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-blue-600">🖼️</span>
          <label className="text-sm font-semibold text-gray-700">
            Лого зураг
          </label>
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all border border-gray-200 rounded-lg bg-white disabled:opacity-50"
        />

        <div className="mt-4">
          {config.image ? (
            <div className="relative group">
              <img
                src={config.image}
                alt="Logo Preview"
                className="w-full rounded-lg bg-gray-100 border-2 border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  height: "120px",
                }}
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg transition-all hover:scale-110"
              >
                ×
              </button>
            </div>
          ) : (
            <div
              className="w-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
              style={{ height: "120px" }}
            >
              <span className="text-2xl">+</span>
              <span className="text-sm font-medium">Зураг сонгоно уу</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG форматтай
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-green-600">📋</span>
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
                onChange={(e) => handleLabelChange(idx, e.target.value)}
                className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white shadow-sm hover:shadow-md"
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

      <div className="mb-8 p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-purple-600">🎨</span>
          <h3 className="text-sm font-semibold text-gray-700">
            Одоогийн өнгөний тохиргоо
          </h3>
        </div>
        <div className="space-y-3">
          {[
            { name: "Primary Color", value: config.primaryColor },
            { name: "Accent Color", value: config.accentColor },
            { name: "Text Color", value: config.textColor },
          ].map(({ name, value }) => (
            <div
              key={name}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: value }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {name}
                </span>
              </div>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                {value}
              </code>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-amber-600">ℹ️</span>
            <p className="text-xs text-amber-700 font-medium">
              Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Өнгөний тохиргоо
        </h4>
        <div className="space-y-2">
          <button
            onClick={onRefreshColors}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm hover:bg-blue-600"
          >
            Өнгө шинэчлэх
          </button>
          <button
            onClick={onRefreshAll}
            disabled={isLoading}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm disabled:opacity-50 hover:bg-gray-600"
          >
            {isLoading ? "Ачаалж байна..." : "Бүх өгөгдөл дахин ачаалах"}
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100">
        <button
          onClick={onSave}
          disabled={isLoading || isSaving}
          className="w-full text-white py-4 px-6 rounded-xl transition-all font-semibold text-sm shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
          style={{ backgroundColor: config.primaryColor }}
        >
          {isSaving ? (
            <>
              <span className="animate-spin">⟳</span>
              Хадгалж байна...
            </>
          ) : (
            <>
              <span className="group-hover:scale-110 transition-transform">
                💾
              </span>
              Өөрчлөлт хадгалах
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const HeaderPage = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [config, setConfig] = useState(null);

  const { uploadImage, uploading: fileUploading } = useFileUpload();
  const uploading = fileUploading || false;

  const toastOptions = useMemo(
    () => ({
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
    }),
    []
  );

  const loadGeneralInfoColors = useCallback(async () => {
    try {
      const result = await api.getSubsection("general-info", "main");
      return result.success && result.data?.data?.colors
        ? result.data.data.colors
        : null;
    } catch (error) {
      console.error("Error loading general-info colors:", error);
      return null;
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [generalInfoColors, headerResult] = await Promise.all([
        loadGeneralInfoColors(),
        api.getSubsection("header", "main"),
      ]);

      if (headerResult.success && headerResult.data?.data) {
        const data = headerResult.data.data;
        const colorsToUse = generalInfoColors || data.colors;

        if (!colorsToUse) {
          throw new Error("No colors available from backend");
        }

        const configWithColors = { ...data, ...colorsToUse };
        setConfig(configWithColors);
        toast.success("Header мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        setError("No header data found in backend");
        toast.error("Header өгөгдөл олдсонгүй!");
      }
    } catch (error) {
      console.error("Error loading header data:", error);
      setError("Failed to load header data");
      toast.error("Header мэдээлэл ачаалахад алдаа гарлаа!");
    } finally {
      setIsLoading(false);
    }
  }, [loadGeneralInfoColors]);

  const saveData = useCallback(
    async (configToSave = config, showToast = false) => {
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
    },
    [config]
  );

  const handleSectionClick = useCallback((sectionName) => {
    setActiveSection(sectionName);
    setIsMobileMenuOpen(false);
  }, []);

  const handleRefreshColors = useCallback(async () => {
    try {
      const generalInfoColors = await loadGeneralInfoColors();
      if (generalInfoColors && config) {
        setConfig((prev) => ({ ...prev, ...generalInfoColors }));
        toast.success("Өнгөний тохиргоо шинэчлэгдлээ!");
      }
    } catch (error) {
      toast.error("Өнгө шинэчлэхэд алдаа гарлаа!");
    }
  }, [config, loadGeneralInfoColors]);

  const handleManualSave = useCallback(() => {
    saveData(config, true);
  }, [config, saveData]);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isClient || isLoading || !config) return;

    const timeoutId = setTimeout(() => {
      saveData(config, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [config, isClient, isLoading, saveData]);

  if (!isClient || isLoading || !config) {
    return <LoadingScreen message="Loading header data from backend..." />;
  }

  if (error) {
    return <ErrorScreen error={error} onRetry={loadData} />;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={toastOptions} />

      <div className="w-full h-full flex flex-col xl:flex-row gap-4 bg-gray-50 p-4">
        <div className="h-96 xl:h-full w-full xl:w-[70%] bg-white rounded-lg p-4 overflow-auto">
          {/* View Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 rounded-lg p-1 flex">
              {["desktop", "mobile"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-md transition-all text-sm ${
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

        <div className="w-full xl:w-[30%]">
          <EditorPanel
            config={config}
            onConfigChange={setConfig}
            onSave={handleManualSave}
            onRefreshColors={handleRefreshColors}
            onRefreshAll={loadData}
            isLoading={isLoading}
            isSaving={isSaving}
            uploading={uploading}
            uploadImage={uploadImage}
          />
        </div>
      </div>
    </>
  );
};

export default HeaderPage;
