"use client";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { api } from "../../../services/api";

const HelpSupportPage = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    subject: "",
    category: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  const faqData = [
    {
      category: "Account",
      questions: [
        {
          q: "How do I change my password?",
          a: "Go to Account Settings > Security tab and use the 'Change Password' section to update your password.",
        },
        {
          q: "How do I update my profile information?",
          a: "Navigate to Profile Settings where you can edit your personal information including name, email, and bio.",
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can delete your account from Account Settings > Danger Zone. Please note this action is irreversible.",
        },
      ],
    },
    {
      category: "Features",
      questions: [
        {
          q: "How do I upload files?",
          a: "Use the File Server section to upload and manage your files. You can drag and drop or click to select files.",
        },
        {
          q: "What file types are supported?",
          a: "We support most common file types including images (JPG, PNG, GIF), documents (PDF, DOC, TXT), and more.",
        },
        {
          q: "Is there a file size limit?",
          a: "Yes, the maximum file size is 10MB per upload. For larger files, please contact support.",
        },
      ],
    },
    {
      category: "Technical",
      questions: [
        {
          q: "Why am I getting a 'Not Found' error?",
          a: "This usually means the page you're trying to access doesn't exist or you don't have permission to view it.",
        },
        {
          q: "The website is running slowly, what should I do?",
          a: "Try refreshing the page, clearing your browser cache, or check your internet connection. If the problem persists, contact us.",
        },
        {
          q: "I'm having trouble logging in",
          a: "Make sure you're using the correct email and password. If you forgot your password, use the 'Forgot Password' link on the login page.",
        },
      ],
    },
  ];

  const contactCategories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "account", label: "Account Issues" },
    { value: "billing", label: "Billing Questions" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
  ];
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    try {
      await api.support.submitTicket({
        subject: contactForm.subject,
        category: contactForm.category,
        message: contactForm.message,
        userEmail: user?.email,
        userName: user?.name,
      });

      setSubmitMessage({
        type: "success",
        text: "Your message has been sent successfully! We'll get back to you within 24 hours.",
      });
      setContactForm({ subject: "", category: "general", message: "" });
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (qa) =>
          qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          qa.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const sections = [
    { id: "faq", name: "FAQ", icon: "❓" },
    { id: "contact", name: "Contact Us", icon: "📧" },
    { id: "guides", name: "User Guides", icon: "📚" },
    { id: "status", name: "System Status", icon: "🟢" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
            <p className="text-gray-600 mt-1">
              Get help, find answers, and contact our support team
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-4">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-md mb-2 flex items-center space-x-3 transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4 p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Quick Contact
              </h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">📧 support@example.com</p>
                <p className="text-gray-600">📞 +1 (555) 123-4567</p>
                <p className="text-gray-600">💬 Live Chat Available</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* FAQ Section */}
                {activeSection === "faq" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Frequently Asked Questions
                    </h2>

                    {/* Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search FAQ..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* FAQ Content */}
                    <div className="space-y-6">
                      {filteredFAQ.map((category, categoryIndex) => (
                        <div key={categoryIndex}>
                          <h3 className="text-lg font-medium text-gray-900 mb-4 border-b border-gray-200 pb-2">
                            {category.category}
                          </h3>
                          <div className="space-y-4">
                            {category.questions.map((qa, qIndex) => (
                              <div
                                key={qIndex}
                                className="bg-gray-50 rounded-md p-4"
                              >
                                <h4 className="font-medium text-gray-900 mb-2">
                                  {qa.q}
                                </h4>
                                <p className="text-gray-600 text-sm">{qa.a}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {filteredFAQ.length === 0 && searchQuery && (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No FAQ found matching your search.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Contact Section */}
                {activeSection === "contact" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Contact Support
                    </h2>

                    {submitMessage.text && (
                      <div
                        className={`mb-6 p-4 rounded-md ${
                          submitMessage.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {submitMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          value={contactForm.category}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {contactCategories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              subject: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Brief description of your issue"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={contactForm.message}
                          onChange={(e) =>
                            setContactForm({
                              ...contactForm,
                              message: e.target.value,
                            })
                          }
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Please provide detailed information about your issue or question..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Sending...</span>
                          </>
                        ) : (
                          <span>Send Message</span>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* User Guides Section */}
                {activeSection === "guides" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      User Guides
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Getting Started
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Learn the basics of using our platform
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Read Guide →
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-gray-900 mb-2">
                          File Management
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          How to upload, organize, and share files
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Read Guide →
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Account Security
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Keep your account safe and secure
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Read Guide →
                        </button>
                      </div>

                      <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                        <h3 className="font-medium text-gray-900 mb-2">
                          Troubleshooting
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          Common issues and their solutions
                        </p>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Read Guide →
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Status Section */}
                {activeSection === "status" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      System Status
                    </h2>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Web Application
                          </span>
                        </div>
                        <span className="text-green-700 text-sm">
                          Operational
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            File Server
                          </span>
                        </div>
                        <span className="text-green-700 text-sm">
                          Operational
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Authentication
                          </span>
                        </div>
                        <span className="text-green-700 text-sm">
                          Operational
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-gray-900">
                            Database
                          </span>
                        </div>
                        <span className="text-green-700 text-sm">
                          Operational
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Recent Updates
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• June 23, 2025 - All systems operational</p>
                        <p>• June 22, 2025 - Scheduled maintenance completed</p>
                        <p>
                          • June 21, 2025 - Performance improvements deployed
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportPage;
