"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 1250,
    activeSessions: 324,
    revenue: 45600,
    growth: 12.5,
  });

  const [recentActivities, setRecentActivities] = useState([
    {
      id: 1,
      action: "User registration",
      user: "John Doe",
      time: "2 mins ago",
    },
    { id: 2, action: "Page updated", user: "Jane Smith", time: "5 mins ago" },
    {
      id: 3,
      action: "New section added",
      user: "Mike Johnson",
      time: "10 mins ago",
    },
    {
      id: 4,
      action: "Content published",
      user: "Sarah Wilson",
      time: "15 mins ago",
    },
  ]);

  return (
    <div className="dashboard-container">
      {/* Welcome Header */}
      <div className="welcome-header">
        <div>
          <h1>Welcome back, {user?.name || "Admin"}!</h1>
          <p>Here's what's happening with your dashboard today.</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn-primary">
            <span>+</span>
            Add New Content
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon users">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="9"
                cy="7"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m22 21-3-3m0 0a4 4 0 1 0-6-6 4 4 0 0 0 6 6z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <span className="stat-change positive">+8.2%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon sessions">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path d="M12 1v6m0 6v6" stroke="currentColor" strokeWidth="2" />
              <path
                d="m21 12-6 0m-6 0-6 0"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.activeSessions}</h3>
            <p>Active Sessions</p>
            <span className="stat-change positive">+12.1%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>${stats.revenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
            <span className="stat-change positive">+{stats.growth}%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon growth">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" />
              <path
                d="m19 9-5 5-4-4-3 3"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
          <div className="stat-content">
            <h3>24.5%</h3>
            <p>Growth Rate</p>
            <span className="stat-change positive">+2.3%</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-card quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-grid">
            <button className="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="13"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Add Page</span>
            </button>
            <button className="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="8"
                  y="2"
                  width="8"
                  height="4"
                  rx="1"
                  ry="1"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Manage Users</span>
            </button>
            <button className="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <polyline
                  points="12,6 12,12 16,14"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Analytics</span>
            </button>
            <button className="action-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-avatar">{activity.user.charAt(0)}</div>
                <div className="activity-content">
                  <p className="activity-action">{activity.action}</p>
                  <p className="activity-user">by {activity.user}</p>
                </div>
                <span className="activity-time">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="view-all-btn">View All Activity</button>
        </div>

        {/* Performance Chart */}
        <div className="dashboard-card performance-chart">
          <h2>Performance Overview</h2>
          <div className="chart-placeholder">
            <div className="chart-bars">
              <div className="chart-bar" style={{ height: "60%" }}></div>
              <div className="chart-bar" style={{ height: "80%" }}></div>
              <div className="chart-bar" style={{ height: "45%" }}></div>
              <div className="chart-bar" style={{ height: "90%" }}></div>
              <div className="chart-bar" style={{ height: "70%" }}></div>
              <div className="chart-bar" style={{ height: "95%" }}></div>
              <div className="chart-bar" style={{ height: "65%" }}></div>
            </div>
            <div className="chart-labels">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="dashboard-card system-status">
          <h2>System Status</h2>
          <div className="status-list">
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>Database</span>
              <span className="status-label">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>API Server</span>
              <span className="status-label">Online</span>
            </div>
            <div className="status-item">
              <div className="status-indicator warning"></div>
              <span>Cache Server</span>
              <span className="status-label">Warning</span>
            </div>
            <div className="status-item">
              <div className="status-indicator online"></div>
              <span>CDN</span>
              <span className="status-label">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
