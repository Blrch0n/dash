"use client";

import React, { useState, useEffect } from "react";
import VideoPlayer from "./VideoPlayer";
import AudioPlayer from "./AudioPlayer";
import {
  isVideoFile,
  isAudioFile,
  getFileIcon,
  formatFileSize,
} from "../utils/fileUtils";

const FileStorageManager = () => {
  const [storageStats, setStorageStats] = useState(null);
  const [storedFiles, setStoredFiles] = useState([]);
  const [serverFiles, setServerFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syncProgress, setSyncProgress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedTab, setSelectedTab] = useState("storage"); // 'storage', 'server', 'migration'
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [showMigration, setShowMigration] = useState(false);
  const [error, setError] = useState(null);

  // Video and audio player state
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // Fetch storage statistics
  const fetchStorageStats = async () => {
    try {
      const response = await fetch(`${API_BASE}/storage/stats`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setStorageStats(data.data);
      } else {
        setError(data.message || "Failed to fetch storage stats");
      }
    } catch (error) {
      console.error("Error fetching storage stats:", error);
      setError(`Failed to fetch storage stats: ${error.message}`);
    }
  };
  // Fetch stored files
  const fetchStoredFiles = async () => {
    try {
      const response = await fetch(`${API_BASE}/storage/files`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setStoredFiles(data.data.files);
        setFilteredFiles(data.data.files);
      } else {
        setError(data.message || "Failed to fetch stored files");
      }
    } catch (error) {
      console.error("Error fetching stored files:", error);
      setError(`Failed to fetch stored files: ${error.message}`);
    }
  }; // Fetch server files from NGINX uploads directory
  const fetchServerFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/storage/uploaded/files`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setServerFiles(data.data.files);
      } else {
        setError(data.message || "Failed to fetch server files");
      }
    } catch (error) {
      console.error("Error fetching server files:", error);
      setError(`Failed to fetch server files: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // Fetch migration status
  const fetchMigrationStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/storage/migration/status`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        setMigrationStatus(data.data);
        // Show migration tab if there are files to migrate
        if (data.data.remaining > 0) {
          setShowMigration(true);
        }
      } else {
        setError(data.message || "Failed to fetch migration status");
      }
    } catch (error) {
      console.error("Error fetching migration status:", error);
      setError(`Failed to fetch migration status: ${error.message}`);
    }
  };

  // Migrate uploaded files
  const migrateUploadedFiles = async () => {
    if (
      !confirm(
        "This will migrate all uploaded files to the storage system. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/storage/migration/migrate`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchMigrationStatus();
        fetchStoredFiles();
        fetchStorageStats();
      } else {
        alert(`Error migrating files: ${data.message}`);
      }
    } catch (error) {
      console.error("Error migrating files:", error);
      alert("Error migrating files");
    } finally {
      setLoading(false);
    }
  };
  // Download single file to storage
  const downloadFileToStorage = async (filename) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/storage/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      const data = await response.json();
      if (data.success) {
        alert(`File "${filename}" downloaded successfully!`);
        fetchStoredFiles();
        fetchStorageStats();
      } else {
        alert(`Error downloading file: ${data.message}`);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("Error downloading file");
    } finally {
      setLoading(false);
    }
  };

  // Sync all files from server
  const syncAllFiles = async () => {
    setLoading(true);
    setSyncProgress({ current: 0, total: 0, status: "Starting sync..." });

    try {
      const response = await fetch(`${API_BASE}/storage/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ concurrency: 3 }),
      });
      const data = await response.json();

      if (data.success) {
        setSyncProgress({
          current: data.data.successful.length,
          total: data.data.total,
          status: data.message,
          successful: data.data.successful.length,
          failed: data.data.failed.length,
        });
        alert(data.message);
        fetchStoredFiles();
        fetchStorageStats();
      } else {
        alert(`Error syncing files: ${data.message}`);
      }
    } catch (error) {
      console.error("Error syncing files:", error);
      alert("Error syncing files");
    } finally {
      setLoading(false);
    }
  };

  // Delete file from storage
  const deleteStoredFile = async (filename) => {
    if (
      !confirm(`Are you sure you want to delete "${filename}" from storage?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE}/storage/files/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("File deleted successfully!");
        fetchStoredFiles();
        fetchStorageStats();
      } else {
        alert(`Error deleting file: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Error deleting file");
    }
  };
  // Download file from storage
  const downloadFromStorage = (filename) => {
    const link = document.createElement("a");
    link.href = `${API_BASE}/storage/files/${encodeURIComponent(
      filename
    )}/download`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download file directly from NGINX uploads
  const downloadUploadedFile = (filename) => {
    const link = document.createElement("a");
    link.href = `${API_BASE}/storage/uploaded/files/${encodeURIComponent(
      filename
    )}/download`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Delete file from NGINX uploads
  const deleteServerFile = async (filename) => {
    if (
      !confirm(
        `Are you sure you want to delete "${filename}" from the server? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_BASE}/storage/uploaded/files/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert(`File "${filename}" deleted successfully from server.`);
        // Refresh the server files list
        await fetchServerFiles();
      } else {
        setError(data.message || "Failed to delete file from server");
        alert(`Failed to delete file: ${data.message}`);
      }
    } catch (error) {
      console.error("Error deleting server file:", error);
      setError(`Failed to delete file: ${error.message}`);
      alert(`Error deleting file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredFiles(storedFiles);
    } else {
      const filtered = storedFiles.filter((file) =>
        file.filename.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  };
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Video player functions
  const playVideo = (filename, source = "storage") => {
    const videoUrl = `${API_BASE}/files/stream/${encodeURIComponent(filename)}`;

    console.log("Playing video:", { filename, source, videoUrl });

    setCurrentVideo({
      filename,
      url: videoUrl,
      source,
    });
    setShowVideoPlayer(true);
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setCurrentVideo(null);
  };

  // Audio player functions
  const playAudio = (filename, source = "storage") => {
    const audioUrl = `${API_BASE}/files/stream/${encodeURIComponent(filename)}`;

    setCurrentAudio({
      filename,
      url: audioUrl,
      source,
    });
    setShowAudioPlayer(true);
  };

  const closeAudioPlayer = () => {
    setShowAudioPlayer(false);
    setCurrentAudio(null);
  };

  useEffect(() => {
    fetchStorageStats();
    fetchStoredFiles();
    fetchMigrationStatus();
  }, []);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            File Storage Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Manage files downloaded from your file server
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setError(null)}
                    className="text-sm bg-red-50 text-red-800 rounded-md px-3 py-1 hover:bg-red-100"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Storage Statistics */}
        {storageStats && (
          <div className="p-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Storage Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-blue-600">
                  {storageStats.totalFiles}
                </div>
                <div className="text-sm text-gray-600">Total Files</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">
                  {storageStats.totalSizeFormatted}
                </div>
                <div className="text-sm text-gray-600">Total Size</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm font-bold text-purple-600">
                  {storageStats.lastSync
                    ? formatDate(storageStats.lastSync)
                    : "Never"}
                </div>
                <div className="text-sm text-gray-600">Last Sync</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <button
                  onClick={syncAllFiles}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Syncing..." : "Sync All Files"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sync Progress */}
        {syncProgress && (
          <div className="p-6 bg-blue-50 border-l-4 border-blue-400">
            <h3 className="font-semibold text-blue-800">Sync Progress</h3>
            <p className="text-blue-700">{syncProgress.status}</p>
            {syncProgress.total > 0 && (
              <div className="mt-2">
                <div className="bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (syncProgress.current / syncProgress.total) * 100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  {syncProgress.current} / {syncProgress.total} files
                  {syncProgress.successful !== undefined && (
                    <span>
                      {" "}
                      (✓ {syncProgress.successful} ✗ {syncProgress.failed})
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab("storage")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "storage"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Stored Files ({storedFiles.length})
            </button>
            <button
              onClick={() => {
                setSelectedTab("server");
                fetchServerFiles();
              }}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "server"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Server Files
            </button>
            {showMigration &&
              migrationStatus &&
              migrationStatus.remaining > 0 && (
                <button
                  onClick={() => setSelectedTab("migration")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === "migration"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Migration ({migrationStatus.remaining} files)
                </button>
              )}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {selectedTab === "storage" && (
            <div>
              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search stored files..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Stored Files List */}
              <div className="space-y-4">
                {filteredFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {searchQuery
                        ? "No files found matching your search."
                        : "No files stored yet."}
                    </p>
                  </div>
                ) : (
                  filteredFiles.map((file) => (
                    <div
                      key={file.filename}
                      className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {file.filename}
                        </h3>
                        <div className="text-sm text-gray-600 mt-1">
                          <span>Size: {formatFileSize(file.size)}</span>
                          <span className="ml-4">Type: {file.mimetype}</span>
                          <span className="ml-4">
                            Downloaded: {formatDate(file.downloadedAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {isVideoFile(file.filename) && (
                          <button
                            onClick={() => playVideo(file.filename, "storage")}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            <span>Play</span>
                          </button>
                        )}
                        {isAudioFile(file.filename) && (
                          <button
                            onClick={() => playAudio(file.filename, "storage")}
                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 flex items-center space-x-1"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                            </svg>
                            <span>Play</span>
                          </button>
                        )}
                        <button
                          onClick={() => downloadFromStorage(file.filename)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => deleteStoredFile(file.filename)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>{" "}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {selectedTab === "server" && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Files on Server</h2>
                <button
                  onClick={fetchServerFiles}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>

              <div className="space-y-4">
                {serverFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      {loading
                        ? "Loading server files..."
                        : "No files found on server."}
                    </p>
                  </div>
                ) : (
                  serverFiles.map((file) => {
                    const isStored = storedFiles.some(
                      (f) => f.filename === file.filename
                    );
                    return (
                      <div
                        key={file.filename}
                        className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {file.filename}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>Size: {formatFileSize(file.size)}</span>
                            <span className="ml-4">
                              Uploaded: {file.dateString}
                            </span>
                            <div className="mt-1">
                              {isStored ? (
                                <span className="text-green-600">
                                  ✓ Already in storage
                                </span>
                              ) : (
                                <span className="text-gray-500">
                                  Not in storage
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                          >
                            View Direct
                          </a>
                          <button
                            onClick={() => downloadUploadedFile(file.filename)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Download
                          </button>
                          {!isStored && (
                            <button
                              onClick={() =>
                                downloadFileToStorage(file.filename)
                              }
                              className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                            >
                              Save to Storage
                            </button>
                          )}
                          <button
                            onClick={() => deleteServerFile(file.filename)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {selectedTab === "migration" && migrationStatus && (
            <div>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-blue-800 mb-2">
                  File Migration
                </h2>
                <p className="text-blue-700 mb-4">
                  You have {migrationStatus.remaining} files in your uploads
                  directory that can be migrated to the storage system.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-bold text-blue-600">
                      {migrationStatus.totalUploaded}
                    </div>
                    <div className="text-sm text-gray-600">Total Uploaded</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-bold text-green-600">
                      {migrationStatus.totalMigrated}
                    </div>
                    <div className="text-sm text-gray-600">
                      Already Migrated
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-lg font-bold text-orange-600">
                      {migrationStatus.remaining}
                    </div>
                    <div className="text-sm text-gray-600">Remaining</div>
                  </div>
                </div>
                {migrationStatus.remaining > 0 && (
                  <button
                    onClick={migrateUploadedFiles}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? "Migrating..." : "Migrate All Files"}
                  </button>
                )}
              </div>

              {/* Files to migrate */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Files to Migrate:</h3>
                {migrationStatus.uploadedFiles.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No files found in uploads directory.
                    </p>
                  </div>
                ) : (
                  migrationStatus.uploadedFiles.map((file) => {
                    const isAlreadyMigrated =
                      migrationStatus.migratedFiles.some(
                        (m) => m.filename === file.filename
                      );
                    return (
                      <div
                        key={file.filename}
                        className="bg-gray-50 p-4 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {file.filename}
                          </h3>
                          <div className="text-sm text-gray-600 mt-1">
                            <span>Size: {formatFileSize(file.size)}</span>
                            <span className="ml-4">Path: {file.path}</span>
                            {isAlreadyMigrated && (
                              <span className="ml-4 text-green-600">
                                ✓ Already migrated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Player Overlay */}
      {showVideoPlayer && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
            <div className="relative">
              <button
                onClick={closeVideoPlayer}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />
                </svg>
              </button>
              <VideoPlayer
                src={currentVideo.url}
                onClose={closeVideoPlayer}
                filename={currentVideo.filename}
              />
            </div>
          </div>
        </div>
      )}

      {/* Audio Player Overlay */}
      {showAudioPlayer && currentAudio && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full">
            <div className="relative">
              <button
                onClick={closeAudioPlayer}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" />
                </svg>
              </button>
              <AudioPlayer
                src={currentAudio.url}
                onClose={closeAudioPlayer}
                filename={currentAudio.filename}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileStorageManager;
