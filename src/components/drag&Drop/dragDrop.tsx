import React, { useState, useRef } from "react";
import { Button } from "../button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";

type DragDropUploadProps = {
  onFilesSelected: (files: FileList) => void;
};

type PredictionResponse = {
  result: string;
  confidence: number;
};

export const DragDropUpload: React.FC<DragDropUploadProps> = ({
  onFilesSelected,
}) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isPredicting, setIsPredicting] = useState(false); // ✅ new state
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(e.dataTransfer.files);
      onFilesSelected(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      onFilesSelected(e.target.files);
    }
  };

  async function handlePredict(): Promise<void> {
    if (!selectedFiles || selectedFiles.length === 0) {
      console.error("No file selected");
      return;
    }

    setIsPredicting(true); // ✅ start loading
    const file = selectedFiles[0];

    // Get logged-in user ID
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("No logged-in user or error fetching user:", userError);
      setIsPredicting(false);
      return;
    }
    const userId = userData.user.id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: PredictionResponse = await res.json();
      console.log("Prediction result:", data);

      navigate("/result", {
        state: {
          result: data.result,
          confidence: data.confidence,
          imagePreview: URL.createObjectURL(file),
          file,
          userId,
        },
      });
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsPredicting(false); // ✅ stop loading
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
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
          {isDragging
            ? "Drop files here..."
            : "Drag & drop files here, or click to select"}
        </p>
      </div>

      {selectedFiles && (
        <Button
          variant="secondary"
          onClick={handlePredict}
          disabled={isPredicting} // ✅ disable while predicting
          className="cursor-pointer px-4 py-2 rounded-lg shadow-md font-semibold transform transition-transform duration-200
            hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPredicting ? "Predicting..." : "Predict"} {/* ✅ show status */}
        </Button>
      )}
    </div>
  );
};
