"use client";

import { useState, useRef, useCallback } from "react";
import { api } from "../services/api";

const FileUpload = ({
  onFileUploaded,
  multiple = false,
  accept = "*/*",
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB for videos/audio
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    if (file.size > maxFileSize) {
      return `File "${
        file.name
      }" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`;
    }
    return null;
  };

  const handleFiles = useCallback(
    async (files) => {
      setError(null);

      // Validate files
      const validFiles = [];
      for (const file of files) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      if (!multiple && validFiles.length > 1) {
        setError("Only one file is allowed.");
        return;
      }

      if (multiple && validFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return;
      }

      setIsUploading(true);

      try {
        let response;

        if (multiple && validFiles.length > 1) {
          // Upload multiple files
          response = await api.fileServer.uploadMultipleFiles(validFiles);
          const uploadedData = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setUploadedFiles((prev) => [...prev, ...uploadedData]);

          if (onFileUploaded) {
            uploadedData.forEach((file) => onFileUploaded(file));
          }
        } else {
          // Upload single file
          response = await api.fileServer.uploadFile(validFiles[0]);
          setUploadedFiles((prev) => [...prev, response.data]);

          if (onFileUploaded) {
            onFileUploaded(response.data);
          }
        }

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setError(error.message || "Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [multiple, maxFiles, maxFileSize, onFileUploaded]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    [handleFiles]
  );

  const handleRemoveFile = async (filename) => {
    try {
      await api.fileServer.deleteFile(filename);
      setUploadedFiles((prev) =>
        prev.filter((file) => file.filename !== filename)
      );
    } catch (error) {
      console.error("Delete failed:", error);
      setError(error.message || "Delete failed. Please try again.");
    }
  };

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`file-upload-container ${className}`}>
      {/* Upload Area */}
      <div
        className={`upload-area ${isDragging ? "dragging" : ""} ${
          isUploading ? "uploading" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-content">
          {isUploading ? (
            <div className="upload-spinner">
              <div className="spinner"></div>
              <p>Uploading files...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <polyline
                    points="14,2 14,8 20,8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="16"
                    y1="13"
                    x2="8"
                    y2="13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line
                    x1="12"
                    y1="17"
                    x2="12"
                    y2="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3>Upload Files</h3>
              <p>
                Drag and drop files here, or{" "}
                <span className="browse-link">browse</span>
              </p>
              <p className="upload-info">
                {multiple ? `Maximum ${maxFiles} files` : "Single file only"} •
                Max size: {formatFileSize(maxFileSize)}
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="file-input"
          disabled={isUploading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
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
          {error}
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <div className="files-header">
            <h4>Uploaded Files ({uploadedFiles.length})</h4>
            <button onClick={clearFiles} className="clear-button" type="button">
              Clear All
            </button>
          </div>

          <div className="files-list">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.filename}-${index}`} className="file-item">
                <div className="file-info">
                  <div className="file-icon">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polyline
                        points="14,2 14,8 20,8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="file-details">
                    <p className="file-name">
                      {file.originalName || file.filename}
                    </p>
                    <p className="file-size">{formatFileSize(file.size)}</p>
                  </div>
                </div>

                <div className="file-actions">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-button view-button"
                    title="View file"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
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
                  </a>

                  <button
                    onClick={() => handleRemoveFile(file.filename)}
                    className="action-button delete-button"
                    title="Delete file"
                    type="button"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline
                        points="3,6 5,6 21,6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="10"
                        y1="11"
                        x2="10"
                        y2="17"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <line
                        x1="14"
                        y1="11"
                        x2="14"
                        y2="17"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .file-upload-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .upload-area {
          border: 2px dashed #e1e5e9;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          background: #fafbfc;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .upload-area:hover,
        .upload-area.dragging {
          border-color: #4f46e5;
          background: #f8faff;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(79, 70, 229, 0.1);
        }

        .upload-area.uploading {
          border-color: #10b981;
          background: #f0fdf4;
          cursor: not-allowed;
        }

        .upload-content {
          position: relative;
          z-index: 2;
        }

        .upload-icon {
          color: #6b7280;
          margin-bottom: 16px;
        }

        .upload-area.dragging .upload-icon,
        .upload-area:hover .upload-icon {
          color: #4f46e5;
        }

        .upload-area.uploading .upload-icon {
          color: #10b981;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        p {
          margin: 0 0 8px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .browse-link {
          color: #4f46e5;
          font-weight: 500;
          text-decoration: underline;
        }

        .upload-info {
          font-size: 12px;
          color: #9ca3af;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 1;
        }

        .upload-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top: 3px solid #10b981;
          border-radius: 50%;
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

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          padding: 12px 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
        }

        .uploaded-files {
          margin-top: 24px;
        }

        .files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .files-header h4 {
          margin: 0;
          font-size: 16px;
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

        .files-list {
          space: 8px 0;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }

        .file-item:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .file-icon {
          color: #6b7280;
          flex-shrink: 0;
        }

        .file-details {
          flex: 1;
          min-width: 0;
        }

        .file-name {
          font-weight: 500;
          color: #1f2937;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0 0 4px 0;
        }

        .file-size {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
        }

        .file-actions {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          color: #6b7280;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-button:hover {
          border-color: #d1d5db;
          transform: translateY(-1px);
        }

        .view-button:hover {
          color: #4f46e5;
          border-color: #4f46e5;
        }

        .delete-button:hover {
          color: #dc2626;
          border-color: #dc2626;
        }

        @media (max-width: 640px) {
          .upload-area {
            padding: 32px 16px;
          }

          .files-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .file-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .file-actions {
            align-self: flex-end;
          }
        }
      `}</style>
    </div>
  );
};

export default FileUpload;
