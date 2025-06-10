"use client";
import { useState } from "react";

const section2Info = {
  title: "Section 2",
  content:
    "Section 2 нь Capabilities хэсэг бөгөөд таны чадварууд болон үйлчилгээнүүдийг харуулна.",
  key: "section2",
};

const DEFAULT_SECTION2_DATA = {
  title: "Capabilities",
  subtitle: "Creative concept or System Design",
  description:
    "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  image:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
  capabilities: [
    {
      title: "Tailored",
      description:
        "We believe in a collaborative partnership where we work with you to create the perfect solution",
    },
    {
      title: "Strategic",
      description:
        "Our energy is focus in inspiring projects, activation campaigns and influence strategies",
    },
    {
      title: "Quality",
      description:
        "Development – every solution needs a conceptual design that the further work will be based on.",
    },
    {
      title: "Complete",
      description:
        "We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
    },
  ],
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section2Data, setSection2Data] = useState(DEFAULT_SECTION2_DATA);

  const handleTitleChange = (field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCapabilityChange = (index, field, value) => {
    setSection2Data((prev) => ({
      ...prev,
      capabilities: prev.capabilities.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8 min-h-[800px]">
        {/* Header */}
        <div className="mb-12">
          {/* Content and Image Section */}
          <div
            className={`flex ${
              isMobile ? "flex-col" : "flex-row"
            } items-center gap-8 max-w-6xl mx-auto mb-8`}
          >
            <div className={`${isMobile ? "w-full" : "w-1/2"} text-left`}>
              <div className="text-start">
                <h1 className="text-4xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {section2Data.title}
                </h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  {section2Data.subtitle}
                </h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {section2Data.description}
              </p>
            </div>
            <div
              className={`${isMobile ? "w-full" : "w-1/2"} flex justify-center`}
            >
              <img
                src={section2Data.image}
                alt="Capabilities"
                className="w-full max-w-md h-64 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden w-full max-w-md h-64 items-center justify-center text-gray-500 bg-gray-100 rounded-lg shadow-lg">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>

          {/* Title and Subtitle Section - Below the content */}
        </div>{" "}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
        {/* Capabilities Section */}
        <div className="max-w-6xl mx-auto">
          {/* All capabilities in a single row */}
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-4"} gap-8`}
          >
            {section2Data.capabilities.map((capability, index) => (
              <div
                key={index}
                className="bg-white text-center rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-blue-600 mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>
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
          Section 2 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section2Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section2Info.content}</p>

        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Header Content
            </h3>
            <input
              type="text"
              value={section2Data.title}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Section title"
            />
            <input
              type="text"
              value={section2Data.subtitle}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Section subtitle"
            />
            <textarea
              value={section2Data.description}
              onChange={(e) => handleTitleChange("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              rows="4"
              placeholder="Section description"
            />
            <input
              type="text"
              value={section2Data.image}
              onChange={(e) => handleTitleChange("image", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Image URL"
            />
          </div>

          {/* Capabilities Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Capabilities ({section2Data.capabilities.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section2Data.capabilities.map((capability, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Capability {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={capability.title}
                    onChange={(e) =>
                      handleCapabilityChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Capability title"
                  />
                  <textarea
                    value={capability.description}
                    onChange={(e) =>
                      handleCapabilityChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Capability description"
                  />
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
