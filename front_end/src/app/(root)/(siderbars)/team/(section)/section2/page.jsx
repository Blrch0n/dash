"use client";
import { useState } from "react";
import { TbNotebook } from "react-icons/tb";
import { AiFillLike } from "react-icons/ai";
import {
  FaReact,
  FaNodeJs,
  FaDocker,
  FaGitAlt,
  FaAws,
  FaDatabase,
} from "react-icons/fa";
import { SiMongodb, SiGraphql, SiTypescript } from "react-icons/si";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Technologies хэсэг бөгөөд таны ашигладаг технологи болон багажуудыг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Technology Stack",
  subtitle: "Our Concept",
  description:
    "Cutting-edge tools and technologies we use to deliver exceptional results and build modern applications",
  backgroundImage:
    "https://images.unsplash.com/photo-1565945985125-a59c660a9932?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0",
  projects: [
    {
      id: 1,
      title: "Parallax Section",
      description:
        "This is how we can be sure that your brand expands according to market goals and continues to be attractive in the future",
      icon: (
        <TbNotebook className="text-4xl group-hover:text-black text-[#6d83ff]" />
      ),
    },
    {
      id: 2,
      title: "Responsive Design",
      description:
        "It is fundamental to have a strategy that takes into consideration the features that are important to the client",
      icon: (
        <AiFillLike className="text-4xl group-hover:text-black text-[#6d83ff]" />
      ),
    },
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

  const handleProjectChange = (index, field, value) => {
    setSection4Data((prev) => ({
      ...prev,
      projects: prev.projects.map((item, i) =>
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
      <div
        className="w-full min-h-screen flex flex-col px-4 sm:px-8 md:px-12 lg:px-[100px] lg:flex-row items-center justify-between bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: `url(${section4Data.backgroundImage})` }}
      >
        {/* Background overlay for better text readability */}
        <div className="absolute inset-0 bg-[#00000080] bg-opacity-30"></div>

        {/* Content Container */}
        <div className="relative z-10 w-full lg:w-[45%] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12">
          {/* Main Content Card */}
          <div className="w-full rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 transform transition-all duration-300">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-[#b8b8b8] font-semibold text-sm sm:text-[16px] uppercase tracking-wider mb-2">
                {section4Data.subtitle}
              </h3>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                {section4Data.title}
              </h2>
              <span
                className="block h-1.5 w-16 rounded-full mb-4 sm:mb-6"
                style={{
                  background:
                    "linear-gradient(135deg, #3452ff 0%, #ad3ed8 100%)",
                }}
              ></span>
              <p className="text-[#ffffff] text-sm sm:text-base lg:text-lg leading-relaxed">
                {section4Data.description}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-gray-200 my-6 sm:my-8" />

            {/* Technologies Grid */}
            <div
              className={`grid ${
                isMobile ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
              } mt-8 gap-6 sm:gap-8`}
            >
              {section4Data.projects
                .slice(0, isMobile ? 4 : 8)
                .map((data, index) => (
                  <div
                    className="flex flex-col space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl transition-all duration-500 group"
                    key={data.id}
                  >
                    <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-transparent border border-[#6d83ff] rounded-xl hover:border-white hover:bg-white transition-colors duration-300">
                      {data.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white transition-colors duration-300">
                      {data.title}
                    </h3>
                    <p className="text-[#b8b8b8] text-sm sm:text-[16px] leading-relaxed">
                      {data.description}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Image Container - Hidden on mobile, visible on lg+ screens */}
        <div className="hidden lg:flex relative z-10 w-[50%] flex-col items-center justify-center p-6 lg:p-12">
          <div className="relative group w-full">
            <img
              src="https://max-themes.net/demos/enside/main/upload/images-ipad-phone.png"
              alt="Technology Stack Mockup"
              className="w-full h-auto drop-shadow-2xl transform transition-all duration-500 filter"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
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
            <input
              type="text"
              value={section4Data.subtitle}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Section subtitle"
            />
            <textarea
              value={section4Data.description}
              onChange={(e) => handleTitleChange("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              rows="3"
              placeholder="Section description"
            />
            <input
              type="text"
              value={section4Data.backgroundImage}
              onChange={(e) =>
                handleTitleChange("backgroundImage", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Background image URL"
            />
          </div>

          {/* Technologies Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Technologies ({section4Data.projects.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section4Data.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Technology {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Technology name"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Technology description"
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
