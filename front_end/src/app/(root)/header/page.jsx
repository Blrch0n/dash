"use client";
import { useState } from "react";

const headerInfo = {
  title: "Header",
  content:
    "Header нь таны вэбсайтын дээд хэсэг бөгөөд лого болон навигацийн цэсийг агуулдаг.",
  key: "header",
};

const DEFAULT_LABELS = [
  "Нүүр хуудас",
  "Тухай",
  "Үйлчилгээ",
  "Холбоо барих",
  "Блог",
  "Тусламж",
];

const DEFAULT_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"; // Default logo

const page = () => {
  const [viewMode, setViewMode] = useState("desktop"); // desktop or mobile
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [image, setImage] = useState(DEFAULT_IMAGE);

  const handleLabelChange = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const PreviewComponent = ({ isMobile }) => (
    <div
      className={`bg-white border rounded-lg overflow-hidden shadow-lg ${
        isMobile ? "w-80 mx-auto" : "w-full"
      }`}
    >
      {/* Header */}
      <header
        className={`bg-blue-600 text-white p-4 flex items-center ${
          isMobile ? "flex-col gap-2" : "flex-row justify-between"
        }`}
      >
        {/* Logo/Image */}
        <div className="flex items-center">
          <img
            src={image}
            alt="Logo"
            className={`rounded ${isMobile ? "mb-2" : "mr-4"}`}
            style={{
              objectFit: "contain",
              background: "#fff",
              width: "180px",
              height: "50px",
            }}
          />
        </div>

        {/* Navigation Links */}
        <nav
          className={`${
            isMobile ? "text-sm" : "text-base"
          } flex flex-wrap gap-4`}
        >
          {labels.map((item, index) => (
            <a
              key={index}
              href="#"
              className="hover:underline cursor-pointer px-2 py-1 rounded hover:bg-blue-700 transition"
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* Sample content area to show header in context */}
      <div className="p-8 bg-gray-50 min-h-32">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Website Content
        </h1>
        <p className="text-gray-600">
          This is where your main content would appear...
        </p>
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
          Header засварлах
        </h2>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {headerInfo.title}
        </label>
        <p className="text-xs text-gray-500 mb-4">{headerInfo.content}</p>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Лого зураг
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="mt-2">
            <img
              src={image}
              alt="Logo Preview"
              className="rounded bg-gray-100 object-contain"
              style={{
                width: "180px",
                height: "50px",
              }}
            />
          </div>
        </div>

        {/* Navigation Labels */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Навигацийн цэсний нэрс
          </label>
          <div className="space-y-3">
            {labels.map((label, idx) => (
              <input
                key={idx}
                type="text"
                value={label}
                onChange={(e) => handleLabelChange(idx, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Цэсний нэр ${idx + 1}`}
              />
            ))}
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
