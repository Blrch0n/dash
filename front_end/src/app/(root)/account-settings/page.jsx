"use client";
import { useAuth } from "../../../contexts/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../services/api";

const AccountSettingsPage = () => {
  const { user, isAuthenticated, changePassword } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("security");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    allowMessaging: true,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
  }, [isAuthenticated, router]);
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match!" });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters long!",
      });
      return;
    }

    // Check if password meets backend requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(passwordData.newPassword)) {
      setMessage({
        type: "error",
        text: "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setMessage({
        type: "success",
        text: "Password changed successfully! You'll need to login again.",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to change password. Please check your current password.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await api.user.updateNotificationSettings(notificationSettings);
      setMessage({ type: "success", text: "Notification settings updated!" });
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update notification settings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      await api.user.updatePrivacySettings(privacySettings);
      setMessage({ type: "success", text: "Privacy settings updated!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update privacy settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      // Implement account deletion logic
      console.log("Account deletion requested");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "security", name: "Security", icon: "🔒" },
    { id: "notifications", name: "Notifications", icon: "🔔" },
    { id: "privacy", name: "Privacy", icon: "👁️" },
    { id: "danger", name: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your account security, notifications, and privacy
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <nav className="p-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-md mb-2 flex items-center space-x-3 transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Message */}
                {message.text && (
                  <div
                    className={`mb-6 p-4 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Security Settings
                    </h2>

                    {/* Change Password */}
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Change Password
                      </h3>
                      <form
                        onSubmit={handlePasswordChange}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>{" "}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Must be at least 6 characters with uppercase,
                            lowercase, and number
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading ? "Updating..." : "Update Password"}
                        </button>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Two-Factor Authentication
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-600 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                          Enable 2FA
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Notification Preferences
                    </h2>

                    <div className="space-y-6">
                      {Object.entries(notificationSettings).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-3 border-b border-gray-200"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {key === "emailNotifications" &&
                                  "Receive email notifications for important updates"}
                                {key === "pushNotifications" &&
                                  "Receive push notifications in your browser"}
                                {key === "smsNotifications" &&
                                  "Receive SMS notifications for urgent matters"}
                                {key === "marketingEmails" &&
                                  "Receive marketing emails and newsletters"}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  setNotificationSettings({
                                    ...notificationSettings,
                                    [key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        )
                      )}
                    </div>

                    <button
                      onClick={handleNotificationUpdate}
                      disabled={loading}
                      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Preferences"}
                    </button>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === "privacy" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Privacy Settings
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Profile Visibility
                        </label>
                        <select
                          value={privacySettings.profileVisibility}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              profileVisibility: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                          <option value="friends">Friends Only</option>
                        </select>
                      </div>

                      {Object.entries(privacySettings)
                        .filter(([key]) => key !== "profileVisibility")
                        .map(([key, value]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between py-3 border-b border-gray-200"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {key === "showEmail" &&
                                  "Display your email address on your profile"}
                                {key === "showPhone" &&
                                  "Display your phone number on your profile"}
                                {key === "allowMessaging" &&
                                  "Allow other users to send you messages"}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={value}
                                onChange={(e) =>
                                  setPrivacySettings({
                                    ...privacySettings,
                                    [key]: e.target.checked,
                                  })
                                }
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={handlePrivacyUpdate}
                      disabled={loading}
                      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Settings"}
                    </button>
                  </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === "danger" && (
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Danger Zone
                    </h2>

                    <div className="bg-red-50 border border-red-200 rounded-md p-6">
                      <h3 className="text-lg font-medium text-red-900 mb-4">
                        Delete Account
                      </h3>
                      <p className="text-red-700 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        Delete Account
                      </button>
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

export default AccountSettingsPage;
