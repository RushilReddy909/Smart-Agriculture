import React, { useRef, useState } from "react";
import { TbUpload, TbFile } from "react-icons/tb";
import Card from "./Card";

const FileInput = ({
  label,
  name,
  onChange,
  error,
  className = "",
  accept = "image/*",
  ...props
}) => {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  // Triggers the hidden file input click
  const handleClick = () => {
    inputRef.current.click();
  };

  // Handles file selection and updates the component state/parent form
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      onChange(event);
    } else {
      setFileName("");
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}

      {/* Hidden native input, linked by ref */}
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        name={name}
        accept={accept}
        className="hidden"
        {...props}
      />

      {/* Custom styled file picker area - uses Card component */}
      <Card
        padding="md"
        className={`w-full border-2 border-dashed transition-colors duration-200 ${
          error
            ? "border-red-500 bg-red-50 hover:bg-red-100"
            : "border-gray-300 hover:border-green-500 bg-gray-50 hover:bg-green-50"
        } ${fileName ? "border-green-500 bg-green-50" : ""}`}
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <div className="text-center">
          {fileName ? (
            <div className="flex items-center justify-center text-green-700">
              <TbFile size={24} className="mr-2" />
              <span className="text-sm font-medium truncate">{fileName}</span>
            </div>
          ) : (
            <div className="text-gray-500">
              <TbUpload size={24} className="mx-auto mb-1" />
              <p className="text-sm font-medium">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-400">
                {`Accepts ${accept.split("/").pop()} formats.`}
              </p>
            </div>
          )}
        </div>
      </Card>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileInput;
