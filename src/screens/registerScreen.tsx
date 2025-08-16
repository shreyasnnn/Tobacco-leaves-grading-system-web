import React, { useState, useRef, ChangeEvent } from "react";
import { supabase } from "../services/supabase";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/button";

interface LocationState {
  email?: string;
  password?: string;
}

export const RegisterScreen: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const email = state?.email || "";
  const password = state?.password || "";

  // Handle file selection and preview
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setAvatarFile(file);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile);
  const validateName = (name: string) =>
    name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());

  const handleRegister = async () => {
    setError("");
    if (!name.trim()) return setError("Full name is required.");
    if (!validateName(name))
      return setError("Enter a valid name (letters only, min 2 characters).");
    if (!mobile.trim()) return setError("Mobile number is required.");
    if (!validateMobile(mobile))
      return setError("Enter a valid 10-digit Indian mobile number.");

    setLoading(true);
    setUploadProgress(0);

    try {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      const user = userData?.user;
      if (authError || !user) {
        setError("You must be logged in to complete registration.");
        setLoading(false);
        return;
      }

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (existingProfile) {
        setError("Profile already exists. Redirecting to home...");
        setTimeout(() => navigate("/"), 2000);
        setLoading(false);
        return;
      }

      let avatarUrl: string | null = null;

      if (avatarFile) {
        setUploadProgress(25);
        const fileExt = avatarFile.name.split(".").pop()?.toLowerCase();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;

        const { error: storageError } = await supabase.storage
          .from("avatars")
          .upload(`public/${fileName}`, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (storageError) {
          setError(`Avatar upload failed: ${storageError.message}`);
          setLoading(false);
          return;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(`public/${fileName}`);

        avatarUrl = publicUrl;
        setUploadProgress(75);
      } else {
        setUploadProgress(50);
      }

      const { error: insertError } = await supabase
        .from("profiles")
        .insert([
          {
            id: user.id,
            name: name.trim(),
            mobile: mobile.trim(),
            avatar_url: avatarUrl,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      setUploadProgress(100);

      if (insertError) {
        setError(`Registration failed: ${insertError.message}`);
        setLoading(false);
        return;
      }

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg border border-green-100 p-8">
        <h1 className="text-3xl font-extrabold text-green-800 text-center mb-6 drop-shadow-sm">
          Complete Your Profile
        </h1>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <p className="text-green-700 text-sm">
            <strong>Email:</strong> {email}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {loading && uploadProgress > 0 && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-2 transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-600 text-xs mt-1">
              {uploadProgress === 100
                ? "Registration complete!"
                : `Processing... ${uploadProgress}%`}
            </p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mobile Number *
          </label>
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Profile Picture (Optional)
          </label>

          {avatarPreview ? (
            <div className="flex flex-col items-center mb-4">
              <img
                src={avatarPreview}
                alt="Preview"
                className="w-28 h-28 rounded-full object-cover border-4 border-green-500"
              />
              <Button
                variant="secondary"
                className="mt-3"
                onClick={removeImage}
              >
                Remove Image
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50 cursor-pointer hover:border-green-400 hover:bg-green-50 transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-gray-600 text-sm">
                Click to select an image or drag and drop
              </p>
              <p className="text-gray-400 text-xs">
                Max size: 5MB | JPG, PNG, GIF
              </p>
            </div>
          )}

          {/* Hidden input, only triggered by clicking drag/drop area */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <Button
          variant="secondary"
          className="w-full py-3 text-lg font-bold rounded-2xl hover:bg-green-600"
          disabled={loading}
          onClick={handleRegister}
        >
          {loading ? "Creating Profile..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  );
};
