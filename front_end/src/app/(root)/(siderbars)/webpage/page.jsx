"use client";
import React, { useState } from "react";

const SinglePageWebsiteManager = () => {
  // State for single page websites
  const [websites, setWebsites] = useState([
    {
      id: 1,
      name: "Modern Portfolio",
      url: "https://singlepage-gilt.vercel.app/",
      preview: "https://singlepage-gilt.vercel.app/",
      category: "Portfolio",
      description:
        "Clean and modern portfolio design for developers and designers",
      image: "💼",
      customizable: {
        title: "John Smith",
        subtitle: "Full Stack Developer",
        description:
          "I create amazing digital experiences with modern technologies",
        primaryColor: "#3b82f6",
        backgroundColor: "#ffffff",
        buttonText: "View My Work",
        contactEmail: "john@example.com",
        skills: ["React", "Node.js", "Python", "AWS"],
      },
    },
    {
      id: 2,
      name: "Business Landing",
      url: "https://singlepage-gilt.vercel.app/business",
      preview: "https://singlepage-gilt.vercel.app/business",
      category: "Business",
      description: "Professional business landing page with conversion focus",
      image: "🏢",
      customizable: {
        title: "TechCorp Solutions",
        subtitle: "Innovation at Your Service",
        description:
          "Leading technology solutions for modern businesses worldwide",
        primaryColor: "#059669",
        backgroundColor: "#f0fdf4",
        buttonText: "Get Started Today",
        contactEmail: "info@techcorp.com",
        services: [
          "Web Development",
          "Cloud Solutions",
          "AI Integration",
          "Consulting",
        ],
      },
    },
    {
      id: 3,
      name: "Restaurant Website",
      url: "https://singlepage-gilt.vercel.app/restaurant",
      preview: "https://singlepage-gilt.vercel.app/restaurant",
      category: "Restaurant",
      description:
        "Elegant restaurant website with menu and reservation system",
      image: "🍝",
      customizable: {
        title: "Bella Vista",
        subtitle: "Authentic Italian Cuisine",
        description:
          "Experience the finest Italian flavors in a cozy atmosphere",
        primaryColor: "#dc2626",
        backgroundColor: "#fef2f2",
        buttonText: "Reserve Table",
        contactEmail: "reservations@bellavista.com",
        menuItems: [
          "Pasta Carbonara",
          "Margherita Pizza",
          "Tiramisu",
          "Wine Selection",
        ],
      },
    },
    {
      id: 4,
      name: "Photography Studio",
      url: "https://singlepage-gilt.vercel.app/photography",
      preview: "https://singlepage-gilt.vercel.app/photography",
      category: "Creative",
      description: "Stunning photography portfolio with gallery and booking",
      image: "📸",
      customizable: {
        title: "Lens & Light Studio",
        subtitle: "Capturing Life's Moments",
        description:
          "Professional photography for weddings, portraits, and events",
        primaryColor: "#7c3aed",
        backgroundColor: "#faf5ff",
        buttonText: "Book Session",
        contactEmail: "hello@lensandlight.com",
        services: [
          "Wedding Photography",
          "Portrait Sessions",
          "Event Coverage",
          "Commercial Shoots",
        ],
      },
    },
    {
      id: 5,
      name: "Fitness Gym",
      url: "https://singlepage-gilt.vercel.app/fitness",
      preview: "https://singlepage-gilt.vercel.app/fitness",
      category: "Health & Fitness",
      description:
        "Dynamic fitness gym website with class schedules and membership",
      image: "💪",
      customizable: {
        title: "PowerFit Gym",
        subtitle: "Transform Your Body",
        description:
          "State-of-the-art equipment and expert trainers to reach your goals",
        primaryColor: "#ea580c",
        backgroundColor: "#fff7ed",
        buttonText: "Join Now",
        contactEmail: "membership@powerfit.com",
        programs: [
          "Personal Training",
          "Group Classes",
          "Nutrition Coaching",
          "Yoga",
        ],
      },
    },
    {
      id: 6,
      name: "Music Band",
      url: "https://singlepage-gilt.vercel.app/music",
      preview: "https://singlepage-gilt.vercel.app/music",
      category: "Entertainment",
      description: "Rock band website with music player and tour dates",
      image: "🎸",
      customizable: {
        title: "Electric Dreams",
        subtitle: "Rock Band",
        description: "High-energy performances that electrify crowds worldwide",
        primaryColor: "#be185d",
        backgroundColor: "#fdf2f8",
        buttonText: "Listen Now",
        contactEmail: "booking@electricdreams.com",
        albums: [
          "Thunder Strike",
          "Neon Nights",
          "Electric Soul",
          "Live in Concert",
        ],
      },
    },
    {
      id: 7,
      name: "E-commerce Store",
      url: "https://singlepage-gilt.vercel.app/ecommerce",
      preview: "https://singlepage-gilt.vercel.app/ecommerce",
      category: "E-commerce",
      description: "Modern online store with product catalog and shopping cart",
      image: "🛍️",
      customizable: {
        title: "StyleHub",
        subtitle: "Fashion Forward",
        description: "Trendy clothing and accessories for the modern lifestyle",
        primaryColor: "#0891b2",
        backgroundColor: "#ecfeff",
        buttonText: "Shop Now",
        contactEmail: "support@stylehub.com",
        categories: [
          "Men's Fashion",
          "Women's Wear",
          "Accessories",
          "Footwear",
        ],
      },
    },
    {
      id: 8,
      name: "Consulting Firm",
      url: "https://singlepage-gilt.vercel.app/consulting",
      preview: "https://singlepage-gilt.vercel.app/consulting",
      category: "Professional",
      description:
        "Corporate consulting website with services and case studies",
      image: "📊",
      customizable: {
        title: "Strategic Minds",
        subtitle: "Business Consulting",
        description:
          "Expert guidance to accelerate your business growth and success",
        primaryColor: "#374151",
        backgroundColor: "#f9fafb",
        buttonText: "Consult Us",
        contactEmail: "contact@strategicminds.com",
        expertise: [
          "Strategy Development",
          "Digital Transformation",
          "Operations",
          "Leadership",
        ],
      },
    },
    {
      id: 9,
      name: "Travel Agency",
      url: "https://singlepage-gilt.vercel.app/travel",
      preview: "https://singlepage-gilt.vercel.app/travel",
      category: "Travel",
      description: "Travel agency website with destinations and booking system",
      image: "✈️",
      customizable: {
        title: "Wanderlust Adventures",
        subtitle: "Explore the World",
        description:
          "Unforgettable journeys to the most amazing destinations on Earth",
        primaryColor: "#059669",
        backgroundColor: "#ecfdf5",
        buttonText: "Book Trip",
        contactEmail: "trips@wanderlust.com",
        destinations: [
          "Tropical Islands",
          "European Cities",
          "Safari Adventures",
          "Mountain Retreats",
        ],
      },
    },
    {
      id: 10,
      name: "Tech Startup",
      url: "https://singlepage-gilt.vercel.app/startup",
      preview: "https://singlepage-gilt.vercel.app/startup",
      category: "Technology",
      description:
        "Modern tech startup website with product showcase and investor info",
      image: "🚀",
      customizable: {
        title: "InnovateX",
        subtitle: "Future Technology",
        description:
          "Building tomorrow's solutions with cutting-edge AI and blockchain",
        primaryColor: "#6366f1",
        backgroundColor: "#f0f9ff",
        buttonText: "Learn More",
        contactEmail: "hello@innovatex.com",
        products: [
          "AI Platform",
          "Blockchain Solutions",
          "Mobile Apps",
          "Cloud Services",
        ],
      },
    },
  ]);

  const [selectedWebsite, setSelectedWebsite] = useState(websites[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Update website customizable properties
  const updateWebsiteProperty = (id, property, value) => {
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === id
          ? {
              ...site,
              customizable: { ...site.customizable, [property]: value },
            }
          : site
      )
    );

    if (selectedWebsite.id === id) {
      setSelectedWebsite((prev) => ({
        ...prev,
        customizable: { ...prev.customizable, [property]: value },
      }));
    }
  };

  // Handle website selection
  const selectWebsite = (website) => {
    setSelectedWebsite(website);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 text-white">
          <h2 className="text-xl font-bold">Website Manager</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {/* Website Templates */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Available Websites
            </h3>
            <div className="space-y-3">
              {websites.map((website) => (
                <div
                  key={website.id}
                  onClick={() => selectWebsite(website)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    selectedWebsite.id === website.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-3xl mr-4 flex-shrink-0">
                      {website.image}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {website.name}
                        </h4>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {website.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {website.description}
                      </p>
                      <div className="flex items-center text-xs text-blue-600">
                        <span className="mr-2">🔗</span>
                        <span className="truncate">{website.url}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customization Panel */}
          {selectedWebsite && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Customize: {selectedWebsite.name}
              </h3>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={selectedWebsite.customizable.title}
                  onChange={(e) =>
                    updateWebsiteProperty(
                      selectedWebsite.id,
                      "title",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Subtitle */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={selectedWebsite.customizable.subtitle}
                  onChange={(e) =>
                    updateWebsiteProperty(
                      selectedWebsite.id,
                      "subtitle",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={selectedWebsite.customizable.description}
                  onChange={(e) =>
                    updateWebsiteProperty(
                      selectedWebsite.id,
                      "description",
                      e.target.value
                    )
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Button Text */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text
                </label>
                <input
                  type="text"
                  value={selectedWebsite.customizable.buttonText}
                  onChange={(e) =>
                    updateWebsiteProperty(
                      selectedWebsite.id,
                      "buttonText",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Contact Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={selectedWebsite.customizable.contactEmail}
                  onChange={(e) =>
                    updateWebsiteProperty(
                      selectedWebsite.id,
                      "contactEmail",
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Primary Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={selectedWebsite.customizable.primaryColor}
                    onChange={(e) =>
                      updateWebsiteProperty(
                        selectedWebsite.id,
                        "primaryColor",
                        e.target.value
                      )
                    }
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedWebsite.customizable.primaryColor}
                    onChange={(e) =>
                      updateWebsiteProperty(
                        selectedWebsite.id,
                        "primaryColor",
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={selectedWebsite.customizable.backgroundColor}
                    onChange={(e) =>
                      updateWebsiteProperty(
                        selectedWebsite.id,
                        "backgroundColor",
                        e.target.value
                      )
                    }
                    className="w-12 h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={selectedWebsite.customizable.backgroundColor}
                    onChange={(e) =>
                      updateWebsiteProperty(
                        selectedWebsite.id,
                        "backgroundColor",
                        e.target.value
                      )
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => window.open(selectedWebsite.url, "_blank")}
                  className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🌐 View Live Website
                </button>
                <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  💾 Save Changes
                </button>
                <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  🚀 Deploy Website
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 mr-4"
              >
                ☰
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Single Page Website Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {websites.length} websites available
              </span>
              <a
                href={selectedWebsite?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                View Selected Site
              </a>
            </div>
          </div>
        </div>

        {/* Website Preview */}
        <div className="p-6">
          {selectedWebsite ? (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Preview Header */}
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {selectedWebsite.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedWebsite.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Category</div>
                    <div className="font-medium text-gray-900">
                      {selectedWebsite.category}
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Preview Iframe */}
              <div className="relative" style={{ height: "70vh" }}>
                <iframe
                  src={selectedWebsite.preview}
                  className="w-full h-full border-0"
                  title={`Preview of ${selectedWebsite.name}`}
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => window.open(selectedWebsite.url, "_blank")}
                    className="px-3 py-2 bg-black bg-opacity-75 text-white rounded-lg text-xs hover:bg-opacity-90 transition-all"
                  >
                    🔗 Open Full Site
                  </button>
                </div>
              </div>

              {/* Customization Preview */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  Current Customization
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.title}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Subtitle:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.subtitle}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Button:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.buttonText}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.contactEmail}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Primary Color:
                    </span>
                    <div
                      className="ml-2 w-6 h-6 rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          selectedWebsite.customizable.primaryColor,
                      }}
                    ></div>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.primaryColor}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700">
                      Background:
                    </span>
                    <div
                      className="ml-2 w-6 h-6 rounded border border-gray-300"
                      style={{
                        backgroundColor:
                          selectedWebsite.customizable.backgroundColor,
                      }}
                    ></div>
                    <span className="ml-2 text-gray-600">
                      {selectedWebsite.customizable.backgroundColor}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌐</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Select a Website
              </h2>
              <p className="text-gray-600">
                Choose a website from the sidebar to view and customize
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 text-white">
          <h2 className="text-xl font-bold">Website Builder</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          {/* Website Templates */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Choose Template
            </h3>
            <div className="space-y-2">
              {websites.map((website) => (
                <button
                  key={website.id}
                  onClick={() => setSelectedWebsite(website)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedWebsite.id === website.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{website.image}</span>
                    <div>
                      <div className="font-medium">{website.name}</div>
                      <div className="text-sm text-gray-500">
                        {website.type}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Customization Panel */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Customize: {selectedWebsite.name}
            </h3>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={selectedWebsite.title}
                onChange={(e) =>
                  updateWebsite(selectedWebsite.id, "title", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Subtitle Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={selectedWebsite.subtitle}
                onChange={(e) =>
                  updateWebsite(selectedWebsite.id, "subtitle", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={selectedWebsite.description}
                onChange={(e) =>
                  updateWebsite(
                    selectedWebsite.id,
                    "description",
                    e.target.value
                  )
                }
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Button Text Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Button Text
              </label>
              <input
                type="text"
                value={selectedWebsite.buttonText}
                onChange={(e) =>
                  updateWebsite(
                    selectedWebsite.id,
                    "buttonText",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Primary Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <input
                type="color"
                value={selectedWebsite.primaryColor}
                onChange={(e) =>
                  updateWebsite(
                    selectedWebsite.id,
                    "primaryColor",
                    e.target.value
                  )
                }
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Secondary Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <input
                type="color"
                value={selectedWebsite.secondaryColor}
                onChange={(e) =>
                  updateWebsite(
                    selectedWebsite.id,
                    "secondaryColor",
                    e.target.value
                  )
                }
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Color
              </label>
              <input
                type="color"
                value={selectedWebsite.backgroundColor}
                onChange={(e) =>
                  updateWebsite(
                    selectedWebsite.id,
                    "backgroundColor",
                    e.target.value
                  )
                }
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Text Color */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={selectedWebsite.textColor}
                onChange={(e) =>
                  updateWebsite(selectedWebsite.id, "textColor", e.target.value)
                }
                className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
              />
            </div>

            {/* Image/Icon Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon/Emoji
              </label>
              <input
                type="text"
                value={selectedWebsite.image}
                onChange={(e) =>
                  updateWebsite(selectedWebsite.id, "image", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="🚀"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              ☰
            </button>
            <h1 className="text-xl font-bold text-gray-900">Website Preview</h1>
            <div></div>
          </div>
        </div>

        {/* Website Preview */}
        <div className="relative">{renderWebsiteTemplate(selectedWebsite)}</div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default SinglePageWebsiteManager;
