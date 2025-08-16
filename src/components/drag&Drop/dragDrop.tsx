import React, { useState, useRef } from "react";

type DragDropUploadProps = {
  onFilesSelected: (files: FileList) => void;
};

export const DragDropUpload: React.FC<DragDropUploadProps> = ({ onFilesSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  return (
    <div
      className={`w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleFileChange}
      />
      <h2 className="font-bold text-lg mb-1">Click to upload</h2>
      <p className="text-gray-600 mb-1">JPG, PNG — Max size 50MB</p>
      <p className="text-sm text-gray-500">
        {isDragging ? "Drop files here..." : "Drag & drop files here, or click to select"}
      </p>
    </div>
  );
};
