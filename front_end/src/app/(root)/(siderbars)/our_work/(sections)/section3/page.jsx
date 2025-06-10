"use client";
import { useState } from "react";

const section3Info = {
  title: "Section 3",
  content:
    "Section 3 нь Unique Services хэсэг бөгөөд таны үйлчилгээний давуу талуудыг харуулна.",
  key: "section3",
};

const DEFAULT_SECTION3_DATA = {
  title: "Unique services",
  subtitle: "Our Approach",
  description: "We offer custom solutions to industry leading companies",
  services: [
    {
      id: 1,
      title: "STRATEGY",
      description:
        "Enside allows you to build a fully functional and feature rich onepage WordPress site, whatever your agency or business, without any knowledge of coding.",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "INSIGHT",
      description:
        "Effortlessly beautiful, Enside offers a collection of pre-built demos, with one-click import, and you can make your site your own using WP Bakery for WordPress.",
      image:
        "https://images.unsplash.com/photo-1553484771-371a605b060b?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "EXPERIENCE",
      description:
        "We've created a wide selection of stunning and powerful demos so that you can find the best starting point for your personal, business or agency website.",
      image:
        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "PERFORMANCE",
      description:
        "The admin panel invites you to get creative and make your site unique in seconds. You get to choose how your users engage with you and your business.",
      image:
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    },
  ],
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section3Data, setSection3Data] = useState(DEFAULT_SECTION3_DATA);

  const handleTitleChange = (field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleServiceChange = (index, field, value) => {
    setSection3Data((prev) => ({
      ...prev,
      services: prev.services.map((item, i) =>
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
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-16 px-8 min-h-[800px]">
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {section3Data.title}
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {section3Data.subtitle}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {section3Data.description}
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-6"
              : "grid-cols-4 gap-6 max-w-7xl mx-auto"
          }`}
        >
          {section3Data.services.map((service, index) => (
            <div
              key={service.id}
              className="group relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${service.image})`,
                }}
              >
                {/* Gradient Overlay - Better alternative */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300"></div>
              </div>

              {/* Centered Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide text-shadow-lg">
                  {service.title}
                </h3>
                <p className="text-white text-sm leading-relaxed text-shadow-md">
                  {service.description}
                </p>
              </div>

              {/* Fallback for broken images */}
              <img
                src={service.image}
                alt=""
                className="hidden"
                onError={(e) => {
                  e.target.parentElement.querySelector(
                    ".absolute.inset-0.bg-cover"
                  ).style.display = "none";
                  e.target.parentElement.querySelector(
                    ".fallback-bg"
                  ).style.display = "block";
                }}
              />
              <div className="fallback-bg hidden absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          ))}
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
          Section 3 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section3Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section3Info.content}</p>

        <div className="space-y-6">
          {/* Header Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Header Content
            </h3>
            <input
              type="text"
              value={section3Data.title}
              onChange={(e) => handleTitleChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Main title"
            />
            <input
              type="text"
              value={section3Data.subtitle}
              onChange={(e) => handleTitleChange("subtitle", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Subtitle"
            />
            <textarea
              value={section3Data.description}
              onChange={(e) => handleTitleChange("description", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Description"
            />
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Services ({section3Data.services.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section3Data.services.map((service, index) => (
                <div
                  key={service.id}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Service {index + 1}
                  </h4>
                  <input
                    type="text"
                    value={service.title}
                    onChange={(e) =>
                      handleServiceChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Service title"
                  />
                  <textarea
                    value={service.description}
                    onChange={(e) =>
                      handleServiceChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    rows="3"
                    placeholder="Service description"
                  />
                  <input
                    type="text"
                    value={service.image}
                    onChange={(e) =>
                      handleServiceChange(index, "image", e.target.value)
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
