// Memory-optimized FileStorageManager with lazy loading
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const VideoPlayer = dynamic(() => import("./VideoPlayer"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-32 rounded"></div>,
  ssr: false,
});

const AudioPlayer = dynamic(() => import("./AudioPlayer"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-16 rounded"></div>,
  ssr: false,
});

// Utilities
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const isVideoFile = (filename) => {
  const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov"];
  return videoExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

const isAudioFile = (filename) => {
  const audioExtensions = [".mp3", ".wav", ".ogg", ".aac", ".m4a"];
  return audioExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
};

// Memoized components for better performance
const FileItem = React.memo(
  ({ file, onDownload, onDelete, onPlayVideo, onPlayAudio }) => (
    <div className="border p-4 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm truncate">{file.filename}</h3>
        <span className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {isVideoFile(file.filename) && (
          <button
            onClick={() => onPlayVideo(file)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
          >
            Play Video
          </button>
        )}

        {isAudioFile(file.filename) && (
          <button
            onClick={() => onPlayAudio(file)}
            className="px-2 py-1 bg-green-500 text-white text-xs rounded"
          >
            Play Audio
          </button>
        )}

        <button
          onClick={() => onDownload(file.filename)}
          className="px-2 py-1 bg-gray-500 text-white text-xs rounded"
        >
          Download
        </button>

        <button
          onClick={() => onDelete(file.filename)}
          className="px-2 py-1 bg-red-500 text-white text-xs rounded"
        >
          Delete
        </button>
      </div>
    </div>
  )
);

FileItem.displayName = "FileItem";

const FileStorageManagerOptimized = () => {
  // Reduced state - combine related states
  const [data, setData] = useState({
    storageStats: null,
    storedFiles: [],
    serverFiles: [],
    searchQuery: "",
    selectedTab: "storage",
  });

  const [ui, setUI] = useState({
    loading: false,
    error: null,
    syncProgress: null,
    showVideoPlayer: false,
    showAudioPlayer: false,
  });

  const [media, setMedia] = useState({
    currentVideo: null,
    currentAudio: null,
  });

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Memoized filtered files to prevent unnecessary recalculations
  const filteredFiles = useMemo(() => {
    if (!data.searchQuery) return data.storedFiles;
    return data.storedFiles.filter((file) =>
      file.filename.toLowerCase().includes(data.searchQuery.toLowerCase())
    );
  }, [data.storedFiles, data.searchQuery]);

  // Optimized API calls with useCallback
  const fetchStorageStats = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/storage/stats`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setData((prev) => ({ ...prev, storageStats: result.data }));
      }
    } catch (error) {
      setUI((prev) => ({ ...prev, error: error.message }));
    }
  }, [API_BASE]);

  const fetchStoredFiles = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/storage/files`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (result.success) {
        setData((prev) => ({ ...prev, storedFiles: result.data.files || [] }));
      }
    } catch (error) {
      setUI((prev) => ({ ...prev, error: error.message }));
    }
  }, [API_BASE]);

  // Optimized handlers
  const handleDownload = useCallback(
    (filename) => {
      const link = document.createElement("a");
      link.href = `${API_BASE}/storage/files/${encodeURIComponent(
        filename
      )}/download`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [API_BASE]
  );

  const handleDelete = useCallback(
    async (filename) => {
      if (!confirm(`Delete "${filename}"?`)) return;

      try {
        const response = await fetch(
          `${API_BASE}/storage/files/${encodeURIComponent(filename)}`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setData((prev) => ({
            ...prev,
            storedFiles: prev.storedFiles.filter(
              (f) => f.filename !== filename
            ),
          }));
          fetchStorageStats();
        }
      } catch (error) {
        setUI((prev) => ({ ...prev, error: error.message }));
      }
    },
    [API_BASE, fetchStorageStats]
  );

  const handlePlayVideo = useCallback((file) => {
    setMedia({ currentVideo: file, currentAudio: null });
    setUI((prev) => ({
      ...prev,
      showVideoPlayer: true,
      showAudioPlayer: false,
    }));
  }, []);

  const handlePlayAudio = useCallback((file) => {
    setMedia({ currentAudio: file, currentVideo: null });
    setUI((prev) => ({
      ...prev,
      showAudioPlayer: true,
      showVideoPlayer: false,
    }));
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchStorageStats();
    fetchStoredFiles();
  }, [fetchStorageStats, fetchStoredFiles]);

  // Error display with auto-clear
  useEffect(() => {
    if (ui.error) {
      const timer = setTimeout(() => {
        setUI((prev) => ({ ...prev, error: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [ui.error]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">File Storage Manager</h1>

      {ui.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {ui.error}
        </div>
      )}

      {/* Stats */}
      {data.storageStats && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Storage Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>Files: {data.storageStats.totalFiles}</div>
            <div>Size: {data.storageStats.totalSizeFormatted}</div>
            <div>
              Last Sync:{" "}
              {data.storageStats.lastSync
                ? new Date(data.storageStats.lastSync).toLocaleString()
                : "Never"}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search files..."
          value={data.searchQuery}
          onChange={(e) =>
            setData((prev) => ({ ...prev, searchQuery: e.target.value }))
          }
          className="w-full p-2 border rounded-lg"
        />
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => (
          <FileItem
            key={file.filename}
            file={file}
            onDownload={handleDownload}
            onDelete={handleDelete}
            onPlayVideo={handlePlayVideo}
            onPlayAudio={handlePlayAudio}
          />
        ))}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">No files found</div>
      )}

      {/* Media Players - Only render when needed */}
      {ui.showVideoPlayer && media.currentVideo && (
        <VideoPlayer
          file={media.currentVideo}
          onClose={() => setUI((prev) => ({ ...prev, showVideoPlayer: false }))}
        />
      )}

      {ui.showAudioPlayer && media.currentAudio && (
        <AudioPlayer
          file={media.currentAudio}
          onClose={() => setUI((prev) => ({ ...prev, showAudioPlayer: false }))}
        />
      )}
    </div>
  );
};

export default React.memo(FileStorageManagerOptimized);
