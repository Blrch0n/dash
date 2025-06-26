import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks
const MAX_CONCURRENT_UPLOADS = 3; // Upload 3 chunks concurrently

export const useChunkedUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const uploadFileInChunks = useCallback(async (file, options = {}) => {
    const { onSuccess, onError, onProgress, showToast = true } = options;

    if (!file) {
      const error = new Error("No file provided");
      if (onError) onError(error);
      return null;
    }

    // For small files, use regular upload
    if (file.size < CHUNK_SIZE) {
      return uploadFileRegular(file, options);
    }

    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

    setUploading(true);
    setProgress(0);

    if (showToast) {
      toast.loading(`Uploading ${file.name} in ${totalChunks} chunks...`, {
        id: "chunk-upload",
      });
    }

    try {
      // Step 1: Initialize upload
      const initResponse = await fetch(
        `${API_BASE}/upload-chunked/chunk/init`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            totalChunks,
          }),
        }
      );

      if (!initResponse.ok) {
        throw new Error("Failed to initialize upload");
      }

      const { data: initData } = await initResponse.json();
      const { uploadId, fileName } = initData;

      // Step 2: Upload chunks with concurrency control
      const uploadPromises = [];
      let completedChunks = 0;

      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        // Control concurrency
        if (uploadPromises.length >= MAX_CONCURRENT_UPLOADS) {
          await Promise.race(uploadPromises);
        }

        const uploadPromise = uploadChunk(
          chunk,
          uploadId,
          chunkIndex,
          totalChunks,
          fileName
        )
          .then(() => {
            completedChunks++;
            const progressPercent = Math.round(
              (completedChunks / totalChunks) * 90
            ); // Reserve 10% for assembly
            setProgress(progressPercent);
            if (onProgress) onProgress(progressPercent);
          })
          .catch((error) => {
            console.error(`Chunk ${chunkIndex} upload failed:`, error);
            throw error;
          });

        uploadPromises.push(uploadPromise);
      }

      // Wait for all chunks to complete
      await Promise.all(uploadPromises);

      // Step 3: Complete upload (assemble chunks)
      setProgress(95);
      const completeResponse = await fetch(
        `${API_BASE}/upload-chunked/chunk/complete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uploadId,
            fileName,
            totalChunks,
            originalFileName: file.name,
          }),
        }
      );

      if (!completeResponse.ok) {
        throw new Error("Failed to complete upload");
      }

      const { data: result } = await completeResponse.json();

      setProgress(100);

      if (showToast) {
        toast.success(`${file.name} uploaded successfully!`, {
          id: "chunk-upload",
        });
      }

      if (onSuccess) onSuccess(result);
      return result;
    } catch (error) {
      console.error("Chunked upload error:", error);

      if (showToast) {
        toast.error(`Upload failed: ${error.message}`, { id: "chunk-upload" });
      }

      if (onError) onError(error);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, []);

  const uploadChunk = async (
    chunk,
    uploadId,
    chunkIndex,
    totalChunks,
    fileName
  ) => {
    const formData = new FormData();
    formData.append("chunk", chunk);
    formData.append("uploadId", uploadId);
    formData.append("chunkIndex", chunkIndex);
    formData.append("totalChunks", totalChunks);
    formData.append("fileName", fileName);

    const response = await fetch(`${API_BASE}/upload-chunked/chunk/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Chunk ${chunkIndex} upload failed`);
    }

    return response.json();
  };

  const uploadFileRegular = async (file, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch(`${API_BASE}/upload/single`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      if (showToast) {
        toast.success(`${file.name} uploaded successfully!`);
      }

      if (onSuccess) onSuccess(result.data);
      return result.data;
    } catch (error) {
      if (showToast) {
        toast.error(`Upload failed: ${error.message}`);
      }
      if (onError) onError(error);
      return null;
    }
  };

  return {
    uploadFileInChunks,
    uploading,
    progress,
  };
};
