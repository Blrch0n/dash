"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../services/api";

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

// Error Screen Component
const ErrorScreen = ({ error, onRetry }) => (
  <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
    <div className="h-full w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4">
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        Retry Loading
      </button>
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

// Footer Preview Component
const FooterPreview = ({ footerData, isMobile }) => {
  const colors = footerData?.colors || {};

  return (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{ borderColor: colors.borderColor }}
    >
      <footer
        className="text-white p-6"
        style={{ backgroundColor: colors.textColor }}
      >
        <div
          className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-4"}`}
        >
          {/* About Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              {footerData?.about?.title || "About"}
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{ color: `${colors.backgroundColor}CC` }}
            >
              {footerData?.about?.content || "About content goes here..."}
            </p>
          </div>

          {/* Recent News Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              {footerData?.news?.title || "Recent News"}
            </h3>
            <div className="space-y-2">
              {footerData?.news?.items?.map((item, index) => (
                <div key={index}>
                  <p
                    className="text-sm hover:text-white cursor-pointer transition"
                    style={{ color: `${colors.backgroundColor}CC` }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = colors.backgroundColor)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = `${colors.backgroundColor}CC`)
                    }
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: `${colors.backgroundColor}80` }}
                  >
                    {item.date}
                  </p>
                </div>
              )) || (
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  No news items available
                </p>
              )}
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              {footerData?.links?.title || "Useful Links"}
            </h3>
            <ul className="space-y-1">
              {footerData?.links?.items?.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm transition cursor-pointer"
                    style={{ color: `${colors.backgroundColor}CC` }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = colors.backgroundColor)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = `${colors.backgroundColor}CC`)
                    }
                  >
                    {link}
                  </a>
                </li>
              )) || (
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  No links available
                </p>
              )}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: colors.primaryColor }}
            >
              {footerData?.contact?.title || "Contact"}
            </h3>
            <p
              className="text-sm"
              style={{ color: `${colors.backgroundColor}CC` }}
            >
              {footerData?.contact?.description || "Contact description..."}
            </p>
            <div className="space-y-1">
              <p
                className="text-sm"
                style={{ color: `${colors.backgroundColor}CC` }}
              >
                <span style={{ color: colors.primaryColor }}>T:</span>{" "}
                {footerData?.contact?.phone || "Phone number"}
              </p>
              <p
                className="text-sm"
                style={{ color: `${colors.backgroundColor}CC` }}
              >
                <span style={{ color: colors.primaryColor }}>E:</span>{" "}
                {footerData?.contact?.email || "Email address"}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t mt-6 pt-4 text-center"
          style={{ borderColor: `${colors.backgroundColor}40` }}
        >
          <p
            className="text-sm"
            style={{ color: `${colors.backgroundColor}99` }}
          >
            {footerData?.copyright || "Copyright text"}
          </p>
        </div>
      </footer>
    </div>
  );
};

// Editor Form Component
const EditorForm = ({ footerData, onDataChange, colors }) => {
  const handleAboutChange = (value) => {
    onDataChange({
      ...footerData,
      about: { ...footerData.about, content: value },
    });
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...(footerData.links?.items || [])];
    newLinks[index] = value;
    onDataChange({
      ...footerData,
      links: { ...footerData.links, items: newLinks },
    });
  };

  const handleContactChange = (field, value) => {
    onDataChange({
      ...footerData,
      contact: { ...footerData.contact, [field]: value },
    });
  };

  const handleCopyrightChange = (value) => {
    onDataChange({
      ...footerData,
      copyright: value,
    });
  };

  return (
    <div className="space-y-6">
      {/* About Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          About Section
        </h3>
        <textarea
          value={footerData?.about?.content || ""}
          onChange={(e) => handleAboutChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          rows="3"
          placeholder="About content"
        />
      </div>

      {/* Links Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Useful Links</h3>
        {(footerData?.links?.items || []).map((link, idx) => (
          <input
            key={idx}
            type="text"
            value={link}
            onChange={(e) => handleLinkChange(idx, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
            placeholder={`Link ${idx + 1}`}
          />
        ))}
      </div>

      {/* Contact Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Contact Info</h3>
        <textarea
          value={footerData?.contact?.description || ""}
          onChange={(e) => handleContactChange("description", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          rows="2"
          placeholder="Contact description"
        />
        <input
          type="text"
          value={footerData?.contact?.phone || ""}
          onChange={(e) => handleContactChange("phone", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
          placeholder="Phone number"
        />
        <input
          type="email"
          value={footerData?.contact?.email || ""}
          onChange={(e) => handleContactChange("email", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          placeholder="Email address"
        />
      </div>

      {/* Copyright Section */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Copyright</h3>
        <input
          type="text"
          value={footerData?.copyright || ""}
          onChange={(e) => handleCopyrightChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
          placeholder="Copyright text"
        />
      </div>
    </div>
  );
};

// Color Preview Component
const ColorPreview = ({ colors }) => (
  <div className="p-4 bg-gray-50 rounded-lg mt-6">
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
      <p>• Section: footer/main</p>
      <p>• Status: {isSaving ? "Saving..." : "Saved"}</p>
    </div>
  </div>
);

// Main Footer Page Component
const FooterPage = () => {
  // State management
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [footerData, setFooterData] = useState(null);

  // Data loading from backend
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await api.getSubsection("footer", "main");

      if (result.success && result.data?.data) {
        setFooterData(result.data.data);
        toast.success("Footer мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        setError("No footer data found in database");
        toast.error("Footer өгөгдөл олдсонгүй!");
      }
    } catch (error) {
      console.error("Error loading footer data:", error);
      setError("Failed to load footer data");
      toast.error("Footer мэдээлэл ачаалахад алдаа гарлаа!");
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
        sectionName: "footer",
        subsectionName: "main",
        title: "Footer Configuration",
        content: "Footer section with contact info and links",
        data: dataToSave,
      });

      if (result.success) {
        if (showToast) {
          toast.success("Footer амжилттай хадгалагдлаа!", { id: "saving" });
        }
      } else {
        throw new Error("Save operation failed");
      }
    } catch (error) {
      console.error("Error saving footer data:", error);
      setError("Failed to save footer data");
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
    if (footerData) {
      saveData(footerData, true);
    }
  };

  const handleDataChange = (newData) => {
    setFooterData(newData);
  };

  // Effects
  useEffect(() => {
    setIsClient(true);
    loadData();
  }, []);

  useEffect(() => {
    if (!isClient || isLoading || !footerData) return;

    const timeoutId = setTimeout(() => {
      saveData(footerData, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [footerData, isClient, isLoading]);

  // Render conditions
  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading footer data from backend..." />;
  }

  if (error || !footerData) {
    return <ErrorScreen error={error} onRetry={loadData} />;
  }

  const colors = footerData?.colors || {};

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

          <div className="flex justify-center items-center w-full">
            <div
              className="transition-all duration-500 ease-in-out mx-auto"
              style={{
                width: viewMode === "mobile" ? "22rem" : "100%",
                transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
              }}
            >
              <FooterPreview
                footerData={footerData}
                isMobile={viewMode === "mobile"}
              />
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Footer засварлах
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Footer
            </label>
            <p className="text-xs text-gray-500">
              Footer нь таны вэбсайтын доод хэсэг бөгөөд чухал мэдээлэл,
              холбоосууд болон холбоо барих мэдээллийг агуулна.
            </p>
          </div>

          <EditorForm
            footerData={footerData}
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
          >
            {isSaving ? "Хадгалж байна..." : "Хадгалах"}
          </button>

          <StorageInfo isSaving={isSaving} />
        </div>
      </div>
    </>
  );
};

export default FooterPage;
