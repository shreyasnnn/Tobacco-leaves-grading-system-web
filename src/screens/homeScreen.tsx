import { DragDropUpload } from "@/components/drag&Drop";
import { useState } from "react";
import leaf from "../assets/images/leaf.webp";
import NavBar from "../components/navBar";
import CameraCapture from "@/components/cameraCapture";
import { Button } from "@/components/button";
import { supabase } from "@/services/supabase";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

// ✅ UPDATE: Add all_probabilities to response type
type PredictionResponse = {
  result: string;
  confidence: number;
  all_probabilities: Record<string, number>; // ✅ Add this
  color?: string;
  message?: string;
};

export default function HomeScreen() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(leaf);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null); // ✅ Add error state

  const handleFiles = (files: FileList) => {
    setSelectedFiles(files);
    setCapturedFile(null);
    const imageUrl = URL.createObjectURL(files[0]);
    setPreviewImage(imageUrl);
    setError(null); // Clear any previous errors
  };

  const handleCameraCapture = (file: File) => {
    setCapturedFile(file);
    setSelectedFiles(null);
    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
    setError(null); // Clear any previous errors
  };

  const handlePredict = async () => {
    const file = selectedFiles ? selectedFiles[0] : capturedFile;
    if (!file) return;

    setIsPredicting(true);
    setError(null); // Clear previous errors

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error("User error:", userError);
      setError("Authentication failed. Please log in again.");
      setIsPredicting(false);
      return;
    }
    const userId = userData.user.id;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${res.status}`);
      }
      
      const data: PredictionResponse = await res.json();

      // ✅ UPDATED: Pass all_probabilities to result screen
      navigate("/result", {
        state: {
          result: data.result,
          confidence: data.confidence,
          allProbabilities: data.all_probabilities, // ✅ Add this line
          color: data.color, // ✅ Optional: pass color if backend sends it
          imagePreview: URL.createObjectURL(file),
          file,
          userId,
        },
      });
    } catch (error: any) {
      console.error("Prediction failed:", error);
      setError(error.message || "Prediction failed. Please try again.");
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

        {/* ✅ Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-center font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Image Preview */}
        <div className="flex justify-center">
          <div className="bg-white rounded-2xl shadow-lg p-4 border border-green-100 hover:shadow-xl transition-shadow">
            <img
              rel="preload"
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
              {isPredicting ? "Predicting..." : "Predict Grade"}
            </Button>
          </div>
        )}

        {/* ✅ Loading Animation (Optional Enhancement) */}
        {isPredicting && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-3 text-green-600">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
              <span className="font-medium">Analyzing leaf quality...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
