import { DragDropUpload } from "@/components/drag&Drop";
import { useState } from "react";
import leaf from "../assets/images/leaf.jpg";
import NavBar from "../components/navBar";
import CameraCapture from "@/components/cameraCapture";
import { Button } from "@/components/button";
import { supabase } from "@/services/supabase";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

type PredictionResponse = {
  result: string;
  confidence: number;
};

export default function HomeScreen () {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(leaf);
  const [isPredicting, setIsPredicting] = useState(false);

  const handleFiles = (files: FileList) => {
    setSelectedFiles(files);
    setCapturedFile(null);
    const imageUrl = URL.createObjectURL(files[0]);
    setPreviewImage(imageUrl);
  };

  const handleCameraCapture = (file: File) => {
    setCapturedFile(file);
    setSelectedFiles(null);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  const handlePredict = async () => {
    const file = selectedFiles ? selectedFiles[0] : capturedFile;
    if (!file) return;

    setIsPredicting(true);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User error:", userError);
      setIsPredicting(false);
      return;
    }
    const userId = userData.user.id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      // ✅ Use the configured API URL
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PredictionResponse = await res.json();

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
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-800 drop-shadow-sm">
            Tobacco Leaf Quality Detection
          </h1>
          <p className="mt-3 text-lg text-green-600">
            Upload a leaf image or capture live to get instant grading and analytics
          </p>
        </div>

        {/* Image Preview */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-green-100 hover:shadow-xl transition-shadow">
            <img
              src={previewImage}
              alt="Leaf Preview"
              className="rounded-xl max-h-[400px] object-contain"
            />
          </div>
        </div>

        {/* Upload + Camera */}
        <div className="flex flex-col items-center mt-10 gap-4 w-full max-w-xl mx-auto">
          <DragDropUpload onFilesSelected={handleFiles} />
          <CameraCapture onCapture={handleCameraCapture} />
        </div>

        {/* Predict Button */}
        {(selectedFiles || capturedFile) && (
          <div className="flex justify-center mt-6">
            <Button
              variant="secondary"
              onClick={handlePredict}
              disabled={isPredicting}
              className="cursor-pointer px-6 py-3 rounded-lg shadow-md font-semibold transform transition-transform duration-200
                hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPredicting ? "Predicting..." : "Predict"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
