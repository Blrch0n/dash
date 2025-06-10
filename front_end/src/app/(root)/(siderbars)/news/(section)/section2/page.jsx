"use client";
import { useState } from "react";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Partners хэсэг бөгөөд таны хамтрагч болон брэндүүдийг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Partners and Brands",
  subtitle:
    "Our team of strategists, designers, and engineers deliver valuable, tangible customer experiences",
  partners: [
    "https://max-themes.net/demos/enside/main/upload/logo-b-2.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-3.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-4.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-7.png",
    "https://max-themes.net/demos/enside/main/upload/logo-b-8.png",
  ],
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section4Data, setSection4Data] = useState(DEFAULT_SECTION4_DATA);

  const handleTitleChange = (field, value) => {
    setSection4Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePartnerChange = (index, value) => {
    setSection4Data((prev) => ({
      ...prev,
      partners: prev.partners.map((partner, i) =>
        i === index ? value : partner
      ),
    }));
  };

  const addPartner = () => {
    setSection4Data((prev) => ({
      ...prev,
      partners: [...prev.partners, ""],
    }));
  };

  const removePartner = (index) => {
    setSection4Data((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== index),
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <div className="w-full h-fit bg-[#fff] py-[60px] sm:py-[80px] lg:py-[110px]">
        <div className="max-w-[1200px] mx-auto w-full h-fit px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 w-full h-fit flex flex-col items-center justify-center">
            <h3 className="text-[#828282] font-semibold text-[12px] sm:text-[14px] lg:text-[16px] uppercase tracking-wider mb-2">
              friends
            </h3>
            <h2 className="text-[32px] sm:text-[48px] lg:text-[72px] w-full sm:w-[480px] lg:w-[570px] text-center text-[#2A2F35] leading-tight mb-4 px-4">
              {section4Data.title}
            </h2>
            <span
              className="block h-1 sm:h-1.5 w-6 sm:w-8 rounded-full mb-4 sm:mb-6 hover:scale-110 transition-transform duration-300"
              style={{
                background: "linear-gradient(135deg, #3452ff 0%, #ad3ed8 100%)",
              }}
            />
            <p className="text-[#808080] w-full sm:w-[480px] lg:w-[570px] text-center text-sm sm:text-base lg:text-lg leading-relaxed px-4">
              {section4Data.subtitle}
            </p>
          </div>

          {/* Logo Grid */}
          <div
            className={`w-full h-fit grid ${
              isMobile
                ? "grid-cols-2 gap-3"
                : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4"
            } p-4 sm:p-6 lg:p-8`}
          >
            {section4Data.partners.map((partner, index) => (
              <div
                key={index}
                className="w-full h-full flex flex-row items-center justify-center p-2 sm:p-3 lg:p-4 hover:scale-[102%] transition-transform duration-300"
              >
                {partner ? (
                  <img
                    src={partner}
                    alt={`Partner logo ${index + 1}`}
                    className="grayscale hover:grayscale-0 w-full max-w-[120px] sm:max-w-[160px] lg:max-w-[210px] h-auto transition-all duration-300 hover:scale-[102%]"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div className="hidden w-full h-24 items-center justify-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🖼️</div>
                    <div className="text-xs">Logo {index + 1}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
          Section 4 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section4Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section4Info.content}</p>

        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Header Content
            </h3>
            <input
              type="text"
              value={section4Data.title}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Section title"
            />
            <textarea
              value={section4Data.subtitle}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Section subtitle"
            />
          </div>

          {/* Partners Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Partners ({section4Data.partners.length})
              </h3>
              <button
                onClick={addPartner}
                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
              >
                + Add
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-3">
              {section4Data.partners.map((partner, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-medium text-gray-600">
                      Partner {index + 1}
                    </h4>
                    {section4Data.partners.length > 1 && (
                      <button
                        onClick={() => removePartner(index)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={partner}
                    onChange={(e) => handlePartnerChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Partner logo URL"
                  />
                  {partner && (
                    <div className="mt-2">
                      <img
                        src={partner}
                        alt={`Partner ${index + 1}`}
                        className="w-20 h-12 object-contain border rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
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
