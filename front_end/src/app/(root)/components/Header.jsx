"use client";
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Available sections and their routes
  const availableSections = [
    // Main sections
    {
      name: "Dashboard",
      route: "/",
      keywords: ["dashboard", "home", "main"],
      category: "Main",
    },
    {
      name: "General Info",
      route: "/general-info",
      keywords: ["general", "info", "settings", "configuration"],
      category: "Main",
    },

    // About sections
    {
      name: "About",
      route: "/about",
      keywords: ["about", "us", "company"],
      category: "About",
    },
    {
      name: "About Section 1",
      route: "/about/section1",
      keywords: [
        "about",
        "section1",
        "section 1",
        "story",
        "history",
        "about us section 1",
      ],
      category: "About",
    },
    {
      name: "About Section 2",
      route: "/about/section2",
      keywords: [
        "about",
        "section2",
        "section 2",
        "mission",
        "vision",
        "about us section 2",
      ],
      category: "About",
    },
    {
      name: "About Section 3",
      route: "/about/section3",
      keywords: [
        "about",
        "section3",
        "section 3",
        "values",
        "culture",
        "about us section 3",
      ],
      category: "About",
    },

    // Services sections
    {
      name: "Services",
      route: "/services",
      keywords: ["services", "offerings", "solutions"],
      category: "Services",
    },
    {
      name: "Services Section 1",
      route: "/services/section1",
      keywords: [
        "services",
        "section1",
        "section 1",
        "capabilities",
        "prototypes",
        "services section 1",
      ],
      category: "Services",
    },
    {
      name: "Services Section 2",
      route: "/services/section2",
      keywords: [
        "services",
        "section2",
        "section 2",
        "overview",
        "gallery",
        "services section 2",
      ],
      category: "Services",
    },

    // Our Work sections
    {
      name: "Our Work",
      route: "/our_work",
      keywords: ["work", "portfolio", "projects", "our work"],
      category: "Our Work",
    },
    {
      name: "Our Work Section 1",
      route: "/our_work/section1",
      keywords: [
        "work",
        "section1",
        "section 1",
        "case studies",
        "projects",
        "our work section 1",
      ],
      category: "Our Work",
    },
    {
      name: "Our Work Section 2",
      route: "/our_work/section2",
      keywords: [
        "work",
        "section2",
        "section 2",
        "capabilities",
        "approach",
        "our work section 2",
      ],
      category: "Our Work",
    },
    {
      name: "Our Work Section 3",
      route: "/our_work/section3",
      keywords: [
        "work",
        "section3",
        "section 3",
        "services",
        "unique",
        "our work section 3",
      ],
      category: "Our Work",
    },
    {
      name: "Our Work Section 4",
      route: "/our_work/section4",
      keywords: [
        "work",
        "section4",
        "section 4",
        "colors",
        "design",
        "our work section 4",
      ],
      category: "Our Work",
    },

    // Team sections
    {
      name: "Team",
      route: "/team",
      keywords: ["team", "staff", "people", "members"],
      category: "Team",
    },
    {
      name: "Team Section 1",
      route: "/team/section1",
      keywords: [
        "team",
        "section1",
        "section 1",
        "technologies",
        "tech stack",
        "team section 1",
      ],
      category: "Team",
    },
    {
      name: "Team Section 2",
      route: "/team/section2",
      keywords: [
        "team",
        "section2",
        "section 2",
        "concept",
        "approach",
        "team section 2",
      ],
      category: "Team",
    },
    {
      name: "Team Section 3",
      route: "/team/section3",
      keywords: [
        "team",
        "section3",
        "section 3",
        "contact",
        "touch",
        "team section 3",
      ],
      category: "Team",
    },

    // News sections
    {
      name: "News",
      route: "/news",
      keywords: ["news", "updates", "articles", "blog"],
      category: "News",
    },
    {
      name: "News Section 1",
      route: "/news/section1",
      keywords: [
        "news",
        "section1",
        "section 1",
        "latest",
        "updates",
        "news section 1",
      ],
      category: "News",
    },
    {
      name: "News Section 2",
      route: "/news/section2",
      keywords: [
        "news",
        "section2",
        "section 2",
        "partners",
        "brands",
        "news section 2",
      ],
      category: "News",
    },

    // Contact sections
    {
      name: "Contact",
      route: "/contact",
      keywords: ["contact", "reach", "communication"],
      category: "Contact",
    },
    {
      name: "Contact Section 1",
      route: "/contact/section1",
      keywords: [
        "contact",
        "section1",
        "section 1",
        "information",
        "details",
        "contact section 1",
      ],
      category: "Contact",
    },
    {
      name: "Contact Section 2",
      route: "/contact/section2",
      keywords: [
        "contact",
        "section2",
        "section 2",
        "form",
        "message",
        "contact section 2",
      ],
      category: "Contact",
    },

    // Layout sections
    {
      name: "Header",
      route: "/header",
      keywords: ["header", "navigation", "top"],
      category: "Layout",
    },
    {
      name: "Footer",
      route: "/footer",
      keywords: ["footer", "bottom", "links"],
      category: "Layout",
    },
    {
      name: "Webpage",
      route: "/webpage",
      keywords: ["webpage", "settings", "configuration"],
      category: "Layout",
    },
  ];

  // Search functionality - Instant autocomplete
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Show results even for single character
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter sections with instant matching - even single letters
    const queryLower = query.toLowerCase();
    const filtered = availableSections
      .filter((section) => {
        // Match if query appears anywhere in name or keywords
        const nameMatch = section.name.toLowerCase().includes(queryLower);
        const keywordMatch = section.keywords.some((keyword) =>
          keyword.toLowerCase().includes(queryLower)
        );
        return nameMatch || keywordMatch;
      })
      .sort((a, b) => {
        // Prioritize sections that start with the query
        const aStartsWith = a.name.toLowerCase().startsWith(queryLower);
        const bStartsWith = b.name.toLowerCase().startsWith(queryLower);

        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        // Then prioritize exact matches in name
        const aNameMatch = a.name.toLowerCase().includes(queryLower);
        const bNameMatch = b.name.toLowerCase().includes(queryLower);

        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;

        // Finally sort alphabetically by category then name
        if (a.category !== b.category) {
          return a.category.localeCompare(b.category);
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 15); // Show more results for instant search

    setSearchResults(filtered);
  };

  const handleSearchResultClick = (route) => {
    console.log("Navigating to:", route); // Debug log
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);
    router.push(route);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted, results:", searchResults); // Debug log
    if (searchResults.length > 0) {
      handleSearchResultClick(searchResults[0].route);
    }
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    // Use a longer delay and check if we're still focused
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 300);
  };

  const handleClickOutside = () => {
    setIsSearchFocused(false);
    setSearchResults([]);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsModalOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfileSettings = () => {
    setIsModalOpen(false);
    // Navigate to profile settings page or open modal
    router.push("/profile");
  };

  const handleAccountSettings = () => {
    setIsModalOpen(false);
    // Navigate to account settings page or open modal
    router.push("/account-settings");
  };

  const handleHelpSupport = () => {
    setIsModalOpen(false);
    // Navigate to help & support page or open modal
    router.push("/help-support");
  };

  // Get user's display name and email
  const displayName = user?.name || user?.username || "Guest User";
  const userEmail = user?.email || "guest@example.com";
  const userAvatar =
    user?.avatar ||
    user?.profilePicture ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(displayName) +
      "&background=6366f1&color=ffffff&size=128&rounded=true&font-size=0.33";
  const userRole = user?.role || "User";
  const isOnline = isAuthenticated;

  // Mock notifications count - replace with real data from API
  const notificationCount = user?.unreadNotifications || 0;

  // Show login button if user is not authenticated
  if (!isAuthenticated) {
    return (
      <header className="bg-white flex items-center justify-between p-3 md:p-4 shadow-md border-b">
        {/* Search Section */}
        <div className="relative flex-1 max-w-md">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Type to search... (e.g. 's' for sections)"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
              className="w-full px-3 md:px-4 py-2 pr-10 border border-gray-300 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <CiSearch className="text-xl md:text-2xl text-gray-400 hover:text-gray-600 transition-colors duration-200" />
            </button>
          </form>

          {/* Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
              <div className="py-2">
                <div className="px-3 py-1 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Showing results for "{searchQuery}" ({searchResults.length})
                </div>
                {searchResults.map((section, index) => (
                  <div
                    key={index}
                    onMouseDown={(e) => {
                      // Prevent blur from firing before click
                      e.preventDefault();
                      handleSearchResultClick(section.route);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 group cursor-pointer border-l-4 border-transparent hover:border-blue-300"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-150">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {section.name}
                        </p>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            section.category === "About"
                              ? "bg-green-100 text-green-800"
                              : section.category === "Services"
                              ? "bg-blue-100 text-blue-800"
                              : section.category === "Our Work"
                              ? "bg-purple-100 text-purple-800"
                              : section.category === "Team"
                              ? "bg-orange-100 text-orange-800"
                              : section.category === "News"
                              ? "bg-yellow-100 text-yellow-800"
                              : section.category === "Contact"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {section.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {section.route}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {isSearchFocused &&
            searchQuery.trim() !== "" &&
            searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <div className="py-4 px-3 text-center text-gray-500">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-sm">
                    No sections found for "{searchQuery}"
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Login Button */}
        <div className="flex items-center gap-2 md:gap-4 ml-4">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white flex items-center justify-between p-3 md:p-4 shadow-md border-b">
      {" "}
      {/* Search Section */}
      <div className="relative flex-1 max-w-md">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Type to search... (e.g. 's' for sections)"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => {
              // Delay hiding results to allow clicking on them
              setTimeout(() => setIsSearchFocused(false), 200);
            }}
            className="w-full px-3 md:px-4 py-2 pr-10 border border-gray-300 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <CiSearch className="text-xl md:text-2xl text-gray-400 hover:text-gray-600 transition-colors duration-200" />
          </button>
        </form>
      </div>
      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <IoMdNotificationsOutline className="text-xl md:text-2xl text-gray-600" />
          </button>
          {/* Notification badge */}
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={toggleModal}
          >
            <img
              src={userAvatar}
              alt="User"
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-gray-200"
            />
            <MdOutlineKeyboardArrowDown
              className={`text-gray-600 transition-transform duration-200 ${
                isModalOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Dropdown Modal */}
          {isModalOpen && (
            <>
              {/* Backdrop for mobile */}
              <div
                className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
                onClick={toggleModal}
              />

              <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-64 md:w-72 z-50 overflow-hidden">
                <div className="p-4 md:p-6">
                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={userAvatar}
                      alt="User"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {userEmail}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            isOnline
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {userRole}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button
                      onClick={handleProfileSettings}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Profile Settings
                    </button>
                    <button
                      onClick={handleAccountSettings}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Account Settings
                    </button>
                    <button
                      onClick={handleHelpSupport}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Help & Support
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-2"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-md text-sm text-red-600 transition-colors duration-200 flex items-center gap-3"
                    >
                      <svg
                        className="w-4 h-4 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
