"use client";
import { MdOutlineDashboard } from "react-icons/md";
import { RiInfoCardLine } from "react-icons/ri";
import { IoChevronDownOutline } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sideBarMenu = [
  {
    title: "Хянах самбар",
    icon: <MdOutlineDashboard />,
    link: "/",
    subMenu: [],
  },
  {
    title: "Сайтын мэдээлэл",
    icon: <RiInfoCardLine />,
    link: "/users",
    subMenu: [
      { title: "Header", link: "/header", subMenu: [] },
      { title: "Footer", link: "/footer", subMenu: [] },
      {
        title: "Бидний тухай",
        link: "/about",
        subMenu: [
          { title: "Хэсэг 1", link: "/about/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/about/section2", subMenu: [] },
          { title: "Хэсэг 3", link: "/about/section3", subMenu: [] },
        ],
      },
      {
        title: "Үйл ажиллагаа",
        link: "/our_work",
        subMenu: [
          { title: "Хэсэг 1", link: "/our_work/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/our_work/section2", subMenu: [] },
          { title: "Хэсэг 3", link: "/our_work/section3", subMenu: [] },
          { title: "Хэсэг 4", link: "/our_work/section4", subMenu: [] },
        ],
      },
      {
        title: "Үйлчилгээ",
        link: "/services",
        subMenu: [
          { title: "Хэсэг 1", link: "/services/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/services/section2", subMenu: [] },
        ],
      },
      {
        title: "Баг хамт олон",
        link: "/team",
        subMenu: [
          { title: "Хэсэг 1", link: "/team/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/team/section2", subMenu: [] },
          { title: "Хэсэг 3", link: "/team/section3", subMenu: [] },
        ],
      },
      {
        title: "Онцлох мэдээлэл",
        link: "/news",
        subMenu: [
          { title: "Хэсэг 1", link: "/news/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/news/section2", subMenu: [] },
        ],
      },
      {
        title: "Холбоо барих",
        link: "/contact",
        subMenu: [
          { title: "Хэсэг 1", link: "/contact/section1", subMenu: [] },
          { title: "Хэсэг 2", link: "/contact/section2", subMenu: [] },
        ],
      },
    ],
  },
  {
    title: "Вэб хуудас",
    icon: <RiInfoCardLine />,
    link: "/webpage",
    subMenu: [],
  },
];

const SiderBar = () => {
  // Only one submenu open per level
  const [expandedMenus, setExpandedMenus] = useState({});
  const router = useRouter();

  // index: e.g. "1", "1-2", "1-2-3"
  const toggleSubmenu = (index) => {
    setExpandedMenus((prev) => {
      const parentKey = index.split("-").slice(0, -1).join("-");
      return {
        ...prev,
        [parentKey]: prev[parentKey] === index ? null : index,
      };
    });
  };

  const isExpanded = (index) => {
    const parentKey = index.split("-").slice(0, -1).join("-");
    return expandedMenus[parentKey] === index;
  };

  const handleNavigation = (link, hasSubMenu) => {
    if (!hasSubMenu && link) {
      router.push(link);
    }
  };

  // Recursive submenu renderer
  const renderSubMenu = (subMenu, parentIndex = "", depth = 1) => (
    <div className={`${depth === 1 ? "ml-6" : "ml-4"} mt-1 space-y-1`}>
      {subMenu.map((subItem, subIndex) => {
        const currentIndex = parentIndex + subIndex;
        const hasSubMenu = subItem.subMenu && subItem.subMenu.length > 0;

        return (
          <div key={currentIndex}>
            <div
              onClick={() => {
                if (hasSubMenu) {
                  toggleSubmenu(currentIndex);
                } else {
                  handleNavigation(subItem.link, hasSubMenu);
                }
              }}
              className={`
                group flex items-center justify-between gap-3 px-3 py-2 rounded-md 
                transition-all duration-200 text-sm cursor-pointer
                ${
                  hasSubMenu
                    ? "hover:bg-blue-50 text-gray-600 hover:text-blue-700"
                    : "hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                }
                ${depth > 1 ? "ml-2" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    hasSubMenu
                      ? "bg-blue-400 group-hover:bg-blue-600"
                      : "bg-gray-400 group-hover:bg-gray-600"
                  }`}
                ></div>
                <span className="font-medium">{subItem.title}</span>
              </div>

              {hasSubMenu && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded-full font-medium">
                    {subItem.subMenu.length}
                  </span>
                  <span
                    className={`text-sm transition-transform duration-200 ${
                      isExpanded(currentIndex) ? "rotate-180" : ""
                    }`}
                  >
                    <IoChevronDownOutline />
                  </span>
                </div>
              )}
            </div>

            {hasSubMenu && (
              <div
                className={`
                  transition-all duration-300 ease-in-out
                  ${
                    isExpanded(currentIndex)
                      ? "max-h-[1000px] opacity-100 mt-1"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }
                `}
              >
                {renderSubMenu(subItem.subMenu, currentIndex + "-", depth + 1)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="w-[280px] h-full min-h-screen bg-white flex flex-col shadow-lg border-r border-gray-200">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-100">
        <img
          src="https://html.themeholy.com/edmate/assets/images/logo/logo.png"
          alt="Logo"
          className="w-[160px] h-auto mx-auto"
        />
      </div>

      {/* Navigation Menu - Made scrollable */}
      <div className="flex-1 px-4 py-6 overflow-y-auto max-h-[calc(100vh-140px)]">
        <nav className="space-y-2">
          {sideBarMenu.map((item, index) => (
            <div key={index} className="w-full">
              <div
                onClick={() => {
                  if (item.subMenu.length > 0) {
                    toggleSubmenu(index.toString());
                  } else {
                    handleNavigation(item.link, item.subMenu.length > 0);
                  }
                }}
                className={`
                  group flex items-center justify-between gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200 font-medium cursor-pointer
                  ${
                    item.subMenu.length > 0
                      ? "hover:bg-blue-50 text-gray-700 hover:text-blue-700"
                      : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xl transition-colors duration-200 ${
                      item.subMenu.length > 0
                        ? "text-blue-500 group-hover:text-blue-600"
                        : "text-gray-500 group-hover:text-gray-600"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </div>

                {item.subMenu.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-semibold">
                      {item.subMenu.length}
                    </span>
                    <span
                      className={`text-lg transition-transform duration-200 ${
                        isExpanded(index.toString()) ? "rotate-180" : ""
                      }`}
                    >
                      <IoChevronDownOutline />
                    </span>
                  </div>
                )}
              </div>

              {item.subMenu.length > 0 && (
                <div
                  className={`
                    transition-all duration-300 ease-in-out
                    ${
                      isExpanded(index.toString())
                        ? "max-h-[2000px] opacity-100 mt-2"
                        : "max-h-0 opacity-0 overflow-hidden"
                    }
                  `}
                >
                  {renderSubMenu(item.subMenu, index + "-")}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default SiderBar;
