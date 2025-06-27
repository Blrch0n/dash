"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../services/api";

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

const ErrorScreen = ({ error, onRetry }) => (
  <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
    <div className="h-full w-[70%] bg-white rounded-lg p-4 flex items-center justify-center">
      <div className="text-red-500">Error: {error}</div>
    </div>
    <div className="h-full w-[30%] bg-white rounded-lg p-4">
      <button
        onClick={onRetry}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Retry Loading
      </button>
    </div>
  </div>
);

const ViewModeToggle = ({ viewMode, setViewMode, primaryColor }) => {
  const modes = useMemo(() => ["desktop", "mobile"], []);

  return (
    <div className="flex justify-center mb-6">
      <div className="bg-gray-200 rounded-lg p-1 flex">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded transition-all ${
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
};

const FooterPreview = ({ footerData, isMobile }) => {
  const colors = useMemo(() => footerData?.colors || {}, [footerData?.colors]);

  const footerSections = useMemo(
    () => [
      {
        title: footerData?.about?.title || "About",
        content: footerData?.about?.content || "About content goes here...",
        type: "about",
      },
      {
        title: footerData?.news?.title || "Recent News",
        items: footerData?.news?.items || [],
        type: "news",
      },
      {
        title: footerData?.links?.title || "Useful Links",
        items: footerData?.links?.items || [],
        type: "links",
      },
      {
        title: footerData?.contact?.title || "Contact",
        content: footerData?.contact || {},
        type: "contact",
      },
    ],
    [footerData]
  );

  const renderSection = useCallback(
    (section) => {
      switch (section.type) {
        case "about":
          return (
            <p
              className="text-sm leading-relaxed"
              style={{ color: `${colors.backgroundColor}CC` }}
            >
              {section.content}
            </p>
          );

        case "news":
          return (
            <div className="space-y-2">
              {section.items.length > 0 ? (
                section.items.map((item, index) => (
                  <div key={index}>
                    <p
                      className="text-sm hover:text-white cursor-pointer transition"
                      style={{ color: `${colors.backgroundColor}CC` }}
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
                ))
              ) : (
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  No news items available
                </p>
              )}
            </div>
          );

        case "links":
          return (
            <ul className="space-y-1">
              {section.items.length > 0 ? (
                section.items.map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-sm transition cursor-pointer"
                      style={{ color: `${colors.backgroundColor}CC` }}
                    >
                      {link}
                    </a>
                  </li>
                ))
              ) : (
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  No links available
                </p>
              )}
            </ul>
          );

        case "contact":
          return (
            <>
              <p
                className="text-sm"
                style={{ color: `${colors.backgroundColor}CC` }}
              >
                {section.content.description || "Contact description..."}
              </p>
              <div className="space-y-1">
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  <span style={{ color: colors.primaryColor }}>T:</span>{" "}
                  {section.content.phone || "Phone number"}
                </p>
                <p
                  className="text-sm"
                  style={{ color: `${colors.backgroundColor}CC` }}
                >
                  <span style={{ color: colors.primaryColor }}>E:</span>{" "}
                  {section.content.email || "Email address"}
                </p>
              </div>
            </>
          );

        default:
          return null;
      }
    },
    [colors]
  );

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
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3
                className="text-lg font-semibold"
                style={{ color: colors.primaryColor }}
              >
                {section.title}
              </h3>
              {renderSection(section)}
            </div>
          ))}
        </div>

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

const EditorForm = ({ footerData, onDataChange }) => {
  const handleAboutChange = useCallback(
    (value) => {
      onDataChange({
        ...footerData,
        about: { ...footerData.about, content: value },
      });
    },
    [footerData, onDataChange]
  );

  const handleLinkChange = useCallback(
    (index, value) => {
      const newLinks = [...(footerData.links?.items || [])];
      newLinks[index] = value;
      onDataChange({
        ...footerData,
        links: { ...footerData.links, items: newLinks },
      });
    },
    [footerData, onDataChange]
  );

  const handleContactChange = useCallback(
    (field, value) => {
      onDataChange({
        ...footerData,
        contact: { ...footerData.contact, [field]: value },
      });
    },
    [footerData, onDataChange]
  );

  const handleCopyrightChange = useCallback(
    (value) => {
      onDataChange({
        ...footerData,
        copyright: value,
      });
    },
    [footerData, onDataChange]
  );

  const formSections = useMemo(
    () => [
      {
        title: "About Section",
        type: "textarea",
        value: footerData?.about?.content || "",
        onChange: handleAboutChange,
        placeholder: "About content",
        rows: 3,
      },
      {
        title: "Contact Info",
        type: "contact",
        fields: [
          {
            type: "textarea",
            value: footerData?.contact?.description || "",
            onChange: (value) => handleContactChange("description", value),
            placeholder: "Contact description",
            rows: 2,
          },
          {
            type: "text",
            value: footerData?.contact?.phone || "",
            onChange: (value) => handleContactChange("phone", value),
            placeholder: "Phone number",
          },
          {
            type: "email",
            value: footerData?.contact?.email || "",
            onChange: (value) => handleContactChange("email", value),
            placeholder: "Email address",
          },
        ],
      },
      {
        title: "Copyright",
        type: "text",
        value: footerData?.copyright || "",
        onChange: handleCopyrightChange,
        placeholder: "Copyright text",
      },
    ],
    [footerData, handleAboutChange, handleContactChange, handleCopyrightChange]
  );

  return (
    <div className="space-y-6">
      {formSections.map((section, index) => (
        <div key={index}>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            {section.title}
          </h3>

          {section.type === "textarea" && (
            <textarea
              value={section.value}
              onChange={(e) => section.onChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:border-transparent"
              rows={section.rows}
              placeholder={section.placeholder}
            />
          )}

          {section.type === "text" && (
            <input
              type="text"
              value={section.value}
              onChange={(e) => section.onChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:border-transparent"
              placeholder={section.placeholder}
            />
          )}

          {section.type === "contact" && (
            <>
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="mb-2">
                  {field.type === "textarea" ? (
                    <textarea
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                      rows={field.rows}
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      ))}

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">Useful Links</h3>
        {(footerData?.links?.items || []).map((link, idx) => (
          <input
            key={idx}
            type="text"
            value={link}
            onChange={(e) => handleLinkChange(idx, e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:border-transparent mb-2"
            placeholder={`Link ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const ColorPreview = ({ colors }) => {
  const colorItems = useMemo(
    () => [
      { name: "Primary", color: colors?.primaryColor },
      { name: "Accent", color: colors?.accentColor },
      { name: "Text", color: colors?.textColor },
    ],
    [colors]
  );

  return (
    <div className="p-4 bg-gray-50 rounded-lg mt-6">
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Одоогийн өнгөний тохиргоо
      </h3>
      <div className="space-y-2 text-xs">
        {colorItems.map(({ name, color }) => (
          <div key={name} className="flex items-center justify-between">
            <span>{name}:</span>
            <div
              className="w-6 h-4 rounded border"
              style={{ backgroundColor: color }}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
      </p>
    </div>
  );
};

const StorageInfo = ({ isSaving }) => {
  const statusItems = useMemo(
    () => [
      "Backend: MongoDB Atlas",
      "Section: footer/main",
      `Status: ${isSaving ? "Saving..." : "Saved"}`,
    ],
    [isSaving]
  );

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Storage Info</h4>
      <div className="text-xs text-gray-600 space-y-1">
        {statusItems.map((item, index) => (
          <p key={index}>• {item}</p>
        ))}
      </div>
    </div>
  );
};

const FooterPage = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [footerData, setFooterData] = useState(null);

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

  const loadData = useCallback(async () => {
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
  }, []);

  const saveData = useCallback(async (dataToSave, showToast = false) => {
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
  }, []);

  const handleManualSave = useCallback(() => {
    if (footerData) {
      saveData(footerData, true);
    }
  }, [footerData, saveData]);

  const handleDataChange = useCallback((newData) => {
    setFooterData(newData);
  }, []);

  useEffect(() => {
    setIsClient(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!isClient || isLoading || !footerData) return;

    const timeoutId = setTimeout(() => {
      saveData(footerData, false);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [footerData, isClient, isLoading, saveData]);

  const colors = useMemo(() => footerData?.colors || {}, [footerData?.colors]);

  if (!isClient || isLoading) {
    return <LoadingScreen message="Loading footer data from backend..." />;
  }

  if (error || !footerData) {
    return <ErrorScreen error={error} onRetry={loadData} />;
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={toastOptions} />

      <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
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

          <EditorForm footerData={footerData} onDataChange={handleDataChange} />

          <ColorPreview colors={colors} />

          <button
            onClick={handleManualSave}
            disabled={isLoading || isSaving}
            className="w-full text-white py-3 px-4 rounded transition-colors font-medium mt-6 disabled:opacity-50"
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
