"use client";

import { useState, useRef, useCallback } from "react";
import { useChunkedUpload } from "../hooks/useChunkedUpload";
import { api } from "../services/api";

const EnhancedFileUpload = ({
  onFileUploaded,
  multiple = false,
  accept = "*/*",
  maxFiles = 20,
  maxFileSize = 1024 * 1024 * 1024, // 1GB
  className = "",
  useChunking = true, // New prop to enable/disable chunking
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const {
    uploadFileInChunks,
    uploading: chunkUploading,
    progress: chunkProgress,
  } = useChunkedUpload();

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

  const uploadSingleFile = useCallback(
    async (file) => {
      const fileId = `${file.name}-${Date.now()}`;

      try {
        setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

        let result;

        if (useChunking && file.size > 5 * 1024 * 1024) {
          // Use chunking for files > 5MB
          result = await uploadFileInChunks(file, {
            onProgress: (progress) => {
              setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
            },
            onSuccess: (data) => {
              console.log("Chunked upload successful:", data);
            },
            onError: (error) => {
              console.error("Chunked upload failed:", error);
              throw error;
            },
            showToast: false, // We'll handle toasts ourselves
          });
        } else {
          // Use regular upload for smaller files
          const response = await api.fileServer.uploadFile(file);
          result = response.data;
        }

        if (result) {
          setUploadedFiles((prev) => [...prev, result]);
          if (onFileUploaded) {
            onFileUploaded(result);
          }
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));

          // Remove progress after a delay
          setTimeout(() => {
            setUploadProgress((prev) => {
              const newProgress = { ...prev };
              delete newProgress[fileId];
              return newProgress;
            });
          }, 2000);
        }

        return result;
      } catch (error) {
        console.error("Upload failed:", error);
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
        throw error;
      }
    },
    [uploadFileInChunks, onFileUploaded, useChunking]
  );

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

      setUploading(true);

      try {
        if (multiple && validFiles.length > 1) {
          // Upload multiple files with concurrency control
          const concurrentLimit = 3;
          const results = [];

          for (let i = 0; i < validFiles.length; i += concurrentLimit) {
            const batch = validFiles.slice(i, i + concurrentLimit);
            const batchPromises = batch.map(uploadSingleFile);
            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result, index) => {
              if (result.status === "fulfilled" && result.value) {
                results.push(result.value);
              } else {
                console.error(
                  `Upload failed for ${batch[index].name}:`,
                  result.reason
                );
              }
            });
          }

          if (results.length !== validFiles.length) {
            setError(
              `${validFiles.length - results.length} files failed to upload.`
            );
          }
        } else {
          // Upload single file
          await uploadSingleFile(validFiles[0]);
        }

        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Upload failed:", error);
        setError(error.message || "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [multiple, maxFiles, uploadSingleFile]
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

  const clearFiles = () => {
    setUploadedFiles([]);
    setError(null);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isAnyUploading = uploading || chunkUploading;

  return (
    <div className={`enhanced-file-upload ${className}`}>
      {/* Upload Area */}
      <div
        className={`upload-area ${isDragging ? "dragging" : ""} ${
          isAnyUploading ? "uploading" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isAnyUploading && fileInputRef.current?.click()}
      >
        <div className="upload-content">
          {isAnyUploading ? (
            <div className="upload-progress">
              <div className="progress-spinner"></div>
              <p>Uploading files...</p>
              {chunkProgress > 0 && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${chunkProgress}%` }}
                  ></div>
                  <span className="progress-text">{chunkProgress}%</span>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <polyline
                    points="7,10 12,5 17,10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="5"
                    x2="12"
                    y2="15"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              <h3>Drop files here or click to browse</h3>
              <p>
                Supports files up to {formatFileSize(maxFileSize)}
                {useChunking && " (Large files uploaded in chunks)"}
              </p>
              <p className="upload-info">
                {multiple ? `Maximum ${maxFiles} files` : "Single file upload"}
              </p>
            </>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          disabled={isAnyUploading}
          className="file-input"
        />
      </div>

      {/* Progress Indicators */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-list">
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="file-progress">
              <span className="file-name">{fileId.split("-")[0]}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
                <span className="progress-text">{progress}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <div className="files-header">
            <h4>Uploaded Files ({uploadedFiles.length})</h4>
            <button onClick={clearFiles} className="clear-button">
              Clear All
            </button>
          </div>

          <div className="files-list">
            {uploadedFiles.map((file, index) => (
              <div key={`${file.filename}-${index}`} className="file-item">
                <div className="file-info">
                  <span className="file-name">
                    {file.originalName || file.filename}
                  </span>
                  <span className="file-size">{formatFileSize(file.size)}</span>
                </div>
                <div className="file-actions">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-button"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .enhanced-file-upload {
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
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
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

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .progress-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e1e5e9;
          border-top: 4px solid #10b981;
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

        .progress-bar {
          width: 100%;
          max-width: 300px;
          height: 8px;
          background: #e1e5e9;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #10b981;
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: 500;
          color: #374151;
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

        .upload-progress-list {
          margin-top: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .file-progress {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .file-name {
          flex: 1;
          font-size: 14px;
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .uploaded-files {
          margin-top: 24px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .files-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .files-header h4 {
          margin: 0;
          font-size: 16px;
          color: #374151;
        }

        .clear-button {
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .clear-button:hover {
          background: #dc2626;
        }

        .files-list {
          max-height: 300px;
          overflow-y: auto;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .file-item:last-child {
          border-bottom: none;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .file-name {
          font-size: 14px;
          color: #374151;
          font-weight: 500;
        }

        .file-size {
          font-size: 12px;
          color: #6b7280;
        }

        .view-button {
          padding: 6px 12px;
          background: #4f46e5;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 12px;
        }

        .view-button:hover {
          background: #4338ca;
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

        .upload-info {
          font-size: 12px;
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default EnhancedFileUpload;
