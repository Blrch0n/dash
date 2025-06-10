"use client";
import { useState } from "react";

const section2Info = {
  title: "Section 2",
  content:
    "Section 2 нь Service хэсэг бөгөөд таны үйлчилгээний гол салбаруудыг харуулна.",
  key: "section2",
};

const DEFAULT_SECTION2_DATA = {
  services: [
    {
      id: 1,
      title: "Our services",
      backgroundImage:
        "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Support team",
      backgroundImage:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Contact us",
      backgroundImage:
        "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=600&h=400&fit=crop",
    },
  ],
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section2Data, setSection2Data] = useState(DEFAULT_SECTION2_DATA);

  const handleServiceChange = (index, field, value) => {
    setSection2Data((prev) => ({
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
      <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-8 min-h-[600px]">
        {/* Services Grid */}
        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          } max-w-6xl mx-auto`}
        >
          {section2Data.services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-64"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${service.backgroundImage})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-[#00000080] bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
              </div>

              {/* Content - Centered */}
              <div className="relative z-10 h-full flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white text-center px-4">
                  {service.title}
                </h3>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
          Section 2 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section2Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section2Info.content}</p>

        <div className="space-y-6">
          {/* Services Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Services ({section2Data.services.length})
            </h3>
            <div className="space-y-4">
              {section2Data.services.map((service, index) => (
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
                  <input
                    type="text"
                    value={service.backgroundImage}
                    onChange={(e) =>
                      handleServiceChange(
                        index,
                        "backgroundImage",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Background image URL"
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
