"use client";
import React, { useState } from "react";

const AboutPage = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    { id: "overview", title: "Overview", icon: "📋" },
    { id: "mission", title: "Mission", icon: "🎯" },
    { id: "vision", title: "Vision", icon: "👁️" },
    { id: "values", title: "Values", icon: "⭐" },
    { id: "team", title: "Team", icon: "👥" },
    { id: "history", title: "History", icon: "📚" },
  ];

  const content = {
    overview: {
      title: "About Our Company",
      content: `We are a leading technology company focused on delivering innovative solutions that transform businesses and improve lives. Our commitment to excellence and customer satisfaction drives everything we do.`,
    },
    mission: {
      title: "Our Mission",
      content: `To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and success in the digital age.`,
    },
    vision: {
      title: "Our Vision",
      content: `To be the global leader in technology innovation, creating a connected world where businesses thrive through digital transformation.`,
    },
    values: {
      title: "Our Values",
      content: `Innovation, Integrity, Excellence, Collaboration, and Customer-centricity are the core values that guide our decisions and actions.`,
    },
    team: {
      title: "Our Team",
      content: `Our diverse team of experts brings together decades of experience in technology, business, and innovation to deliver exceptional results.`,
    },
    history: {
      title: "Our History",
      content: `Founded in 2010, we have grown from a small startup to a global technology leader, serving thousands of clients worldwide.`,
    },
  };

  return (
    <div className="w-full h-full bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            About Us
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-3xl">
            Learn more about our company, mission, values, and the team that
            makes it all possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sections
              </h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {content[activeSection].title}
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {content[activeSection].content}
                  </p>
                </div>
              </div>

              {/* Interactive Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 md:p-6 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      💡
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      Innovation
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm">
                    We constantly push the boundaries of technology to create
                    groundbreaking solutions.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 md:p-6 border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                      🤝
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      Partnership
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm">
                    We build lasting relationships with our clients based on
                    trust and mutual success.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 md:p-6 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      🏆
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      Excellence
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm">
                    We strive for excellence in every project, delivering
                    quality that exceeds expectations.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 md:p-6 border border-orange-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                      🚀
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                      Growth
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm">
                    We help businesses scale and grow through strategic
                    technology implementations.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Work Together?
                </h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">
                  Get in touch with our team to discuss how we can help your
                  business succeed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm md:text-base">
                    Contact Us
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
