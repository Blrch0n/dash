"use client";
import { useState } from "react";

const section2Info = {
  title: "Section 2",
  content:
    "Section 2 нь таны creative spirit болон бүтээлч сэтгэлгээний тухай хэсэг бөгөөд зөвхөн нэг товчлуур агуулна.",
  key: "section2",
};

const DEFAULT_SECTION2_DATA = {
  creativeSpirit: {
    title: "Creative Spirit",
    content:
      "The pieces we make are the free thoughts that come with daily work given a physical form",
  },
  actionButton: {
    text: "Explore Creative Work",
    link: "#",
  },
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section2Data, setSection2Data] = useState(DEFAULT_SECTION2_DATA);

  const handleCreativeSpiritChange = (field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      creativeSpirit: { ...prev.creativeSpirit, [field]: value },
    }));
  };

  const handleButtonChange = (field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      actionButton: { ...prev.actionButton, [field]: value },
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8 min-h-[200px]">
        <div
          className={`flex items-center justify-between ${
            isMobile ? "flex-col gap-8" : "flex-row"
          }`}
        >
          {/* Left Side - Creative Spirit Content */}
          <div className={`${isMobile ? "w-full text-center" : "w-1/2 pr-8"}`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {section2Data.creativeSpirit.title}
            </h1>
            <p
              className={`text-gray-700 ${
                isMobile ? "text-base" : "text-lg"
              } leading-relaxed font-medium`}
            >
              {section2Data.creativeSpirit.content}
            </p>
          </div>

          {/* Right Side - Action Button */}
          <div
            className={`${
              isMobile ? "w-full flex justify-center" : "w-1/2 flex justify-end"
            }`}
          >
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              {section2Data.actionButton.text}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        {/* <div className="mt-12 flex justify-center space-x-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-200"></div>
        </div> */}
      </section>
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
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Desktop
            </button>
            <button
              onClick={() => setViewMode("mobile")}
              className={`px-4 py-2 rounded-md transition-all ${
                viewMode === "mobile"
                  ? "bg-purple-600 text-white shadow-md"
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
          Section 2 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section2Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section2Info.content}</p>

        <div className="space-y-6">
          {/* Creative Spirit Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Creative Spirit Content
            </h3>
            <input
              type="text"
              value={section2Data.creativeSpirit.title}
              onChange={(e) =>
                handleCreativeSpiritChange("title", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
              placeholder="Creative Spirit title"
            />
            <textarea
              value={section2Data.creativeSpirit.content}
              onChange={(e) =>
                handleCreativeSpiritChange("content", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows="4"
              placeholder="Creative Spirit content"
            />
          </div>

          {/* Action Button Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Action Button
            </h3>
            <input
              type="text"
              value={section2Data.actionButton.text}
              onChange={(e) => handleButtonChange("text", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
              placeholder="Button text"
            />
            <input
              type="text"
              value={section2Data.actionButton.link}
              onChange={(e) => handleButtonChange("link", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Button link"
            />
          </div>
        </div>

        {/* Save Button */}
        <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 transition-colors font-medium mt-6">
          Хадгалах
        </button>
      </div>
    </div>
  );
};

export default page;
