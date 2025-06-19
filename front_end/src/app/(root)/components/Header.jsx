"use client";
import { CiSearch } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useState } from "react";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-white flex items-center justify-between p-3 md:p-4 shadow-md border-b">
      {/* Search Section */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Хайх"
          className="w-full px-3 md:px-4 py-2 pr-10 border border-gray-300 rounded-full text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
        />
        <CiSearch className="text-xl md:text-2xl absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Notifications */}
        <div className="relative">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
            <IoMdNotificationsOutline className="text-xl md:text-2xl text-gray-600" />
          </button>
          {/* Notification badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={toggleModal}
          >
            <img
              src="https://html.themeholy.com/edmate/assets/images/thumbs/user-img.png"
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
                      src="https://html.themeholy.com/edmate/assets/images/thumbs/user-img.png"
                      alt="User"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        John Doe
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        john.doe@example.com
                      </p>
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 my-4"></div>

                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3">
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
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3">
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
                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-3">
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

                    <button className="w-full text-left px-3 py-2 hover:bg-red-50 rounded-md text-sm text-red-600 transition-colors duration-200 flex items-center gap-3">
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
