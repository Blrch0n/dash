"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const section4Info = {
  title: "Section 17",
  content:
    "Section 17 нь Call to Action хэсэг бөгөөд хэрэглэгчдийг үйлдэл хийхэд уриална.",
  key: "section17",
};

const DEFAULT_SECTION17_DATA = {
  backgroundImage:
    "https://wallpapers.com/images/featured/8k-e16w8b36gngra7a4.jpg",
  smallText: "Want to be our client?",
  mainHeading: "No subscription, you only pay once.",
  buttonText: "Purchase theme",
  buttonLink: "/",
};

const Section17Component = ({ data, isMobile }) => {
  const router = useRouter();

  return (
    <div
      className={`w-full h-[650px] sm:h-[500px] xs:h-[400px] relative bg-cover flex items-center bg-fixed justify-center bg-center px-4 ${
        isMobile ? "h-[400px]" : ""
      }`}
      style={{ backgroundImage: `url(${data.backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-[#00000034]"></div>
      <div className="relative text-white flex flex-col w-full max-w-[500px] sm:max-w-[400px] xs:max-w-[320px] items-center justify-center text-center gap-4 sm:gap-3 xs:gap-2">
        <p className="text-[14px] sm:text-[13px] xs:text-[12px]">
          {data.smallText}
        </p>
        <h2 className="text-[32px] sm:text-[40px] md:text-[45px] xs:text-[28px] leading-tight">
          {data.mainHeading}
        </h2>
        <button
          style={{
            background: "linear-gradient(to right, #3452ff 0%, #ad3ed8 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => router.push(data.buttonLink)}
          className="py-3 px-8 sm:py-2.5 sm:px-6 xs:py-2 xs:px-4 text-[16px] sm:text-[14px] xs:text-[13px] font-medium hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          {data.buttonText}
        </button>
      </div>
    </div>
  );
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section17Data, setSection17Data] = useState(DEFAULT_SECTION17_DATA);

  const handleDataChange = (field, value) => {
    setSection17Data((prev) => ({
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
      <Section17Component data={section17Data} isMobile={isMobile} />
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
          Section 17 засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {section4Info.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{section4Info.content}</p>

        <div className="space-y-6">
          {/* Background Image */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Background Image
            </h3>
            <input
              type="text"
              value={section17Data.backgroundImage}
              onChange={(e) =>
                handleDataChange("backgroundImage", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Background image URL"
            />
          </div>

          {/* Small Text */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Small Text
            </h3>
            <input
              type="text"
              value={section17Data.smallText}
              onChange={(e) => handleDataChange("smallText", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Small descriptive text"
            />
          </div>

          {/* Main Heading */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Main Heading
            </h3>
            <textarea
              value={section17Data.mainHeading}
              onChange={(e) => handleDataChange("mainHeading", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              placeholder="Main heading text"
            />
          </div>

          {/* Button Text */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Button Text
            </h3>
            <input
              type="text"
              value={section17Data.buttonText}
              onChange={(e) => handleDataChange("buttonText", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Button text"
            />
          </div>

          {/* Button Link */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Button Link
            </h3>
            <input
              type="text"
              value={section17Data.buttonLink}
              onChange={(e) => handleDataChange("buttonLink", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Button link URL"
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
