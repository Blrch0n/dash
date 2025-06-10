"use client";
import { useState } from "react";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Technologies хэсэг бөгөөд таны ашигладаг технологи болон багажуудыг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Technologies",
  subtitle: "TECH STACK",
  description:
    "Meet our powerful tech stack and tools we use to deliver exceptional results",
  projects: [
    {
      id: 1,
      title: "React.js",
      position:
        "A JavaScript library for building user interfaces with component-based architecture and virtual DOM for optimal performance.",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Node.js",
      position:
        "A JavaScript runtime built on Chrome's V8 engine for scalable server-side applications and real-time web services.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "MongoDB",
      position:
        "A NoSQL document database that provides high performance, high availability, and easy scalability for modern applications.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "AWS Cloud",
      position:
        "Amazon Web Services cloud platform providing reliable, scalable, and inexpensive cloud computing services worldwide.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Docker",
      position:
        "A containerization platform that enables developers to package applications with all dependencies for consistent deployment.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Git & GitHub",
      position:
        "Version control system and collaborative platform for tracking changes and managing code repositories effectively.",
      image:
        "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      title: "TypeScript",
      position:
        "A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "GraphQL",
      position:
        "A query language for APIs and runtime for executing queries with existing data, providing efficient data loading.",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
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
      <div className="w-full h-fit flex flex-col pt-[100px] gap-12 items-center justify-center bg-[#F5F5F5]">
        {/* Header Section */}
        <div className="w-full h-fit flex flex-col items-center gap-2">
          <h3 className="text-[#828282] text-[16px] uppercase">
            {section4Data.subtitle}
          </h3>
          <h2 className="text-[32px] sm:text-[72px] text-[#2A2F35]">
            {section4Data.title}
          </h2>
          <p className="text-[18px] text-center sm:text-base text-[#999999]">
            {section4Data.description}
          </p>
        </div>

        {/* Technologies Grid */}
        <div
          className={`w-full grid ${
            isMobile
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          } items-center justify-center bg-white text-black`}
        >
          {section4Data.projects.map((data, index) => (
            <div
              key={data.id}
              className="flex flex-col items-center relative h-[420px] w-full justify-center text-center p-4 group overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              style={{
                backgroundImage: `url(${data.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 z-0 bg-transparent group-hover:bg-[#000000c2] transition-all duration-300 ease-in-out" />

              <h3 className="text-lg text-transparent duration-300 transition-all ease-in-out group-hover:text-white font-semibold relative z-10">
                {data.title}
              </h3>

              <p className="text-transparent duration-300 transition-all ease-in-out group-hover:text-white relative z-10 px-4">
                {data.position}
              </p>
            </div>
          ))}
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
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Section description"
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
                    value={project.position}
                    onChange={(e) =>
                      handleProjectChange(index, "position", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    rows="3"
                    placeholder="Technology description"
                  />
                  <input
                    type="text"
                    value={project.image}
                    onChange={(e) =>
                      handleProjectChange(index, "image", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Image URL"
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
