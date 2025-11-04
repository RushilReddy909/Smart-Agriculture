import React, { useRef, useState } from "react";
import { TbUpload, TbX, TbPhoto } from "react-icons/tb";

const FileInput = ({
  onFileSelect,
  accept = "image/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = "",
  disabled = false,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return false;
    }
    if (file.size > maxSize) {
      setError(
        `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`
      );
      return false;
    }
    setError(null);
    return true;
  };

  const handleFile = (file) => {
    if (!validateFile(file)) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Convert to base64 and call callback
    const base64Reader = new FileReader();
    base64Reader.onloadend = () => {
      const base64String = base64Reader.result.split(",")[1]; // Remove data:image/...;base64, prefix
      onFileSelect(base64String, file);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null);
  };

  return (
    <div className={className}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4 transition-all duration-200
          ${
            dragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${preview ? "border-green-500" : ""}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!disabled ? handleClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
              aria-label="Remove image"
            >
              <TbX size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-green-100 rounded-full">
              <TbPhoto size={32} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Drop image here
              </p>
              <p className="text-xs text-gray-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">
              Max: {(maxSize / 1024 / 1024).toFixed(1)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <TbX size={16} />
          {error}
        </p>
      )}
    </div>
  );
};

export default FileInput;
