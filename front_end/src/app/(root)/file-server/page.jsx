"use client";

import { useState } from "react";
import FileUpload from "../../../components/FileUpload";
import FileServerStatus from "../../../components/FileServerStatus";

export default function FileServerDemo() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logs, setLogs] = useState([]);

  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { message, type, timestamp }]);
  };

  const handleFileUploaded = (file) => {
    setUploadedFiles((prev) => [...prev, file]);
    addLog(`File uploaded: ${file.originalName || file.filename}`, "success");
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
    addLog("Cleared uploaded files list", "info");
  };

  return (
    <div className="file-server-demo">
      <div className="demo-container">
        <header className="demo-header">
          <h1>NGINX File Server with CloudFlare</h1>
          <p>
            Test file upload and download functionality with your NGINX file
            server
          </p>
        </header>

        <div className="demo-grid">
          {/* Left Column - Status and Upload */}
          <div className="demo-column">
            <FileServerStatus />

            <div className="upload-section">
              <h2>Single File Upload</h2>{" "}
              <FileUpload
                onFileUploaded={handleFileUploaded}
                multiple={false}
                accept="*/*"
                maxFileSize={999 * 1024 * 1024} // 999MB
              />
            </div>

            <div className="upload-section">
              <h2>Multiple File Upload</h2>{" "}
              <FileUpload
                onFileUploaded={handleFileUploaded}
                multiple={true}
                accept="*/*"
                maxFiles={5}
                maxFileSize={999 * 1024 * 1024} // 999MB
              />
            </div>
          </div>

          {/* Right Column - Files and Logs */}
          <div className="demo-column">
            {/* Uploaded Files Gallery */}
            <div className="files-gallery">
              <div className="gallery-header">
                <h2>Uploaded Files ({uploadedFiles.length})</h2>
                {uploadedFiles.length > 0 && (
                  <button onClick={clearUploadedFiles} className="clear-button">
                    Clear List
                  </button>
                )}
              </div>

              {uploadedFiles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <polyline
                        points="13,2 13,8 19,8"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <p>No files uploaded yet</p>
                  <p>Upload files using the forms above to see them here</p>
                </div>
              ) : (
                <div className="files-grid">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={`${file.filename}-${index}`}
                      className="file-card"
                    >
                      <div className="file-preview">
                        {file.mimetype?.startsWith("image/") ? (
                          <img
                            src={file.url}
                            alt={file.originalName || file.filename}
                            className="file-image"
                          />
                        ) : (
                          <div className="file-icon">
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <polyline
                                points="14,2 14,8 20,8"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="file-info">
                        <h3
                          className="file-name"
                          title={file.originalName || file.filename}
                        >
                          {file.originalName || file.filename}
                        </h3>
                        <p className="file-size">
                          {file.size
                            ? formatFileSize(file.size)
                            : "Unknown size"}
                        </p>
                        <p className="file-type">
                          {file.mimetype || "Unknown type"}
                        </p>
                      </div>

                      <div className="file-actions">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="action-link"
                        >
                          Open
                        </a>
                        <button
                          onClick={() => copyToClipboard(file.url)}
                          className="action-button"
                        >
                          Copy URL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Activity Log */}
            <div className="activity-log">
              <div className="log-header">
                <h2>Activity Log</h2>
                {logs.length > 0 && (
                  <button onClick={clearLogs} className="clear-button">
                    Clear Log
                  </button>
                )}
              </div>

              <div className="log-content">
                {logs.length === 0 ? (
                  <p className="empty-log">No activity yet</p>
                ) : (
                  <div className="log-entries">
                    {logs
                      .slice(-10)
                      .reverse()
                      .map((log, index) => (
                        <div
                          key={index}
                          className={`log-entry log-${log.type}`}
                        >
                          <span className="log-time">{log.timestamp}</span>
                          <span className="log-message">{log.message}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions">
          <h2>Instructions</h2>
          <div className="instructions-grid">
            <div className="instruction-card">
              <h3>1. Setup File Server</h3>
              <p>
                Configure your NGINX file server with WebDAV and set the
                FILE_SERVER_BASE environment variable to your CloudFlare tunnel
                URL.
              </p>
            </div>
            <div className="instruction-card">
              <h3>2. Upload Files</h3>
              <p>
                Use the upload forms above to send files to your NGINX server.
                Files are stored securely and accessible via CloudFlare.
              </p>
            </div>
            <div className="instruction-card">
              <h3>3. Access Files</h3>
              <p>
                Uploaded files are accessible via direct URLs and can be
                embedded in your applications or shared with others.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .file-server-demo {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .demo-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .demo-header {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }

        .demo-header h1 {
          margin: 0 0 16px 0;
          font-size: 2.5rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .demo-header p {
          margin: 0;
          font-size: 1.1rem;
          opacity: 0.9;
        }

        .demo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 40px;
        }

        .demo-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-section {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .upload-section h2 {
          margin: 0 0 20px 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .files-gallery {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .gallery-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .gallery-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .clear-button {
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .clear-button:hover {
          border-color: #9ca3af;
          color: #374151;
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6b7280;
        }

        .empty-icon {
          margin: 0 0 16px 0;
          color: #d1d5db;
        }

        .empty-state p:first-of-type {
          margin: 0 0 8px 0;
          font-weight: 500;
        }

        .empty-state p:last-of-type {
          margin: 0;
          font-size: 14px;
        }

        .files-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .file-card {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .file-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .file-preview {
          height: 120px;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .file-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-icon {
          color: #6b7280;
        }

        .file-info {
          padding: 12px;
        }

        .file-name {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size,
        .file-type {
          margin: 0 0 4px 0;
          font-size: 11px;
          color: #6b7280;
        }

        .file-actions {
          padding: 0 12px 12px 12px;
          display: flex;
          gap: 8px;
        }

        .action-link,
        .action-button {
          flex: 1;
          padding: 6px 8px;
          font-size: 11px;
          text-align: center;
          border-radius: 4px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          text-decoration: none;
        }

        .action-link {
          background: #4f46e5;
          color: white;
        }

        .action-link:hover {
          background: #4338ca;
        }

        .action-button {
          background: #f3f4f6;
          color: #374151;
        }

        .action-button:hover {
          background: #e5e7eb;
        }

        .activity-log {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .log-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .log-header h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .log-content {
          max-height: 300px;
          overflow-y: auto;
        }

        .empty-log {
          text-align: center;
          color: #6b7280;
          font-style: italic;
          margin: 20px 0;
        }

        .log-entries {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .log-entry {
          display: flex;
          gap: 12px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
        }

        .log-entry.log-info {
          background: #f0f9ff;
          color: #0369a1;
        }

        .log-entry.log-success {
          background: #f0fdf4;
          color: #166534;
        }

        .log-entry.log-error {
          background: #fef2f2;
          color: #dc2626;
        }

        .log-time {
          font-weight: 500;
          white-space: nowrap;
        }

        .log-message {
          flex: 1;
        }

        .instructions {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .instructions h2 {
          margin: 0 0 20px 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .instructions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .instruction-card {
          padding: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .instruction-card h3 {
          margin: 0 0 12px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .instruction-card p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .demo-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .demo-header h1 {
            font-size: 2rem;
          }

          .files-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          .instructions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Helper function to copy text to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // You could add a toast notification here
    console.log("URL copied to clipboard");
  });
}
