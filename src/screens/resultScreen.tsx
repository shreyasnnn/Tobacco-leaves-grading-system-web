import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "@/components/navBar";
import { Button } from "@/components/button";
import { ToastNotification } from "../components/toastNotification";

export const ResultScreen: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState(0); // progress bar %
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isNotUploaded, setIsNotUploaded] = useState<boolean>(true);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Destructure passed state
  const { result, confidence, imagePreview, file, userId } = location.state || {};

  // ✅ Redirect to home if no state (coming back without prediction data)
  useEffect(() => {
    if (!location.state) {
      navigate("/");
    }
  }, [location.state, navigate]);

  // Animate progress bar
  useEffect(() => {
    if (confidence !== undefined) {
      setTimeout(() => {
        setWidth(confidence);
      }, 100);
    }
  }, [confidence]);

  // Save to history
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
    <div className="mx-[10%] pb-30">
      <NavBar />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <p className="text-title-m font-use-semibold text-center mt-10">
        Prediction Result
      </p>
      <div className="flex flex-row items-center justify-center gap-[5%] mt-15">
        <div>
          <img
            src={imagePreview}
            alt="Uploaded"
            className="rounded-2xl max-h-96"
          />
        </div>

        <div className="w-[30%]">
          <p className="text-title-m font-use-medium">{result}</p>

          <div className="flex items-center justify-between mt-8">
            <p className="text-title-xs">Confidence:</p>
            <p className="text-title-xs">{confidence?.toFixed(2)}%</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-use-grey-300 rounded-3xl w-full h-4 overflow-hidden mt-5">
            <div
              className="bg-use-dark rounded-3xl h-full transition-all duration-700 ease-out"
              style={{ width: `${width}%` }}
            />
          </div>

          <p className="text-title-xs mt-8">
            Higher-grade leaves fetch better market prices.
          </p>

          <div className="flex flex-col gap-3 mt-8">
            {isNotUploaded ? (
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save to history"}
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="rounded-2xl"
                onClick={() => navigate("/history")}
                disabled={isSaving}
              >
                Check history
              </Button>
            )}

            <Button
              variant="empty"
              className="bg-use-grey-200 rounded-2xl"
              onClick={() => navigate("/")}
            >
              Try Another
            </Button>
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

export default ResultScreen;