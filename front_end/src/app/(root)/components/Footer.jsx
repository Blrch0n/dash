import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto">
      <div className="container-responsive py-4 md:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Company Info */}
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base text-gray-600">
              © {currentYear}{" "}
              <span className="font-semibold text-gray-900">
                Ogtorgui Ai Tech
              </span>
              . All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end space-x-4 md:space-x-6">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
