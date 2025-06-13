"use client";
import { useState, useEffect } from "react";

const footerInfo = {
  title: "Footer",
  content:
    "Footer нь таны вэбсайтын доод хэсэг бөгөөд чухал мэдээлэл, холбоосууд болон холбоо барих мэдээллийг агуулна.",
  key: "footer",
};

const DEFAULT_FOOTER_DATA = {
  about: {
    title: "Бидний тухай",
    content:
      "Бид бол дижитал эрин үед бизнесүүдийг хэрэглэгчдэдээ ойр байлгах цогц дизайн, технологийн түнш юм. Зүрх сэтгэл, оюун ухаанд хүрч, бизнесүүдийг дижитал эринд хамааралтай байхад тусалдаг.",
  },
  news: {
    title: "Сүүлийн мэдээ",
    items: [
      {
        title: "Enside-тэй илүү сайхан дэлхий бүтээцгээе",
        date: "2017 оны 11-р сарын 29",
      },
      {
        title: "Enside шинэ салбарын eCommerce туршлага нээлээ",
        date: "2017 оны 11-р сарын 29",
      },
    ],
  },
  links: {
    title: "Хэрэгтэй холбоосууд",
    items: [
      "Түгээмэл асуултууд",
      "Баримт бичиг",
      "Сэтгэгдэл",
      "Хичээлүүд",
      "Онцлогууд",
    ],
  },
  contact: {
    title: "Холбоо барих",
    description:
      "Манай тусламжийн баг 7 хоногийн турш, 24 цагийн турш танд туслахад бэлэн.",
    phone: "+ 1 703 4959 3452",
    email: "test@gmail.com",
  },
  copyright: "Powered by Enside - Premium HTML Template",
};

// Default website configuration
const defaultWebsiteConfig = {
  primaryColor: "#3B82F6",
  secondaryColor: "#1E40AF",
  accentColor: "#EF4444",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  scrolledBgColor: "#FFFFFF",
  scrolledTextColor: "#1F2937",
  hoverColor: "#3B82F6",
  borderColor: "#E5E7EB",
  footerData: DEFAULT_FOOTER_DATA,
};

// Helper function to load configuration from localStorage
const loadConfigFromStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("websiteConfig");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading config from localStorage:", error);
    }
  }
  return defaultWebsiteConfig;
};

// Helper function to save configuration to localStorage
const saveConfigToStorage = (config) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("websiteConfig", JSON.stringify(config));
    } catch (error) {
      console.error("Error saving config to localStorage:", error);
    }
  }
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [isClient, setIsClient] = useState(false);

  // Initialize with default configuration
  const [websiteConfig, setWebsiteConfig] = useState(defaultWebsiteConfig);
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER_DATA);

  // Color states
  const [primaryColor, setPrimaryColor] = useState(
    defaultWebsiteConfig.primaryColor
  );
  const [secondaryColor, setSecondaryColor] = useState(
    defaultWebsiteConfig.secondaryColor
  );
  const [accentColor, setAccentColor] = useState(
    defaultWebsiteConfig.accentColor
  );
  const [textColor, setTextColor] = useState(defaultWebsiteConfig.textColor);

  // Load configuration from localStorage after component mounts
  useEffect(() => {
    setIsClient(true);

    const loadedConfig = loadConfigFromStorage();
    setWebsiteConfig(loadedConfig);
    setFooterData(loadedConfig.footerData || DEFAULT_FOOTER_DATA);

    // Update color states
    setPrimaryColor(loadedConfig.primaryColor);
    setSecondaryColor(loadedConfig.secondaryColor);
    setAccentColor(loadedConfig.accentColor);
    setTextColor(loadedConfig.textColor);
  }, []);

  // Auto-save function for footer data
  const saveFooterConfig = () => {
    if (!isClient) return;

    const updatedConfig = {
      ...websiteConfig,
      footerData,
    };

    setWebsiteConfig(updatedConfig);
    saveConfigToStorage(updatedConfig);

    // Dispatch event to notify other pages
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("websiteConfigUpdate", {
          detail: updatedConfig,
        })
      );
    }
  };

  // Auto-save when footerData changes
  useEffect(() => {
    if (isClient) {
      saveFooterConfig();
    }
  }, [footerData, isClient]);

  // Listen for configuration updates from other pages
  useEffect(() => {
    if (!isClient) return;

    const handleConfigUpdate = (event) => {
      const updatedConfig = event.detail;
      setWebsiteConfig(updatedConfig);

      // Update color states
      setPrimaryColor(updatedConfig.primaryColor);
      setSecondaryColor(updatedConfig.secondaryColor);
      setAccentColor(updatedConfig.accentColor);
      setTextColor(updatedConfig.textColor);

      // Update footer data if it exists in the config
      if (updatedConfig.footerData) {
        setFooterData(updatedConfig.footerData);
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === "websiteConfig") {
        try {
          const newConfig = JSON.parse(event.newValue);
          handleConfigUpdate({ detail: newConfig });
        } catch (error) {
          console.error("Error parsing storage change:", error);
        }
      }
    };

    window.addEventListener("websiteConfigUpdate", handleConfigUpdate);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("websiteConfigUpdate", handleConfigUpdate);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [isClient]);

  const handleAboutChange = (value) => {
    setFooterData((prev) => ({
      ...prev,
      about: { ...prev.about, content: value },
    }));
  };

  const handleLinkChange = (index, value) => {
    const newLinks = [...footerData.links.items];
    newLinks[index] = value;
    setFooterData((prev) => ({
      ...prev,
      links: { ...prev.links, items: newLinks },
    }));
  };

  const handleContactChange = (field, value) => {
    setFooterData((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleCopyrightChange = (value) => {
    setFooterData((prev) => ({
      ...prev,
      copyright: value,
    }));
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
        <div className="h-full w-[70%] bg-white rounded-lg p-4 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
        <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
          <div className="flex justify-center items-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
      style={{ borderColor: websiteConfig.borderColor }}
    >
      <footer className="text-white p-6" style={{ backgroundColor: textColor }}>
        <div
          className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-4"}`}
        >
          {/* About Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              {footerData.about.title}
            </h3>
            <p
              className={`${isMobile ? "text-sm" : "text-sm"} leading-relaxed`}
              style={{ color: `${websiteConfig.backgroundColor}CC` }}
            >
              {footerData.about.content}
            </p>
          </div>

          {/* Recent News Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              {footerData.news.title}
            </h3>
            <div className="space-y-2">
              {footerData.news.items.map((item, index) => (
                <div key={index}>
                  <p
                    className="text-sm hover:text-white cursor-pointer transition"
                    style={{ color: `${websiteConfig.backgroundColor}CC` }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = websiteConfig.backgroundColor)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = `${websiteConfig.backgroundColor}CC`)
                    }
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: `${websiteConfig.backgroundColor}80` }}
                  >
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              {footerData.links.title}
            </h3>
            <ul className="space-y-1">
              {footerData.links.items.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm transition cursor-pointer"
                    style={{ color: `${websiteConfig.backgroundColor}CC` }}
                    onMouseEnter={(e) =>
                      (e.target.style.color = websiteConfig.backgroundColor)
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.color = `${websiteConfig.backgroundColor}CC`)
                    }
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3
              className="text-lg font-semibold"
              style={{ color: primaryColor }}
            >
              {footerData.contact.title}
            </h3>
            <p
              className="text-sm"
              style={{ color: `${websiteConfig.backgroundColor}CC` }}
            >
              {footerData.contact.description}
            </p>
            <div className="space-y-1">
              <p
                className="text-sm"
                style={{ color: `${websiteConfig.backgroundColor}CC` }}
              >
                <span style={{ color: primaryColor }}>T:</span>{" "}
                {footerData.contact.phone}
              </p>
              <p
                className="text-sm"
                style={{ color: `${websiteConfig.backgroundColor}CC` }}
              >
                <span style={{ color: primaryColor }}>E:</span>{" "}
                {footerData.contact.email}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div
          className="border-t mt-6 pt-4 text-center"
          style={{ borderColor: `${websiteConfig.backgroundColor}40` }}
        >
          <p
            className="text-sm"
            style={{ color: `${websiteConfig.backgroundColor}99` }}
          >
            {footerData.copyright}
          </p>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="w-full h-full flex gap-5 bg-gray-50 p-5">
      {/* Preview Section */}
      <div className="h-full w-[70%] bg-white rounded-lg p-4 overflow-auto">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode("desktop")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "desktop"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                backgroundColor:
                  viewMode === "desktop" ? primaryColor : "transparent",
              }}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "mobile"
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              style={{
                backgroundColor:
                  viewMode === "mobile" ? primaryColor : "transparent",
              }}
            >
              Mobile
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="flex justify-center items-center w-full">
          <div
            className={`transition-all duration-500 ease-in-out mx-auto`}
            style={{
              width: viewMode === "mobile" ? "22rem" : "100%",
              transform: viewMode === "mobile" ? "scale(0.95)" : "scale(1)",
            }}
          >
            <PreviewComponent isMobile={viewMode === "mobile"} />
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="h-full w-[30%] bg-white rounded-lg p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Footer засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {footerInfo.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{footerInfo.content}</p>

        <div className="space-y-6">
          {/* About Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              About Section
            </h3>
            <textarea
              value={footerData.about.content}
              onChange={(e) => handleAboutChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              rows="3"
              placeholder="About content"
            />
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Useful Links
            </h3>
            {footerData.links.items.map((link, idx) => (
              <input
                key={idx}
                type="text"
                value={link}
                onChange={(e) => handleLinkChange(idx, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
                style={{
                  "--tw-ring-color": primaryColor,
                  focusRingColor: primaryColor,
                }}
                placeholder={`Link ${idx + 1}`}
              />
            ))}
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Contact Info
            </h3>
            <textarea
              value={footerData.contact.description}
              onChange={(e) =>
                handleContactChange("description", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              rows="2"
              placeholder="Contact description"
            />
            <input
              type="text"
              value={footerData.contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent mb-2"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Phone number"
            />
            <input
              type="email"
              value={footerData.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Email address"
            />
          </div>

          {/* Copyright Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Copyright
            </h3>
            <input
              type="text"
              value={footerData.copyright}
              onChange={(e) => handleCopyrightChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:border-transparent"
              style={{
                "--tw-ring-color": primaryColor,
                focusRingColor: primaryColor,
              }}
              placeholder="Copyright text"
            />
          </div>

          {/* Color Preview Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Одоогийн өнгөний тохиргоо
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span>Primary:</span>
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: primaryColor }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Accent:</span>
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: accentColor }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Text:</span>
                <div
                  className="w-6 h-4 rounded border"
                  style={{ backgroundColor: textColor }}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Өнгийг өөрчлөхийн тулд "General Info" хуудас руу очно уу.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveFooterConfig}
          className="w-full text-white py-3 px-4 rounded-md transition-colors font-medium mt-6"
          style={{ backgroundColor: primaryColor }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor = secondaryColor)
          }
          onMouseLeave={(e) => (e.target.style.backgroundColor = primaryColor)}
        >
          Хадгалах
        </button>
      </div>
    </div>
  );
};

export default page;
