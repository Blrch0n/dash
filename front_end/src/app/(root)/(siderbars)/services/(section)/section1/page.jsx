"use client";
import { useState } from "react";
import { IoUmbrellaOutline } from "react-icons/io5";
import { PiLego } from "react-icons/pi";
import { TbHammer } from "react-icons/tb";
import { PiStudent } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";
import { RiToolsFill } from "react-icons/ri";

const section1Info = {
  title: "Section 1",
  content:
    "Section 1 нь Services Overview хэсэг бөгөөд таны үйлчилгээний төрлүүдийг харуулна.",
  key: "section1",
};

const DEFAULT_SECTION1_DATA = {
  title: "Capabilities",
  subtitle: "Taking care of the new products's launch and user support",
  categories: ["Prototypes", "Development", "Support", "Design"],
  mainText: "All you need is Enside, a modern & simple template",
  description:
    "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  // Add statistics data
  statistics: {
    mainTitle: "We create human experience in a digital world",
    stats: [
      {
        number: "97",
        label: "Percent of users recommend us to friends and family",
      },
      {
        number: "350",
        label: "Companies have shifted to using us recently",
      },
      {
        number: "35",
        label: "We deliver so much more than the competition",
      },
    ],
  },
  sections: {
    // ...existing sections code...
    Prototypes: {
      leftContent: {
        title: "All you need is Enside, a modern & simple template",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      rightContent: [
        {
          icon: <IoUmbrellaOutline />,
          title: "We bring the brand to life",
          subtitle: "We only hire great people who strike to push their idea",
          backgroundImage:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        },
        {
          icon: <PiLego />,
          title: "Build Your Dream",
          subtitle: "We only hire great people who strike to push their idea",
          backgroundImage:
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
        },
      ],
    },
    Development: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: <TbHammer />,
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <PiStudent />,
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <FaRegUserCircle />,
          title: "Great Service",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <RiToolsFill />,
          title: "Fast Support",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
    },
    Support: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: <TbHammer />,
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <PiStudent />,
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <FaRegUserCircle />,
          title: "Great Service",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <RiToolsFill />,
          title: "Fast Support",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
    },
    Design: {
      leftContent: {
        title: "How to Start your Business",
        description:
          "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
      },
      services: [
        {
          icon: <TbHammer />,
          title: "Design & Developing",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
        {
          icon: <PiStudent />,
          title: "Fully Responsive",
          description:
            "Creative concept – every solution needs a conceptual design that the further work will be based on.",
        },
      ],
      rightCard: {
        icon: <PiLego />,
        title: "We bring the brand to life",
        subtitle: "We only hire great people who strike to push their idea",
        backgroundImage:
          "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      },
    },
  },
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section1Data, setSection1Data] = useState(DEFAULT_SECTION1_DATA);
  const [activeTab, setActiveTab] = useState("Prototypes");

  const handleTitleChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-8 min-h-[800px]">
        {/* Header */}
        <div className="text-center mb-12 opacity-100">
          <p className="text-gray-500 text-sm uppercase mb-2">TECHNOLOGY</p>
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            {section1Data.title}
          </h1>
          <div className="w-9 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-4 rounded-full"></div>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            {section1Data.subtitle}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div
            className={`grid ${
              isMobile ? "grid-cols-2" : "grid-cols-4"
            } gap-2 p-4 bg-white rounded-lg shadow-md`}
          >
            {section1Data.categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={`border py-3 px-4 min-w-[120px] rounded-lg text-sm font-medium transition-all duration-200 ease-in-out ${
                  activeTab === category
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-transparent text-gray-700 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="opacity-100 transform translate-y-0">
          {/* ...existing tab content code... */}
          {activeTab === "Prototypes" && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-2/5"
                } flex flex-col gap-6`}
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  {section1Data.sections.Prototypes.leftContent.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section1Data.sections.Prototypes.leftContent.description}
                </p>
              </div>

              {/* Right Cards */}
              <div
                className={`${isMobile ? "w-full" : "w-3/5"} flex ${
                  isMobile ? "flex-col" : "flex-row"
                } gap-6`}
              >
                {section1Data.sections.Prototypes.rightContent.map(
                  (card, index) => (
                    <div
                      key={index}
                      className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300"
                      style={{
                        backgroundImage: `url(${card.backgroundImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-[#00000080] bg-opacity-50"></div>
                      <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center text-white">
                        <div className="text-4xl mb-4">{card.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                        <p className="text-sm">{card.subtitle}</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {(activeTab === "Development" || activeTab === "Support") && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-2/5"
                } flex flex-col gap-6`}
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  {section1Data.sections[activeTab].leftContent.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section1Data.sections[activeTab].leftContent.description}
                </p>
              </div>

              {/* Right Services Grid */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-3/5"
                } grid grid-cols-1 sm:grid-cols-2 gap-6`}
              >
                {section1Data.sections[activeTab].services.map(
                  (service, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 hover:-translate-y-1 transition-transform duration-300"
                    >
                      <div className="text-2xl text-blue-600 hover:scale-110 transition-transform duration-200">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-800">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {activeTab === "Design" && (
            <div
              className={`max-w-6xl mx-auto flex ${
                isMobile ? "flex-col" : "flex-row"
              } items-center gap-8`}
            >
              {/* Left Content */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-1/3"
                } flex flex-col gap-6`}
              >
                <h2 className="text-3xl font-bold text-gray-800">
                  {section1Data.sections.Design.leftContent.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section1Data.sections.Design.leftContent.description}
                </p>
              </div>

              {/* Middle Services */}
              <div
                className={`${
                  isMobile ? "w-full" : "w-1/3"
                } flex flex-col gap-6`}
              >
                {section1Data.sections.Design.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 hover:-translate-y-1 transition-transform duration-300"
                  >
                    <div className="text-2xl text-blue-600 hover:scale-110 transition-transform duration-200">
                      {service.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {service.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Card */}
              <div className={`${isMobile ? "w-full" : "w-1/3"}`}>
                <div
                  className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 transition-transform duration-300"
                  style={{
                    backgroundImage: `url(${section1Data.sections.Design.rightCard.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-[#00000070] bg-opacity-50"></div>
                  <div className="relative z-10 p-8 h-full flex flex-col items-center justify-center text-center text-white">
                    <div className="text-4xl mb-4">
                      {section1Data.sections.Design.rightCard.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {section1Data.sections.Design.rightCard.title}
                    </h3>
                    <p className="text-sm">
                      {section1Data.sections.Design.rightCard.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        <div className="mt-16 pt-16 border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`${
                isMobile ? "text-2xl" : "text-3xl"
              } font-bold text-center mb-12 text-gray-800`}
            >
              {section1Data.statistics.mainTitle}
            </h2>
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-3"
              } gap-8`}
            >
              {section1Data.statistics.stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div
                    className={`${
                      isMobile ? "text-4xl" : "text-5xl"
                    } font-bold text-blue-600 mb-4`}
                  >
                    {stat.number}
                  </div>
                  <p
                    className={`${
                      isMobile ? "text-sm" : "text-base"
                    } text-gray-600 leading-relaxed`}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
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
          Section 1 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section1Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section1Info.content}</p>

        <div className="space-y-6">
          {/* View Mode Indicator */}
          <div className="bg-gray-100 p-2 rounded-md">
            <p className="text-sm text-gray-600">
              Editing for:{" "}
              <span className="font-medium capitalize">{viewMode}</span> View
            </p>
          </div>

          {/* Header Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Header Content
            </h3>
            <input
              type="text"
              value={section1Data.title}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Section title"
            />
            <textarea
              value={section1Data.subtitle}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="2"
              placeholder="Section subtitle"
            />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Categories
            </h3>
            <input
              type="text"
              value={section1Data.categories.join(", ")}
              onChange={(e) => {
                const categories = e.target.value
                  .split(",")
                  .map((cat) => cat.trim())
                  .filter((cat) => cat);
                handleTitleChange("categories", categories);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Categories (comma separated)"
            />
          </div>

          {/* Statistics Section Editor */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Statistics Section
            </h3>
            <input
              type="text"
              value={section1Data.statistics.mainTitle}
              onChange={(e) => {
                setSection1Data((prev) => ({
                  ...prev,
                  statistics: {
                    ...prev.statistics,
                    mainTitle: e.target.value,
                  },
                }));
              }}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
              placeholder="Statistics main title"
            />

            {section1Data.statistics.stats.map((stat, index) => (
              <div
                key={index}
                className="space-y-2 mb-4 p-3 bg-gray-50 rounded-md"
              >
                <label className="text-xs text-gray-600">
                  Statistic {index + 1}
                </label>
                <input
                  type="text"
                  value={stat.number}
                  onChange={(e) => {
                    setSection1Data((prev) => ({
                      ...prev,
                      statistics: {
                        ...prev.statistics,
                        stats: prev.statistics.stats.map((s, i) =>
                          i === index ? { ...s, number: e.target.value } : s
                        ),
                      },
                    }));
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number"
                />
                <textarea
                  value={stat.label}
                  onChange={(e) => {
                    setSection1Data((prev) => ({
                      ...prev,
                      statistics: {
                        ...prev.statistics,
                        stats: prev.statistics.stats.map((s, i) =>
                          i === index ? { ...s, label: e.target.value } : s
                        ),
                      },
                    }));
                  }}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="2"
                  placeholder="Description"
                />
              </div>
            ))}
          </div>

          {/* Layout Configuration */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Layout Settings
            </h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">
                  Categories per row ({viewMode}):
                </span>
                <select
                  value={viewMode === "mobile" ? 2 : 4}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                  disabled
                >
                  <option value={viewMode === "mobile" ? 2 : 4}>
                    {viewMode === "mobile" ? "2 columns" : "4 columns"}
                  </option>
                </select>
              </label>
              <label className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">
                  Statistics per row ({viewMode}):
                </span>
                <select
                  value={viewMode === "mobile" ? 1 : 3}
                  className="text-xs border border-gray-300 rounded px-2 py-1"
                  disabled
                >
                  <option value={viewMode === "mobile" ? 1 : 3}>
                    {viewMode === "mobile" ? "1 column" : "3 columns"}
                  </option>
                </select>
              </label>
            </div>
          </div>

          {/* Active Tab Content Editor */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {activeTab} Tab Content
            </h3>

            {/* Left Content Editor */}
            <div className="space-y-3 mb-4">
              <h4 className="text-xs font-medium text-gray-600">
                Left Content
              </h4>
              <input
                type="text"
                value={section1Data.sections[activeTab].leftContent.title}
                onChange={(e) => {
                  setSection1Data((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      [activeTab]: {
                        ...prev.sections[activeTab],
                        leftContent: {
                          ...prev.sections[activeTab].leftContent,
                          title: e.target.value,
                        },
                      },
                    },
                  }));
                }}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Left section title"
              />
              <textarea
                value={section1Data.sections[activeTab].leftContent.description}
                onChange={(e) => {
                  setSection1Data((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      [activeTab]: {
                        ...prev.sections[activeTab],
                        leftContent: {
                          ...prev.sections[activeTab].leftContent,
                          description: e.target.value,
                        },
                      },
                    },
                  }));
                }}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                placeholder="Left section description"
              />
            </div>

            {/* Responsive Layout Info */}
            <div className="bg-blue-50 p-3 rounded-md mb-4">
              <p className="text-xs text-blue-700">
                <strong>Current Layout ({viewMode}):</strong>
                <br />
                {viewMode === "mobile"
                  ? "Stacked vertically for mobile view"
                  : activeTab === "Design"
                  ? "Three column layout (Left content | Services | Right card)"
                  : "Two column layout (Left content | Right content)"}
              </p>
            </div>
          </div>

          {/* Mobile-specific adjustments note */}
          {viewMode === "mobile" && (
            <div className="bg-yellow-50 p-3 rounded-md">
              <p className="text-xs text-yellow-700">
                <strong>Mobile Optimizations:</strong>
                <br />
                • Categories: 2 per row
                <br />
                • Layout: Stacked vertically
                <br />
                • Cards: Full width
                <br />• Statistics: 1 per row
              </p>
            </div>
          )}
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
