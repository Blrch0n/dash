"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Technologies хэсэг бөгөөд таны ашигладаг технологи болон багажуудыг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Technologies",
  subtitle:
    "Cutting-edge tools and technologies we use to deliver exceptional results.",
  projects: [
    {
      id: 1,
      title: "React.js",
      category: "Frontend Framework",
      tags: ["JavaScript", "UI", "Components"],
      description: "Modern frontend development",
      image:
        "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Node.js",
      category: "Backend Runtime",
      tags: ["JavaScript", "Server", "API"],
      description: "Server-side development",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "MongoDB",
      category: "Database",
      tags: ["NoSQL", "Database", "Storage"],
      description: "Modern database solution",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "AWS",
      category: "Cloud Platform",
      tags: ["Cloud", "Hosting", "Scalability"],
      description: "Cloud infrastructure",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Docker",
      category: "Containerization",
      tags: ["DevOps", "Deployment"],
      description: "Container management",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Git",
      category: "Version Control",
      tags: ["VCS"],
      description: "Code version control",
      image:
        "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=400&h=300&fit=crop",
    },
    {
      id: 7,
      title: "TypeScript",
      category: "Programming Language",
      tags: ["JavaScript", "Types", "Development"],
      description: "Type-safe development",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
    {
      id: 8,
      title: "GraphQL",
      category: "API Technology",
      tags: ["API", "Query", "Data"],
      description: "Modern API development",
      image:
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    },
  ],
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section4Data, setSection4Data] = useState(DEFAULT_SECTION4_DATA);
  const [slidesPerView, setSlidesPerView] = useState(1);

  // Handle responsive slides per view
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setSlidesPerView(4);
      } else if (width >= 768) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleTagsChange = (index, tagsString) => {
    const tags = tagsString
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    handleProjectChange(index, "tags", tags);
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <div className="w-full h-fit bg-white py-16 sm:py-20 md:py-24 lg:py-28 xl:py-28">
        <div className="w-full max-w-7xl mx-auto h-fit bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 sm:mb-10 md:mb-12 w-full h-fit flex flex-col items-center justify-center">
            <h3 className="text-gray-500 font-semibold text-sm sm:text-base uppercase tracking-wider mb-2">
              Technologies
            </h3>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl w-full sm:w-[90%] md:w-[80%] lg:w-[570px] text-center text-gray-800 leading-tight mb-4 px-4">
              {section4Data.title}
            </h2>
            <div
              className="block h-1 sm:h-1.5 w-6 sm:w-8 rounded-full mb-4 sm:mb-6"
              style={{
                background: "linear-gradient(135deg, #3452ff 0%, #ad3ed8 100%)",
              }}
            />
            <p className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed text-center px-4">
              {section4Data.subtitle}
            </p>
          </div>

          {/* Swiper Section */}
          <div className="w-full relative">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{
                el: ".swiper-pagination-custom",
                clickable: true,
                renderBullet: (index, className) => {
                  return `<span class="${className} w-[25px] h-[5px] rounded-full transition-all duration-300 cursor-pointer"></span>`;
                },
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: isMobile ? 1 : 3,
                  spaceBetween: 24,
                },
                1280: {
                  slidesPerView: isMobile ? 1 : 4,
                  spaceBetween: 24,
                },
              }}
              className="w-full"
            >
              {section4Data.projects.map((project, index) => (
                <SwiperSlide key={project.id}>
                  <div className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-80 sm:h-84 md:h-88 lg:h-80 xl:h-84">
                    {/* Project Image */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-200 to-purple-200 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="hidden w-full h-full items-center justify-center text-gray-500 absolute inset-0">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🖼️</div>
                          <div>Image Placeholder</div>
                        </div>
                      </div>
                      <div className="absolute inset-0 z-0 bg-black opacity-10 group-hover:opacity-5 transition-opacity duration-300" />
                    </div>

                    {/* Project Info */}
                    <div className="p-4 relative z-10 group-hover:-translate-y-1 transition-transform duration-200">
                      <div className="mb-2">
                        <span className="text-xs text-blue-600 font-medium">
                          {project.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {project.title}
                      </h3>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors duration-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-200">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination */}
            <div className="swiper-pagination-custom flex justify-center mt-6 sm:mt-8 space-x-2"></div>
          </div>
        </div>

        <style jsx global>{`
          .swiper-pagination-custom .swiper-pagination-bullet {
            background: #d1d5db;
            opacity: 1;
            transition: all 0.3s ease;
          }
          .swiper-slide {
            background: transparent !important;
          }
          .swiper-pagination-custom .swiper-pagination-bullet:hover {
            background: #9ca3af;
          }
          .swiper-pagination-custom .swiper-pagination-bullet-active {
            background: linear-gradient(135deg, #3b82f6 0%, #9333ea 100%);
          }
        `}</style>
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

          {/* Projects Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Projects ({section4Data.projects.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section4Data.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Project {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Project title"
                  />
                  <input
                    type="text"
                    value={project.category}
                    onChange={(e) =>
                      handleProjectChange(index, "category", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Project category"
                  />
                  <input
                    type="text"
                    value={project.tags.join(", ")}
                    onChange={(e) => handleTagsChange(index, e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Tags (comma separated)"
                  />
                  <textarea
                    value={project.description}
                    onChange={(e) =>
                      handleProjectChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    rows="2"
                    placeholder="Project description"
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
