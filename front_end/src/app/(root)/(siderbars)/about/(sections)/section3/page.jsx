"use client";
import { useState } from "react";

const section3Info = {
  title: "Section 3",
  content:
    "Section 3 нь таны unique space болон creative creativity-ийн тухай хэсэг бөгөөд зүүн талд accordion, баруун талд зураг агуулна.",
  key: "section3",
};

const DEFAULT_SECTION3_DATA = {
  uniqueSpace: {
    title: "UNIQUE SPACE",
    subtitle: "Slight Differences Can Trigger Creativity",
    description:
      "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  },
  accordion: [
    {
      id: 1,
      title: "Design Excellence",
      content:
        "We create visually stunning and user-friendly designs that capture your brand essence and engage your audience effectively.",
    },
    {
      id: 2,
      title: "Technology Innovation",
      content:
        "Our cutting-edge technology solutions help businesses stay ahead in the rapidly evolving digital landscape.",
    },
    {
      id: 3,
      title: "Digital Strategy",
      content:
        "We develop comprehensive digital strategies that align with your business goals and drive measurable results.",
    },
  ],
  image: {
    src: "https://i.pinimg.com/736x/dd/1c/5b/dd1c5b14fc8446a4741fdb979c4fe3cc.jpg",
    alt: "Creative workspace",
  },
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section3Data, setSection3Data] = useState(DEFAULT_SECTION3_DATA);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleUniqueSpaceChange = (field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      uniqueSpace: { ...prev.uniqueSpace, [field]: value },
    }));
  };

  const handleAccordionChange = (index, field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      accordion: prev.accordion.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // ...existing code...
  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 min-h-[600px]">
        <div
          className={`flex ${
            isMobile ? "flex-col gap-6" : "flex-row gap-8"
          } h-full`}
        >
          {/* Left Side - Content */}
          <div className={`${isMobile ? "w-full" : "w-1/2"} flex flex-col`}>
            {/* Top Section - Unique Space */}
            <div className="mb-6">
              <h1 className="text-sm font-bold text-gray-600 mb-2 tracking-wider">
                {section3Data.uniqueSpace.title}
              </h1>
              <h2
                className={`${
                  isMobile ? "text-2xl" : "text-3xl"
                } font-bold text-gray-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}
              >
                {section3Data.uniqueSpace.subtitle}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {section3Data.uniqueSpace.description}
              </p>
            </div>

            {/* Bottom Section - Accordion */}
            <div className="space-y-2">
              {section3Data.accordion.map((item, index) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full px-3 py-2 text-left bg-white hover:bg-gray-50 transition-colors flex justify-between items-center"
                  >
                    <span
                      className={`font-medium text-gray-800 ${
                        isMobile ? "text-sm" : ""
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`transform transition-transform ${
                        activeAccordion === index ? "rotate-180" : ""
                      }`}
                    >
                      ▼
                    </span>
                  </button>
                  {activeAccordion === index && (
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-600 text-xs">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div
            className={`${
              isMobile ? "w-full h-48" : "w-1/2"
            } flex items-center justify-center`}
          >
            <div
              className={`w-full ${
                isMobile ? "h-48" : "h-full min-h-[300px]"
              } bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg flex items-center justify-center overflow-hidden`}
            >
              <img
                src={section3Data.image.src}
                alt={section3Data.image.alt}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden w-full h-full items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <div>Image Placeholder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  // ...existing code...

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
          Section 3 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section3Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section3Info.content}</p>

        <div className="space-y-6">
          {/* Unique Space Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Unique Space Content
            </h3>
            <input
              type="text"
              value={section3Data.uniqueSpace.title}
              onChange={(e) => handleUniqueSpaceChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Unique Space title"
            />
            <input
              type="text"
              value={section3Data.uniqueSpace.subtitle}
              onChange={(e) =>
                handleUniqueSpaceChange("subtitle", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Subtitle"
            />
            <textarea
              value={section3Data.uniqueSpace.description}
              onChange={(e) =>
                handleUniqueSpaceChange("description", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Description"
            />
          </div>

          {/* Accordion Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Accordion Items
            </h3>
            {section3Data.accordion.map((item, index) => (
              <div
                key={item.id}
                className="border border-gray-200 rounded-md p-3 mb-3"
              >
                <h4 className="text-xs font-medium text-gray-600 mb-2">
                  Item {index + 1}
                </h4>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    handleAccordionChange(index, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="Accordion title"
                />
                <textarea
                  value={item.content}
                  onChange={(e) =>
                    handleAccordionChange(index, "content", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Accordion content"
                />
              </div>
            ))}
          </div>

          {/* Image Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Image Settings
            </h3>
            <input
              type="text"
              value={section3Data.image.src}
              onChange={(e) =>
                setSection3Data((prev) => ({
                  ...prev,
                  image: { ...prev.image, src: e.target.value },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Image URL"
            />
            <input
              type="text"
              value={section3Data.image.alt}
              onChange={(e) =>
                setSection3Data((prev) => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Image alt text"
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
