"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { api } from "../../../../../../services/api";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { IoMailOpen } from "react-icons/io5";
import { MdContactMail } from "react-icons/md";

// Icon component
const getIcon = (iconType) => {
  switch (iconType) {
    case "phone":
      return <MdOutlinePhoneIphone className="text-[40px] text-[#fcb03b]" />;
    case "email":
      return <IoMailOpen className="text-[40px] text-[#f15b26]" />;
    case "address":
      return <MdContactMail className="text-[40px] text-[#3cb878]" />;
    default:
      return <MdOutlinePhoneIphone className="text-[40px] text-[#fcb03b]" />;
  }
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
        It looks like the contact section1 data doesn't exist in the database.
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
    style={{
      backgroundColor: colors.backgroundColor,
      borderColor: colors.borderColor,
    }}
  >
    <div className="w-full h-fit py-16 sm:py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Contact Grid - No Header Section */}
        <div className="w-full h-fit bg-[#eeeeee] rounded-lg">
          <div
            className={`max-w-[1200px] mx-auto w-full h-fit grid text-black items-center justify-center px-4 ${
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
            } md:px-0`}
          >
            {(section1Data?.contacts || []).map((data, index) => (
              <div
                key={data.id}
                className={`w-full h-fit flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center p-4 sm:p-8 transition-transform duration-300 hover:bg-white/50 ${
                  index < (section1Data?.contacts || []).length - 1 && !isMobile
                    ? "border-b md:border-b-0 md:border-r border-gray-300"
                    : isMobile
                    ? "border-b border-gray-300 last:border-b-0"
                    : ""
                }`}
              >
                <div className="hover:scale-110 hover:rotate-2 transition-transform duration-300">
                  {getIcon(data.icon)}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-[14px] text-[#828282]">{data.title}</p>
                  <h1 className="text-[20px] sm:text-[25px] text-[#2A2F35] font-bold break-words">
                    {data.description}
                  </h1>
                </div>
              </div>
            ))}
          </div>
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
const EditorForm = ({ section1Data, onDataChange, colors }) => {
  const handleContactChange = (index, field, value) => {
    onDataChange({
      ...section1Data,
      contacts: (section1Data.contacts || []).map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    });
  };

  const addNewContact = () => {
    const newContact = {
      id: Date.now(),
      icon: "phone",
      title: "New Contact",
      description: "Contact information",
    };

    onDataChange({
      ...section1Data,
      contacts: [...(section1Data.contacts || []), newContact],
    });
  };

  const removeContact = (index) => {
    onDataChange({
      ...section1Data,
      contacts: (section1Data.contacts || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Contacts Section Only */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Contact Information ({section1Data?.contacts?.length || 0})
          </h3>
          <button
            onClick={addNewContact}
            className="text-xs px-2 py-1 rounded text-white"
            style={{ backgroundColor: colors.primaryColor }}
            title="Шинэ холбоо барих мэдээлэл нэмэх"
          >
            + Add
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto space-y-4">
          {(section1Data?.contacts || []).map((contact, index) => (
            <div
              key={contact.id}
              className="border border-gray-200 rounded-md p-3 relative"
            >
              {/* Remove button */}
              <button
                onClick={() => removeContact(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                title="Холбоо барих мэдээлэл устгах"
              >
                ×
              </button>

              <h4 className="text-xs font-medium text-gray-600 mb-2">
                Contact {index + 1}
              </h4>
              <select
                value={contact.icon}
                onChange={(e) =>
                  handleContactChange(index, "icon", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              >
                <option value="phone">Phone Icon</option>
                <option value="email">Email Icon</option>
                <option value="address">Address Icon</option>
              </select>
              <input
                type="text"
                value={contact.title}
                onChange={(e) =>
                  handleContactChange(index, "title", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                placeholder="Contact title"
              />
              <textarea
                value={contact.description}
                onChange={(e) =>
                  handleContactChange(index, "description", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Contact information"
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
      <p>• Section: contact/section1</p>
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
  const [colors, setColors] = useState({
    primaryColor: "#3b82f6",
    secondaryColor: "#1e40af",
    textColor: "#1f2937",
    backgroundColor: "#ffffff",
    borderColor: "#e5e7eb",
  });
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const router = useRouter();

  // Create section1 data with basic structure
  const createSection1Data = async () => {
    try {
      setIsLoading(true);
      setError(null);
      toast.loading("Creating section1 data...", { id: "creating" });

      const basicSection1Data = {
        contacts: [
          {
            id: 1,
            icon: "phone",
            title: "Phone",
            description: "+976 1234 5678",
          },
          {
            id: 2,
            icon: "email",
            title: "Email",
            description: "info@example.com",
          },
          {
            id: 3,
            icon: "address",
            title: "Address",
            description: "Ulaanbaatar, Mongolia",
          },
        ],
      };

      const result = await api.saveSection({
        sectionName: "contact",
        subsectionName: "section1",
        title: "Contact Information",
        content: "Contact section 1 content",
        data: basicSection1Data,
      });

      if (result.success) {
        setSection1Data(basicSection1Data);
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

      console.log("🔍 Loading contact section1 data...");
      const result = await api.getSubsection("contact", "section1");
      console.log("📊 API Result:", result);

      if (result.success && result.data?.data) {
        setSection1Data(result.data.data);
        toast.success("Section1 мэдээлэл амжилттай ачааллагдлаа!");
      } else {
        console.log("❌ No data found, will show create option");
        setError("No contact section1 data found in database");
        // Don't show error toast immediately, let user choose to create
      }
    } catch (error) {
      console.error("Error loading contact section1 data:", error);
      setError("Failed to load contact section1 data");
      toast.error("Section1 мэдээлэл ачаалахад алдаа гарлаа!");
    } finally {
      setIsLoading(false);
    }
  };

  // Load colors from general-info section
  const loadColors = async () => {
    try {
      setIsLoadingColors(true);
      console.log("🎨 Loading colors from general-info...");

      const result = await api.getSubsection("general-info", "main");
      console.log("🎨 General-info result:", result);

      if (result.success && result.data?.data?.colors) {
        const generalColors = result.data.data.colors;
        setColors({
          primaryColor: generalColors.primaryColor || "#3b82f6",
          secondaryColor: generalColors.secondaryColor || "#1e40af",
          textColor: generalColors.textColor || "#1f2937",
          backgroundColor: generalColors.backgroundColor || "#ffffff",
          borderColor: generalColors.borderColor || "#e5e7eb",
        });
        console.log("✅ Colors loaded successfully:", generalColors);
      } else {
        console.log("⚠️ No colors found in general-info, using defaults");
      }
    } catch (error) {
      console.error("❌ Error loading colors:", error);
    } finally {
      setIsLoadingColors(false);
    }
  };

  // Refresh colors manually
  const refreshColors = async () => {
    toast.loading("Refreshing colors...", { id: "refresh-colors" });
    await loadColors();
    toast.success("Colors refreshed!", { id: "refresh-colors" });
  };

  // Data saving to backend
  const saveData = async (dataToSave, showToast = false) => {
    try {
      if (showToast) {
        setIsSaving(true);
        toast.loading("Хадгалж байна...", { id: "saving" });
      }

      const result = await api.saveSection({
        sectionName: "contact",
        subsectionName: "section1",
        title: "Contact Information",
        content: "Contact section 1 content",
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
      console.error("Error saving contact section1 data:", error);
      setError("Failed to save contact section1 data");
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
    loadColors();
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
      <LoadingScreen message="Loading contact section1 data from backend..." />
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
              {section1Data ? (
                <PreviewComponent
                  section1Data={section1Data}
                  colors={colors}
                  isMobile={viewMode === "mobile"}
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <p>No contact section1 data to preview</p>
                    <p className="text-sm mt-2">Create data to see preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Section */}
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Section 1 засварлах
            </h2>
            <button
              onClick={refreshColors}
              disabled={isLoadingColors}
              className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              title="Refresh colors from general-info"
            >
              {isLoadingColors ? "⟳" : "🎨"}
            </button>
          </div>

          {section1Data ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Information
                </label>
                <p className="text-xs text-gray-500">
                  Section 1 нь Contact хэсэг бөгөөд таны холбоо барих мэдээллийг
                  харуулна.
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
            </>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No section1 data available.</p>
              <p className="text-sm mt-2">
                Create data using the button above.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Section1Page;
