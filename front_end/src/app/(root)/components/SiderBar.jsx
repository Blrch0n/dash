"use client";
import { MdOutlineDashboard } from "react-icons/md";
import { RiInfoCardLine } from "react-icons/ri";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
import { useState } from "react";

const sideBarMenu = [
  {
    title: "Хянах самбар",
    icon: <MdOutlineDashboard />,
    link: "/dashboard",
    subMenu: [],
  },
  {
    title: "Сайтын мэдээлэл",
    icon: <RiInfoCardLine />,
    link: "/users",
    subMenu: [
      { title: "Гарчиг", link: "/users" },
      { title: "Navbar", link: "/navbar" },
      { title: "Footer", link: "/footer" },
      { title: "Дэлгэрэнгүй мэдээлэл", link: "/details" },
    ],
  },
];

const SiderBar = () => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="w-[250px] items-center h-screen bg-[#f9f9f9] flex flex-col py-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.5)] px-5">
      <img
        src="https://html.themeholy.com/edmate/assets/images/logo/logo.png"
        alt=""
        className="w-[145px] py-2.5 h-auto"
      />
      <div className="flex flex-col h-full gap-2.5 mt-5 w-full">
        {sideBarMenu.map((item, index) => (
          <div key={index} className="w-full">
            <div
              onClick={() =>
                item.subMenu.length > 0 ? toggleSubmenu(index) : null
              }
              className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-gray-700 hover:text-blue-600 ${
                item.subMenu.length > 0 ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.title}</span>
              </div>
              {item.subMenu.length > 0 && (
                <span className="text-lg transition-transform duration-200">
                  {expandedMenus[index] ? (
                    <IoChevronUpOutline />
                  ) : (
                    <IoChevronDownOutline />
                  )}
                </span>
              )}
            </div>

            {/* Submenu */}
            {item.subMenu.length > 0 && (
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedMenus[index]
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="ml-4 mt-2 space-y-1">
                  {item.subMenu.map((subItem, subIndex) => (
                    <a
                      key={subIndex}
                      href={subItem.link}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-gray-600 hover:text-blue-600 text-sm"
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                      <span>{subItem.title}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SiderBar;
