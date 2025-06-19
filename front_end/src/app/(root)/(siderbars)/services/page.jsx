"use client";

import React, { useState } from "react";

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom web applications built with modern technologies",
      icon: "🌐",
      features: [
        "React/Next.js",
        "Node.js Backend",
        "Database Design",
        "API Development",
      ],
      price: "Starting at $5,000",
    },
    {
      id: 2,
      title: "Mobile Apps",
      description: "Native and cross-platform mobile applications",
      icon: "📱",
      features: [
        "iOS Development",
        "Android Development",
        "React Native",
        "App Store Optimization",
      ],
      price: "Starting at $8,000",
    },
    {
      id: 3,
      title: "UI/UX Design",
      description: "User-centered design solutions for digital products",
      icon: "🎨",
      features: [
        "User Research",
        "Wireframing",
        "Prototyping",
        "Visual Design",
      ],
      price: "Starting at $3,000",
    },
    {
      id: 4,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies",
      icon: "📈",
      features: [
        "SEO Optimization",
        "Social Media",
        "Content Marketing",
        "Analytics",
      ],
      price: "Starting at $2,000/month",
    },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="services-page">
      <div className="services-container">
        {/* Header Section */}
        <div className="services-header">
          <h1>Our Services</h1>
          <p>
            Comprehensive solutions to help your business grow and succeed in
            the digital world
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="services-tabs">
          <button
            className={`tab-button ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => handleTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === "packages" ? "active" : ""}`}
            onClick={() => handleTabChange("packages")}
          >
            Packages
          </button>
          <button
            className={`tab-button ${activeTab === "pricing" ? "active" : ""}`}
            onClick={() => handleTabChange("pricing")}
          >
            Pricing
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <div className="tab-content">
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className="service-icon">{service.icon}</div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <ul className="service-features">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <div className="service-price">{service.price}</div>
                  <button className="service-btn">Learn More</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "packages" && (
          <div className="tab-content">
            <div className="packages-section">
              <h2>Service Packages</h2>
              <div className="packages-grid">
                <div className="package-card">
                  <h3>Starter Package</h3>
                  <div className="package-price">$2,500</div>
                  <ul>
                    <li>Basic website (5 pages)</li>
                    <li>Responsive design</li>
                    <li>Basic SEO setup</li>
                    <li>1 month support</li>
                  </ul>
                  <button className="package-btn">Choose Plan</button>
                </div>
                <div className="package-card featured">
                  <div className="popular-badge">Most Popular</div>
                  <h3>Professional Package</h3>
                  <div className="package-price">$7,500</div>
                  <ul>
                    <li>Custom web application</li>
                    <li>Advanced functionality</li>
                    <li>Database integration</li>
                    <li>3 months support</li>
                    <li>SEO optimization</li>
                  </ul>
                  <button className="package-btn">Choose Plan</button>
                </div>
                <div className="package-card">
                  <h3>Enterprise Package</h3>
                  <div className="package-price">$15,000+</div>
                  <ul>
                    <li>Full-scale application</li>
                    <li>Custom integrations</li>
                    <li>Advanced security</li>
                    <li>6 months support</li>
                    <li>Performance optimization</li>
                  </ul>
                  <button className="package-btn">Contact Us</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="tab-content">
            <div className="pricing-section">
              <h2>Transparent Pricing</h2>
              <p>
                No hidden fees. Clear, upfront pricing for all our services.
              </p>

              <div className="pricing-table">
                <div className="pricing-row header">
                  <div>Service</div>
                  <div>Basic</div>
                  <div>Standard</div>
                  <div>Premium</div>
                </div>
                <div className="pricing-row">
                  <div>Web Development</div>
                  <div>$2,500</div>
                  <div>$5,000</div>
                  <div>$10,000+</div>
                </div>
                <div className="pricing-row">
                  <div>Mobile App</div>
                  <div>$5,000</div>
                  <div>$8,000</div>
                  <div>$15,000+</div>
                </div>
                <div className="pricing-row">
                  <div>UI/UX Design</div>
                  <div>$1,500</div>
                  <div>$3,000</div>
                  <div>$5,000+</div>
                </div>
                <div className="pricing-row">
                  <div>Digital Marketing</div>
                  <div>$1,000/mo</div>
                  <div>$2,000/mo</div>
                  <div>$5,000/mo</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="services-cta">
          <h2>Ready to Get Started?</h2>
          <p>Contact us today to discuss your project requirements</p>
          <div className="cta-buttons">
            <button className="btn-primary">Get Quote</button>
            <button className="btn-secondary">Schedule Call</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
