"use client";
import { useState } from "react";

const section4Info = {
  title: "Section 13",
  content:
    "Section 13 нь Get in touch хэсэг бөгөөд хэрэглэгчдийг холбоо барих хэсэг руу чиглүүлнэ.",
  key: "section13",
};

const DEFAULT_SECTION13_DATA = {
  title: "Get in touch",
  subtitle: "Want to Know More About Us? Get In Touch",
  buttonText: "See all Features",
  gradientColors: {
    background: "linear-gradient(to right, #664ed3 0%, #87d14b 100%)",
    button: "linear-gradient(to right, #9888ef 0%, #8978d3 100%)",
  },
  textColors: {
    title: "#ffffff",
    subtitle: "#b8b8b8",
    button: "#ffffff",
  },
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section13Data, setSection13Data] = useState(DEFAULT_SECTION13_DATA);

  const handleDataChange = (field, value) => {
    setSection13Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (category, field, value) => {
    setSection13Data((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <div
        className="w-full h-fit"
        style={{
          background: section13Data.gradientColors.background,
        }}
      >
        <div
          className={`max-w-[1200px] w-full mx-auto h-fit flex ${
            isMobile ? "flex-col" : "flex-col md:flex-row"
          } items-center justify-between p-4 md:p-8 gap-6 md:gap-0`}
        >
          <div className="text-center md:text-left">
            <h2
              className={`text-[24px] ${
                isMobile ? "text-[20px]" : "md:text-[30px]"
              } mb-2`}
              style={{ color: section13Data.textColors.title }}
            >
              {section13Data.title}
            </h2>
            <p
              className={`text-sm ${isMobile ? "text-xs" : "md:text-base"}`}
              style={{ color: section13Data.textColors.subtitle }}
            >
              {section13Data.subtitle}
            </p>
          </div>
          <button
            style={{
              background: section13Data.gradientColors.button,
              color: section13Data.textColors.button,
            }}
            className={`py-3 px-6 md:px-8 rounded-[5px] ${
              isMobile ? "w-full" : "sm:w-fit w-full md:w-auto"
            } text-sm md:text-base hover:shadow-lg active:scale-95 transition-all duration-200`}
          >
            {section13Data.buttonText}
          </button>
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
          Section 13 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section4Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section4Info.content}</p>

        <div className="space-y-6">
          {/* Text Content */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Text Content
            </h3>
            <input
              type="text"
              value={section13Data.title}
              onChange={(e) => handleDataChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Main title"
            />
            <textarea
              value={section13Data.subtitle}
              onChange={(e) => handleDataChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              rows="2"
              placeholder="Subtitle"
            />
            <input
              type="text"
              value={section13Data.buttonText}
              onChange={(e) => handleDataChange("buttonText", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Button text"
            />
          </div>

          {/* Colors */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Text Colors
            </h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Title Color
                </label>
                <input
                  type="color"
                  value={section13Data.textColors.title}
                  onChange={(e) =>
                    handleNestedChange("textColors", "title", e.target.value)
                  }
                  className="w-full h-8 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Subtitle Color
                </label>
                <input
                  type="color"
                  value={section13Data.textColors.subtitle}
                  onChange={(e) =>
                    handleNestedChange("textColors", "subtitle", e.target.value)
                  }
                  className="w-full h-8 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Button Text Color
                </label>
                <input
                  type="color"
                  value={section13Data.textColors.button}
                  onChange={(e) =>
                    handleNestedChange("textColors", "button", e.target.value)
                  }
                  className="w-full h-8 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Gradients */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Gradient Styles
            </h3>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Background Gradient
                </label>
                <input
                  type="text"
                  value={section13Data.gradientColors.background}
                  onChange={(e) =>
                    handleNestedChange(
                      "gradientColors",
                      "background",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                  placeholder="linear-gradient(to right, #664ed3 0%, #87d14b 100%)"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Button Gradient
                </label>
                <input
                  type="text"
                  value={section13Data.gradientColors.button}
                  onChange={(e) =>
                    handleNestedChange(
                      "gradientColors",
                      "button",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                  placeholder="linear-gradient(to right, #9888ef 0%, #8978d3 100%)"
                />
              </div>
            </div>
          </div>

          {/* Preset Gradients */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Preset Gradients
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  handleNestedChange(
                    "gradientColors",
                    "background",
                    "linear-gradient(to right, #667eea 0%, #764ba2 100%)"
                  )
                }
                className="h-8 rounded-md"
                style={{
                  background:
                    "linear-gradient(to right, #667eea 0%, #764ba2 100%)",
                }}
              />
              <button
                onClick={() =>
                  handleNestedChange(
                    "gradientColors",
                    "background",
                    "linear-gradient(to right, #f093fb 0%, #f5576c 100%)"
                  )
                }
                className="h-8 rounded-md"
                style={{
                  background:
                    "linear-gradient(to right, #f093fb 0%, #f5576c 100%)",
                }}
              />
              <button
                onClick={() =>
                  handleNestedChange(
                    "gradientColors",
                    "background",
                    "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)"
                  )
                }
                className="h-8 rounded-md"
                style={{
                  background:
                    "linear-gradient(to right, #4facfe 0%, #00f2fe 100%)",
                }}
              />
              <button
                onClick={() =>
                  handleNestedChange(
                    "gradientColors",
                    "background",
                    "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)"
                  )
                }
                className="h-8 rounded-md"
                style={{
                  background:
                    "linear-gradient(to right, #43e97b 0%, #38f9d7 100%)",
                }}
              />
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
