"use client";
import { useState } from "react";
import { MdOutlinePhoneIphone } from "react-icons/md";
import { IoMailOpen } from "react-icons/io5";
import { MdContactMail } from "react-icons/md";

const section4Info = {
  title: "Section 4",
  content:
    "Section 4 нь Contact хэсэг бөгөөд таны холбоо барих мэдээллийг харуулна.",
  key: "section4",
};

const DEFAULT_SECTION4_DATA = {
  contacts: [
    {
      id: 1,
      icon: "phone",
      title: "Phone",
      description: "+1 234 567 890",
    },
    {
      id: 2,
      icon: "email",
      title: "Email",
      description: "contact@example.com",
    },
    {
      id: 3,
      icon: "address",
      title: "Address",
      description: "123 Main Street, City, Country",
    },
  ],
};

const getIcon = (iconType) => {
  switch (iconType) {
    case "phone":
      return <MdOutlinePhoneIphone className="text-[40px] text-[#fcb03b]" />;
    case "email":
      return <IoMailOpen className="text-[40px] text-[#f15b26]" />;
    case "address":
      return <MdContactMail className="text-[40px] text-[#3cb878]" />;
    default:
      return <MdOutlinePhoneIphone className="text-[40px] text-[#fcb03b]" />;
  }
};

const page = () => {
  const [viewMode, setViewMode] = useState("desktop");
  const [section4Data, setSection4Data] = useState(DEFAULT_SECTION4_DATA);

  const handleContactChange = (index, field, value) => {
    setSection4Data((prev) => ({
      ...prev,
      contacts: prev.contacts.map((item, i) =>
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
      <div className="w-full h-fit bg-[#eeeeee]">
        <div
          className={`max-w-[1200px] mx-auto w-full h-fit grid text-black items-center justify-center px-4 ${
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
          } md:px-0`}
        >
          {section4Data.contacts.map((data, index) => (
            <div
              key={data.id}
              className={`w-full h-fit flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-center p-4 sm:p-8 transition-transform duration-300 ${
                index < section4Data.contacts.length - 1 && !isMobile
                  ? "border-b md:border-b-0 md:border-r border-gray-300"
                  : isMobile
                  ? "border-b border-gray-300 last:border-b-0"
                  : ""
              }`}
            >
              <div className="hover:scale-110 hover:rotate-2 transition-transform duration-300">
                {getIcon(data.icon)}
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[14px] text-[#828282]">{data.title}</p>
                <h1 className="text-[20px] sm:text-[25px] text-[#2A2F35] font-bold break-words">
                  {data.description}
                </h1>
              </div>
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
          {/* Contacts Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Contact Information ({section4Data.contacts.length})
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4">
              {section4Data.contacts.map((contact, index) => (
                <div
                  key={contact.id}
                  className="border border-gray-200 rounded-md p-3"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2">
                    Contact {index + 1}
                  </h4>
                  <select
                    value={contact.icon}
                    onChange={(e) =>
                      handleContactChange(index, "icon", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  >
                    <option value="phone">Phone Icon</option>
                    <option value="email">Email Icon</option>
                    <option value="address">Address Icon</option>
                  </select>
                  <input
                    type="text"
                    value={contact.title}
                    onChange={(e) =>
                      handleContactChange(index, "title", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                    placeholder="Contact title"
                  />
                  <textarea
                    value={contact.description}
                    onChange={(e) =>
                      handleContactChange(index, "description", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    placeholder="Contact information"
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
