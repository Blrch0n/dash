import React, { useState, useEffect } from "react";
import { imageUtils } from "../services/api";

const ImageDisplay = ({
  imageData,
  alt = "Image",
  className = "",
  ...props
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!imageData) {
        setLoading(false);
        return;
      }

      try {
        const url = imageUtils.getImageUrl(imageData);

        if (url) {
          // Check if image exists before setting URL
          const exists = await imageUtils.checkImageExists(url);
          if (exists) {
            setImageUrl(url);
            setImageError(false);
          } else {
            console.warn(`Image not found: ${url}`);
            setImageError(true);
          }
        } else {
          setImageError(true);
        }
      } catch (error) {
        console.error("Error loading image:", error);
        setImageError(true);
      } finally {
        setLoading(false);
      }
    };

    loadImage();
  }, [imageData]);

  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} {...props}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (imageError || !imageUrl) {
    return (
      <div
        className={`bg-gray-100 border-2 border-dashed border-gray-300 ${className}`}
        {...props}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-gray-500">Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={() => setImageError(true)}
      {...props}
    />
  );
};

export default ImageDisplay;
