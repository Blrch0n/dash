"use client";

import { useState, useEffect } from "react";
import { api } from "../services/api";

const FileServerStatus = ({ className = "" }) => {
  const [status, setStatus] = useState({
    status: "checking",
    message: "Checking file server...",
    lastCheck: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkFileServerHealth = async () => {
    setIsLoading(true);
    try {
      const response = await api.fileServer.healthCheck();
      setStatus({
        ...response.data,
        lastCheck: new Date(),
      });
    } catch (error) {
      setStatus({
        status: "error",
        message: error.message || "Failed to check file server status",
        lastCheck: new Date(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkFileServerHealth();

    // Check every 30 seconds
    const interval = setInterval(checkFileServerHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "healthy":
        return "#10b981"; // green
      case "unhealthy":
      case "error":
        return "#ef4444"; // red
      case "disabled":
        return "#f59e0b"; // amber
      case "checking":
      default:
        return "#6b7280"; // gray
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "healthy":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "unhealthy":
      case "error":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="15"
              y1="9"
              x2="9"
              y2="15"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="9"
              y1="9"
              x2="15"
              y2="15"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        );
      case "disabled":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "checking":
      default:
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div className={`file-server-status ${className}`}>
      <div className="status-header">
        <h3>File Server Status</h3>
        <button
          onClick={checkFileServerHealth}
          disabled={isLoading}
          className="refresh-button"
          title="Refresh status"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isLoading ? "spinning" : ""}
          >
            <path
              d="M1 4v6h6M23 20v-6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="status-content">
        <div className="status-indicator">
          <div
            className="status-dot"
            style={{ backgroundColor: getStatusColor(status.status) }}
          />
          <div
            className="status-icon"
            style={{ color: getStatusColor(status.status) }}
          >
            {getStatusIcon(status.status)}
          </div>
          <div className="status-text">
            <p className="status-message">{status.message}</p>
            <p className="status-label">
              {status.status === "healthy" && "Online"}
              {status.status === "unhealthy" && "Offline"}
              {status.status === "error" && "Error"}
              {status.status === "disabled" && "Disabled"}
              {status.status === "checking" && "Checking..."}
            </p>
          </div>
        </div>

        {status.lastCheck && (
          <p className="last-check">
            Last checked: {status.lastCheck.toLocaleTimeString()}
          </p>
        )}
      </div>

      <style jsx>{`
        .file-server-status {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .status-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: none;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .refresh-button:hover:not(:disabled) {
          border-color: #d1d5db;
          color: #374151;
          transform: translateY(-1px);
        }

        .refresh-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .status-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .status-icon {
          flex-shrink: 0;
        }

        .status-text {
          flex: 1;
          min-width: 0;
        }

        .status-message {
          margin: 0 0 4px 0;
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .status-label {
          margin: 0;
          font-size: 12px;
          color: #6b7280;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .last-check {
          margin: 0;
          font-size: 11px;
          color: #9ca3af;
          text-align: right;
        }

        @media (max-width: 640px) {
          .file-server-status {
            padding: 16px;
          }

          .status-header h3 {
            font-size: 16px;
          }

          .status-indicator {
            gap: 8px;
          }

          .status-message {
            font-size: 13px;
          }

          .last-check {
            text-align: left;
            margin-top: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default FileServerStatus;
