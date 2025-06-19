"use client";

import React, { useState } from "react";

const OurWorkPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "E-Commerce Platform",
      category: "web",
      image: "/api/placeholder/400/300",
      description: "Modern e-commerce solution with advanced features",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      client: "Fashion Retailer",
      year: "2024",
    },
    {
      id: 2,
      title: "Mobile Banking App",
      category: "mobile",
      image: "/api/placeholder/400/300",
      description:
        "Secure mobile banking application with biometric authentication",
      technologies: ["React Native", "Firebase", "JWT", "Plaid API"],
      client: "Regional Bank",
      year: "2023",
    },
    {
      id: 3,
      title: "Healthcare Dashboard",
      category: "web",
      image: "/api/placeholder/400/300",
      description: "Real-time patient monitoring and analytics dashboard",
      technologies: ["Vue.js", "Python", "PostgreSQL", "Chart.js"],
      client: "Medical Center",
      year: "2024",
    },
    {
      id: 4,
      title: "Food Delivery App",
      category: "mobile",
      image: "/api/placeholder/400/300",
      description: "On-demand food delivery platform with real-time tracking",
      technologies: ["Flutter", "Firebase", "Google Maps", "Payment Gateway"],
      client: "Restaurant Chain",
      year: "2023",
    },
    {
      id: 5,
      title: "Corporate Website",
      category: "design",
      image: "/api/placeholder/400/300",
      description: "Modern corporate website with CMS integration",
      technologies: ["Next.js", "Tailwind CSS", "Strapi", "Vercel"],
      client: "Tech Startup",
      year: "2024",
    },
    {
      id: 6,
      title: "Learning Management System",
      category: "web",
      image: "/api/placeholder/400/300",
      description:
        "Comprehensive LMS with video streaming and progress tracking",
      technologies: ["React", "Express.js", "MongoDB", "AWS S3"],
      client: "Education Institute",
      year: "2023",
    },
  ];

  const categories = [
    { id: "all", label: "All Projects" },
    { id: "web", label: "Web Development" },
    { id: "mobile", label: "Mobile Apps" },
    { id: "design", label: "Design" },
  ];

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  return (
    <div className="our-work-page">
      <div className="work-container">
        {/* Header Section */}
        <div className="work-header">
          <h1>Our Work</h1>
          <p>
            Showcasing our latest projects and successful collaborations with
            clients
          </p>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-image">
                <div className="image-placeholder">
                  {project.title.charAt(0)}
                </div>
                <div className="project-overlay">
                  <button className="view-btn">View Details</button>
                </div>
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-meta">
                  <span className="client">{project.client}</span>
                  <span className="year">{project.year}</span>
                </div>
                <div className="tech-tags">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="tech-tag more">
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal */}
        {selectedProject && (
          <div
            className="project-modal"
            onClick={() => setSelectedProject(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedProject(null)}
              >
                ×
              </button>
              <div className="modal-header">
                <h2>{selectedProject.title}</h2>
                <div className="modal-meta">
                  <span>Client: {selectedProject.client}</span>
                  <span>Year: {selectedProject.year}</span>
                </div>
              </div>
              <div className="modal-body">
                <div className="modal-image">
                  <div className="image-placeholder large">
                    {selectedProject.title.charAt(0)}
                  </div>
                </div>
                <div className="modal-details">
                  <h3>Project Overview</h3>
                  <p>{selectedProject.description}</p>

                  <h3>Technologies Used</h3>
                  <div className="tech-grid">
                    {selectedProject.technologies.map((tech, index) => (
                      <span key={index} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="modal-actions">
                    <button className="btn-primary">View Live Site</button>
                    <button className="btn-secondary">Case Study</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="work-stats">
          <div className="stat-item">
            <h3>50+</h3>
            <p>Projects Completed</p>
          </div>
          <div className="stat-item">
            <h3>30+</h3>
            <p>Happy Clients</p>
          </div>
          <div className="stat-item">
            <h3>5</h3>
            <p>Years Experience</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Client Satisfaction</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="work-cta">
          <h2>Start Your Project Today</h2>
          <p>
            Ready to bring your ideas to life? Let's discuss your project
            requirements.
          </p>
          <button className="btn-primary">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default OurWorkPage;
