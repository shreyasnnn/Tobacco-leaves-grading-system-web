import React, { useRef, useState, useEffect } from "react";
import { Button } from "./button";
import { Camera } from "lucide-react";

export default function CameraCapture({
  onCapture,
}: {
  onCapture: (file: File) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError("");

      // Show video first
      setCameraActive(true);

      // Wait a tick so video is rendered
      await new Promise((resolve) => setTimeout(resolve, 50));

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Wait for metadata so videoWidth/Height is available
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch((err) => {
            console.error("Video play error:", err);
            setError("Unable to play camera. Try again.");
          });
        };
      }

      setStream(mediaStream);
    } catch (err) {
      console.error("Camera error:", err);
      setError(
        "Unable to access camera. Please allow permissions and use HTTPS."
      );
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      setError("Camera not ready yet. Try again in a second.");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        onCapture(file);

        // stop tracks after capture
        stream?.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
      }
    }, "image/jpeg");
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}

      {!cameraActive && (
        <Button
        variant="secondary"
          onClick={startCamera}
          className=" text-white px-6 py-2 rounded-lg hover:bg-green-600"
        >
          <Camera />Start Camera
        </Button>
      )}

      {cameraActive && (
        <div className="flex items-center flex-col ">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg max-w-full border border-gray-300"
          />
          <Button
          variant="secondary"
            onClick={capturePhoto}
            className="px-4 py-2 rounded-full hover:bg-green-600 mt-2"
          >
            <Camera />
          </Button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
