import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/navBar";
import { Button } from "@/components/button";
import { ToastNotification } from "../components/toastNotification";

export default function ResultScreen()  {
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isNotUploaded, setIsNotUploaded] = useState<boolean>(true);

  const location = useLocation();
  const navigate = useNavigate();

  const { result, confidence, imagePreview, file, userId } = location.state || {};

  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  useEffect(() => {
    if (confidence !== undefined) {
      setTimeout(() => {
        setWidth(confidence);
      }, 100);
    }
  }, [confidence]);

  const handleSave = async () => {
    if (!file || !userId) {
      setError("Missing file or user ID for saving.");
      return;
    }

    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);
      formData.append("result", result);
      formData.append("confidence", confidence);

      const res = await fetch("http://localhost:8000/save", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        setToast("✅ Saved to history successfully!");
        setIsNotUploaded(false);
      } else {
        throw new Error(json.error || "Failed to save");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save to history");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <NavBar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error && (
          <p className="text-red-500 mt-4 text-center bg-red-50 p-2 rounded-md border border-red-200">
            {error}
          </p>
        )}

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-green-800 text-center drop-shadow-sm mb-10">
          Prediction Result
        </h1>

        {/* Main content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Image Card */}
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <img
              src={imagePreview}
              alt="Uploaded"
              className="rounded-xl max-h-96 object-contain"
            />
          </div>

          {/* Result Info */}
          <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-lg border border-green-100">
            <p className="text-2xl font-semibold text-green-800">{result}</p>

            <div className="flex items-center justify-between mt-8">
              <p className="text-gray-600 font-medium">Confidence:</p>
              <p className="font-semibold text-green-700">{confidence?.toFixed(2)}%</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full w-full h-4 overflow-hidden mt-3">
              <div
                className="bg-green-500 rounded-full h-full transition-all duration-700 ease-out"
                style={{ width: `${width}%` }}
              />
            </div>

            <p className="text-sm text-gray-500 mt-6">
              Higher-grade leaves fetch better market prices.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-8">
              {isNotUploaded ? (
                <Button
                  variant="secondary"
                  className="rounded-2xl bg-green-600 hover:bg-green-600 text-white"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save to history"}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="rounded-2xl bg-green-600 hover:bg-green-600 text-white"
                  onClick={() => navigate("/history")}
                  disabled={isSaving}
                >
                  Check history
                </Button>
              )}

              <Button
                variant="empty"
                className="rounded-2xl bg-green-100 hover:bg-green-200 text-green-700"
                onClick={() => navigate("/")}
              >
                Try Another
              </Button>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <ToastNotification
          message={toast}
          onClose={() => setToast(null)}
          duration={5000}
        />
      )}
    </div>
  );
};

