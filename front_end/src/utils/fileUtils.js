/**
 * Check if a file is a video file based on its extension
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file is a video file
 */
export const isVideoFile = (filename) => {
  const videoExtensions = [
    "mp4",
    "webm",
    "ogg",
    "avi",
    "mov",
    "wmv",
    "mkv",
    "m4v",
    "flv",
  ];
  const extension = filename.toLowerCase().split(".").pop();
  return videoExtensions.includes(extension);
};

/**
 * Check if a file is an audio file based on its extension
 * @param {string} filename - The filename to check
 * @returns {boolean} - True if the file is an audio file
 */
export const isAudioFile = (filename) => {
  const audioExtensions = ["mp3", "wav", "ogg", "aac", "flac", "m4a", "wma"];
  const extension = filename.toLowerCase().split(".").pop();
  return audioExtensions.includes(extension);
};

/**
 * Get the appropriate icon for a file based on its type
 * @param {string} filename - The filename
 * @returns {JSX.Element} - The file icon
 */
export const getFileIcon = (filename) => {
  if (isVideoFile(filename)) {
    return (
      <svg
        className="w-6 h-6 text-blue-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }

  if (isAudioFile(filename)) {
    return (
      <svg
        className="w-6 h-6 text-purple-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    );
  }

  // Default file icon
  return (
    <svg
      className="w-6 h-6 text-gray-500"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  );
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
