"use client";
import { useState } from "react";

const section1Info = {
  title: "Section 1",
  content:
    "Section 1 нь таны вэбсайтын эхний хэсэг бөгөөд танилцуулга болон онцлог шинж чанаруудыг агуулна.",
  key: "section1",
};

const DEFAULT_SECTION1_DATA = {
  welcome: {
    title: "Welcome",
    content:
      "We are the comprehensive design and technology partner for the digital age. We help businesses to stay relevant to their customers in the digital era by touching hearts and minds.",
  },
  features: {
    title: "Outstanding Features",
    items: [
      {
        title: "Brand Development",
        description:
          "Our energy and expertise are focus in inspiring projects, activation campaigns and influence strategies with our brands",
        image:
          "https://thumbs.dreamstime.com/b/spring-wallpaper-creating-award-winning-photograph-pic-encapsulates-timeless-beauty-tranquility-nature-351383535.jpg",
      },
      {
        title: "Content Strategy",
        description:
          "We believe in a collaborative partnership where we work with you and your brand to create the perfect solution",
        image:
          "https://thumbs.dreamstime.com/b/spring-wallpaper-creating-award-winning-photograph-pic-encapsulates-timeless-beauty-tranquility-nature-351383535.jpg",
      },
      {
        title: "Ecommerce & Technology",
        description:
          "Development and Design – every solution needs a conceptual design that the further work will be based on. value",
        image:
          "https://thumbs.dreamstime.com/b/spring-wallpaper-creating-award-winning-photograph-pic-encapsulates-timeless-beauty-tranquility-nature-351383535.jpg",
      },
    ],
  },
  exploreButton: {
    text: "Explore All Features",
    link: "#",
  },
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section1Data, setSection1Data] = useState(DEFAULT_SECTION1_DATA);

  const handleWelcomeChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      welcome: { ...prev.welcome, [field]: value },
    }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...section1Data.features.items];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setSection1Data((prev) => ({
      ...prev,
      features: { ...prev.features, items: newFeatures },
    }));
  };

  const handleButtonChange = (field, value) => {
    setSection1Data((prev) => ({
      ...prev,
      exploreButton: { ...prev.exploreButton, [field]: value },
    }));
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      <section className="bg-gradient-to-r from-blue-50 to-indigo-100 p-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {section1Data.welcome.title}
          </h1>
          <p
            className={`text-gray-600 max-w-3xl mx-auto ${
              isMobile ? "text-sm" : "text-lg"
            } leading-relaxed`}
          >
            {section1Data.welcome.content}
          </p>
        </div>

        {/* Outstanding Features Section */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {section1Data.features.title}
          </h2>
          <div
            className={`grid gap-8 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}
          >
            {section1Data.features.items.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="mb-4 flex justify-center">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                  {feature.title}
                </h3>
                <p
                  className={`text-gray-600 ${
                    isMobile ? "text-sm" : "text-base"
                  } leading-relaxed`}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Explore Button */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              {section1Data.exploreButton.text}
            </button>
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
          {/* Welcome Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Welcome Section
            </h3>
            <input
              type="text"
              value={section1Data.welcome.title}
              onChange={(e) => handleWelcomeChange("title", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Welcome title"
            />
            <textarea
              value={section1Data.welcome.content}
              onChange={(e) => handleWelcomeChange("content", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="4"
              placeholder="Welcome content"
            />
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Outstanding Features
            </h3>
            {section1Data.features.items.map((feature, idx) => (
              <div key={idx} className="space-y-2 mb-4 p-3 border rounded-lg">
                <label className="text-xs font-medium text-gray-600">
                  Feature {idx + 1}
                </label>
                <input
                  type="text"
                  value={feature.image}
                  onChange={(e) =>
                    handleFeatureChange(idx, "image", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    handleFeatureChange(idx, "title", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Feature title"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) =>
                    handleFeatureChange(idx, "description", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Feature description"
                />
              </div>
            ))}
          </div>

          {/* Explore Button Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Explore Button
            </h3>
            <input
              type="text"
              value={section1Data.exploreButton.text}
              onChange={(e) => handleButtonChange("text", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
              placeholder="Button text"
            />
            <input
              type="text"
              value={section1Data.exploreButton.link}
              onChange={(e) => handleButtonChange("link", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Button link"
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
