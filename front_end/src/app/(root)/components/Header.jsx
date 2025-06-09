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
    <header className="bg-white flex items-center justify-between p-4 shadow-md border-b">
      <div className="relative">
        <input
          type="text"
          placeholder="Хайх"
          className="px-3 py-2 pr-10 border border-gray-300 rounded-full"
        />
        <CiSearch className="text-2xl absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <div>
          <IoMdNotificationsOutline className="text-2xl" />
        </div>
        <div className="relative">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={toggleModal}
          >
            <img
              src="https://html.themeholy.com/edmate/assets/images/thumbs/user-img.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <MdOutlineKeyboardArrowDown />
          </div>

          {isModalOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border p-4 w-64 z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://html.themeholy.com/edmate/assets/images/thumbs/user-img.png"
                    alt="User"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-600">
                      john.doe@example.com
                    </p>
                  </div>
                </div>
                <hr />
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded">
                    Account
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-red-600">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
