"use client";

import React, { useState } from "react";

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const newsArticles = [
    {
      id: 1,
      title: "New Dashboard Features Released",
      category: "product",
      excerpt:
        "We've added several new features to improve your dashboard experience, including real-time analytics and enhanced reporting tools.",
      content:
        "Today we're excited to announce the release of several new features that will enhance your dashboard experience. These updates include real-time analytics, enhanced reporting tools, and improved user interface elements. Our team has been working tirelessly to bring you these improvements based on your valuable feedback.",
      author: "Sarah Johnson",
      date: "2024-06-15",
      readTime: "3 min read",
      image: "/api/placeholder/600/300",
      featured: true,
    },
    {
      id: 2,
      title: "Company Expansion to Europe",
      category: "company",
      excerpt:
        "We're thrilled to announce our expansion into European markets, bringing our services to a global audience.",
      content:
        "We're excited to share that our company is expanding into European markets! This milestone represents our commitment to serving clients worldwide and bringing our innovative solutions to a global audience. Our European headquarters will be located in London, with satellite offices planned for Berlin and Amsterdam.",
      author: "Michael Chen",
      date: "2024-06-12",
      readTime: "5 min read",
      image: "/api/placeholder/600/300",
      featured: false,
    },
    {
      id: 3,
      title: "Best Practices for Web Development",
      category: "tech",
      excerpt:
        "Learn about the latest best practices in modern web development, from performance optimization to accessibility standards.",
      content:
        "In this comprehensive guide, we explore the latest best practices in modern web development. From performance optimization techniques to accessibility standards, we cover everything you need to know to build better web applications. Topics include responsive design, SEO optimization, and modern JavaScript frameworks.",
      author: "Emily Rodriguez",
      date: "2024-06-10",
      readTime: "8 min read",
      image: "/api/placeholder/600/300",
      featured: false,
    },
    {
      id: 4,
      title: "Security Updates and Improvements",
      category: "security",
      excerpt:
        "Important security updates have been implemented to keep your data safe and secure.",
      content:
        "Security is our top priority, and we've implemented several important updates to enhance the protection of your data. These improvements include advanced encryption protocols, multi-factor authentication enhancements, and regular security audits. We recommend all users update their passwords and enable two-factor authentication.",
      author: "David Kim",
      date: "2024-06-08",
      readTime: "4 min read",
      image: "/api/placeholder/600/300",
      featured: false,
    },
    {
      id: 5,
      title: "Customer Success Stories",
      category: "customer",
      excerpt:
        "Read about how our clients have achieved success using our platform and services.",
      content:
        "We're proud to share some inspiring success stories from our clients who have achieved remarkable results using our platform. From small startups to large enterprises, these case studies demonstrate the real-world impact of our solutions. Learn how our clients increased efficiency, reduced costs, and improved their business outcomes.",
      author: "Lisa Thompson",
      date: "2024-06-05",
      readTime: "6 min read",
      image: "/api/placeholder/600/300",
      featured: false,
    },
    {
      id: 6,
      title: "Upcoming Webinar Series",
      category: "event",
      excerpt:
        "Join us for our upcoming webinar series covering advanced dashboard techniques and industry insights.",
      content:
        "We're hosting a series of educational webinars designed to help you get the most out of our platform. Topics include advanced dashboard customization, data visualization best practices, and industry-specific use cases. Registration is free for all existing customers, and recordings will be available afterward.",
      author: "Alex Turner",
      date: "2024-06-03",
      readTime: "2 min read",
      image: "/api/placeholder/600/300",
      featured: false,
    },
  ];

  const categories = [
    { id: "all", label: "All News", color: "#6b7280" },
    { id: "product", label: "Product Updates", color: "#3b82f6" },
    { id: "company", label: "Company News", color: "#10b981" },
    { id: "tech", label: "Technology", color: "#8b5cf6" },
    { id: "security", label: "Security", color: "#ef4444" },
    { id: "customer", label: "Customer Stories", color: "#f59e0b" },
    { id: "event", label: "Events", color: "#ec4899" },
  ];

  const filteredArticles =
    selectedCategory === "all"
      ? newsArticles
      : newsArticles.filter((article) => article.category === selectedCategory);

  const featuredArticle = newsArticles.find((article) => article.featured);

  return (
    <div className="news-page">
      <div className="news-container">
        {/* Header Section */}
        <div className="news-header">
          <h1>Latest News & Updates</h1>
          <p>
            Stay informed about our latest developments, features, and industry
            insights
          </p>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <div
            className="featured-article"
            onClick={() => setSelectedArticle(featuredArticle)}
          >
            <div className="featured-content">
              <div className="featured-badge">Featured</div>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.excerpt}</p>
              <div className="article-meta">
                <span className="author">By {featuredArticle.author}</span>
                <span className="date">
                  {new Date(featuredArticle.date).toLocaleDateString()}
                </span>
                <span className="read-time">{featuredArticle.readTime}</span>
              </div>
              <button className="read-more-btn">Read More</button>
            </div>
            <div className="featured-image">
              <div className="image-placeholder">
                {featuredArticle.title.charAt(0)}
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-btn ${
                selectedCategory === category.id ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                "--category-color": category.color,
                borderColor:
                  selectedCategory === category.id ? category.color : "#e5e7eb",
                color:
                  selectedCategory === category.id ? category.color : "#6b7280",
              }}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles
            .filter((article) => !article.featured)
            .map((article) => (
              <div
                key={article.id}
                className="article-card"
                onClick={() => setSelectedArticle(article)}
              >
                <div className="article-image">
                  <div className="image-placeholder">
                    {article.title.charAt(0)}
                  </div>
                  <div
                    className="category-tag"
                    style={{
                      backgroundColor: categories.find(
                        (c) => c.id === article.category
                      )?.color,
                    }}
                  >
                    {categories.find((c) => c.id === article.category)?.label}
                  </div>
                </div>
                <div className="article-info">
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="author">By {article.author}</span>
                    <span className="date">
                      {new Date(article.date).toLocaleDateString()}
                    </span>
                    <span className="read-time">{article.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Article Modal */}
        {selectedArticle && (
          <div
            className="article-modal"
            onClick={() => setSelectedArticle(null)}
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-btn"
                onClick={() => setSelectedArticle(null)}
              >
                ×
              </button>
              <div className="modal-header">
                <div
                  className="modal-category"
                  style={{
                    backgroundColor: categories.find(
                      (c) => c.id === selectedArticle.category
                    )?.color,
                  }}
                >
                  {
                    categories.find((c) => c.id === selectedArticle.category)
                      ?.label
                  }
                </div>
                <h1>{selectedArticle.title}</h1>
                <div className="modal-meta">
                  <span>By {selectedArticle.author}</span>
                  <span>
                    {new Date(selectedArticle.date).toLocaleDateString()}
                  </span>
                  <span>{selectedArticle.readTime}</span>
                </div>
              </div>
              <div className="modal-image">
                <div className="image-placeholder large">
                  {selectedArticle.title.charAt(0)}
                </div>
              </div>
              <div className="modal-body">
                <p>{selectedArticle.content}</p>

                <div className="article-actions">
                  <button className="btn-primary">Share Article</button>
                  <button className="btn-secondary">
                    Subscribe to Updates
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for the latest news and updates</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
