import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../services/api";

export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = async (file, options = {}) => {
    const {
      onSuccess,
      onError,
      validateFile = true,
      showToast = true,
    } = options;

    if (validateFile) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        const errorMsg = "Зөвхөн зургийн файл сонгоно уу!";
        if (showToast) toast.error(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return null;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = "Зургийн хэмжээ 5MB-аас бага байх ёстой!";
        if (showToast) toast.error(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return null;
      }
    }

    setUploading(true);
    setProgress(0);

    try {
      if (showToast) {
        toast.loading("Зураг ачаалж байна...", { id: "upload" });
      }

      const response = await api.upload.uploadImage(file);

      if (response.success) {
        setProgress(100);
        const fileData = response.data;

        if (showToast) {
          toast.success("Зураг амжилттай ачаалагдлаа!", { id: "upload" });
        }

        if (onSuccess) onSuccess(fileData);
        return fileData;
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Зураг ачаалахад алдаа гарлаа!";

      if (showToast) {
        toast.error(errorMsg, { id: "upload" });
      }

      if (onError) onError(error);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadMultipleImages = async (files, options = {}) => {
    const {
      onSuccess,
      onError,
      validateFiles = true,
      showToast = true,
    } = options;

    if (validateFiles) {
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          const errorMsg = "Зөвхөн зургийн файлууд сонгоно уу!";
          if (showToast) toast.error(errorMsg);
          if (onError) onError(new Error(errorMsg));
          return null;
        }

        if (file.size > 5 * 1024 * 1024) {
          const errorMsg = "Зургийн хэмжээ 5MB-аас бага байх ёстой!";
          if (showToast) toast.error(errorMsg);
          if (onError) onError(new Error(errorMsg));
          return null;
        }
      }
    }

    setUploading(true);
    setProgress(0);

    try {
      if (showToast) {
        toast.loading(`${files.length} зураг ачаалж байна...`, {
          id: "upload",
        });
      }

      const response = await api.upload.uploadMultipleImages(files);

      if (response.success) {
        setProgress(100);
        const filesData = response.data;

        if (showToast) {
          toast.success(`${files.length} зураг амжилттай ачаалагдлаа!`, {
            id: "upload",
          });
        }

        if (onSuccess) onSuccess(filesData);
        return filesData;
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Multiple upload error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Зураг ачаалахад алдаа гарлаа!";

      if (showToast) {
        toast.error(errorMsg, { id: "upload" });
      }

      if (onError) onError(error);
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (filename, options = {}) => {
    const { onSuccess, onError, showToast = true } = options;

    try {
      if (showToast) {
        toast.loading("Зураг устгаж байна...", { id: "delete" });
      }

      const response = await api.upload.deleteFile(filename);

      if (response.success) {
        if (showToast) {
          toast.success("Зураг амжилттай устгагдлаа!", { id: "delete" });
        }

        if (onSuccess) onSuccess();
        return true;
      } else {
        throw new Error(response.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Зураг устгахад алдаа гарлаа!";

      if (showToast) {
        toast.error(errorMsg, { id: "delete" });
      }

      if (onError) onError(error);
      return false;
    }
  };

  return {
    uploading,
    progress,
    uploadImage,
    uploadMultipleImages,
    deleteFile,
  };
};
