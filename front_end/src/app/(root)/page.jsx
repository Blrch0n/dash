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
    </div>
  );
}
