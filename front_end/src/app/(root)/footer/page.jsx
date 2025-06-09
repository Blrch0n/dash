"use client";
import { useState } from "react";

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

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [footerData, setFooterData] = useState(DEFAULT_FOOTER_DATA);

  const handleAboutChange = (value) => {
    setFooterData((prev) => ({
      ...prev,
      about: { ...prev.about, content: value },
    }));
  };

  const handleNewsChange = (index, field, value) => {
    const newNews = [...footerData.news.items];
    newNews[index] = { ...newNews[index], [field]: value };
    setFooterData((prev) => ({
      ...prev,
      news: { ...prev.news, items: newNews },
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

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <footer className="bg-gray-800 text-white p-6">
        <div
          className={`grid gap-6 ${isMobile ? "grid-cols-1" : "grid-cols-4"}`}
        >
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">
              {footerData.about.title}
            </h3>
            <p
              className={`text-gray-300 ${
                isMobile ? "text-sm" : "text-sm"
              } leading-relaxed`}
            >
              {footerData.about.content}
            </p>
          </div>

          {/* Recent News Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">
              {footerData.news.title}
            </h3>
            <div className="space-y-2">
              {footerData.news.items.map((item, index) => (
                <div key={index}>
                  <p className="text-gray-300 text-sm hover:text-white cursor-pointer transition">
                    {item.title}
                  </p>
                  <p className="text-gray-500 text-xs">{item.date}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Useful Links Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">
              {footerData.links.title}
            </h3>
            <ul className="space-y-1">
              {footerData.links.items.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 text-sm hover:text-white transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">
              {footerData.contact.title}
            </h3>
            <p className="text-gray-300 text-sm">
              {footerData.contact.description}
            </p>
            <div className="space-y-1">
              <p className="text-gray-300 text-sm">
                <span className="text-blue-400">T:</span>{" "}
                {footerData.contact.phone}
              </p>
              <p className="text-gray-300 text-sm">
                <span className="text-blue-400">E:</span>{" "}
                {footerData.contact.email}
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center">
          <p className="text-gray-400 text-sm">{footerData.copyright}</p>
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
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "mobile"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="About content"
            />
          </div>

          {/* News Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Recent News
            </h3>
            {footerData.news.items.map((item, idx) => (
              <div key={idx} className="space-y-2 mb-3">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleNewsChange(idx, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`News title ${idx + 1}`}
                />
                <input
                  type="text"
                  value={item.date}
                  onChange={(e) =>
                    handleNewsChange(idx, "date", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Date"
                />
              </div>
            ))}
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              rows="2"
              placeholder="Contact description"
            />
            <input
              type="text"
              value={footerData.contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Phone number"
            />
            <input
              type="email"
              value={footerData.contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email address"
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium mt-6">
          Хадгалах
        </button>
      </div>
    </div>
  );
};

export default page;
