"use client";
import { useState } from "react";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Services хэсэг бөгөөд таны үйлчилгээний онцлог давуу талуудыг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  title: "Our Services",
  subtitle: "We provide exceptional digital solutions tailored to your needs",
  services: [
    {
      id: 1,
      title: "Unlimited Colors",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "🎨",
      bgColor: "from-purple-400 to-pink-400",
    },
    {
      id: 2,
      title: "High Quality Design",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "✨",
      bgColor: "from-blue-400 to-cyan-400",
    },
    {
      id: 3,
      title: "Luxurious Layouts",
      description:
        "We help our clients in developing systems of digital products and services over time.",
      icon: "💎",
      bgColor: "from-green-400 to-teal-400",
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

  const handleServiceChange = (index, field, value) => {
    setSection4Data((prev) => ({
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
            {section4Data.title}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            {section4Data.subtitle}
          </p>
        </div>

        {/* Services Grid */}
        <div
          className={`grid ${
            isMobile
              ? "grid-cols-1 gap-8"
              : "grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          }`}
        >
          {section4Data.services.map((service, index) => (
            <div
              key={service.id}
              className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              {/* Background Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              {/* Content */}
              <div className="relative p-8 text-center">
                {/* Icon */}
                <div
                  className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${service.bgColor} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>

                {/* Decorative Element */}
                <div
                  className={`w-16 h-1 bg-gradient-to-r ${service.bgColor} mx-auto mt-6 rounded-full`}
                ></div>
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

          {/* Services Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Services ({section4Data.services.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section4Data.services.map((service, index) => (
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
                    value={service.icon}
                    onChange={(e) =>
                      handleServiceChange(index, "icon", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Icon (emoji)"
                  />
                  <input
                    type="text"
                    value={service.bgColor}
                    onChange={(e) =>
                      handleServiceChange(index, "bgColor", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Background gradient (e.g., from-blue-400 to-cyan-400)"
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
