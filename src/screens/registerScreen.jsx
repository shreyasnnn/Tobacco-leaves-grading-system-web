import React, { useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";

export const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const password = location.state?.password || "";

  // Handle file selection and preview
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      return;
    }

    setAvatarFile(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate mobile number
  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return mobileRegex.test(mobile);
  };

  // Validate name
  const validateName = (name) => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name.trim());
  };

  const handleRegister = async () => {
    // Clear previous errors
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!validateName(name)) {
      setError("Please enter a valid name (letters and spaces only, minimum 2 characters).");
      return;
    }

    if (!mobile.trim()) {
      setError("Mobile number is required.");
      return;
    }

    if (!validateMobile(mobile)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError("You must be logged in to complete registration.");
        setLoading(false);
        return;
      }

      // Check if profile already exists
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileCheckError) {
        setError("Error checking existing profile. Please try again.");
        setLoading(false);
        return;
      }

      if (existingProfile) {
        setError("Profile already exists. Redirecting to home...");
        setTimeout(() => navigate("/"), 2000);
        setLoading(false);
        return;
      }

      let avatarUrl = null;

      // Upload avatar if provided
      if (avatarFile) {
        setUploadProgress(25);
        
        try {
          // Create unique filename
          const fileExt = avatarFile.name.split('.').pop().toLowerCase();
          const fileName = `${user.id}_${Date.now()}.${fileExt}`;

          console.log("Attempting to upload file:", fileName);

          const { data: storageData, error: storageError } = await supabase.storage
            .from("avatars")
            .upload(`public/${fileName}`, avatarFile, {
              cacheControl: "3600",
              upsert: true
            });

          if (storageError) {
            console.error("Avatar upload error:", storageError);
            
            // Provide specific error messages
            if (storageError.message.includes("Bucket not found")) {
              setError("Avatar storage bucket 'avatars' not found. Please create it in Supabase Storage.");
            } else if (storageError.message.includes("File size")) {
              setError("Image file is too large. Please select a smaller image (max 5MB).");
            } else if (storageError.message.includes("not allowed")) {
              setError("Invalid file type. Please select a valid image file (JPG, PNG, GIF).");
            } else if (storageError.message.includes("policy")) {
              setError("Permission denied. Please check storage policies for 'avatars' bucket.");
            } else {
              setError(`Avatar upload failed: ${storageError.message}`);
            }
            setLoading(false);
            return;
          }

          console.log("Upload successful:", storageData);

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(`public/${fileName}`);

          console.log("Public URL:", publicUrl);
          avatarUrl = publicUrl;
          setUploadProgress(75);

        } catch (uploadError) {
          console.error("Unexpected upload error:", uploadError);
          setError("Failed to upload avatar. You can add it later from your profile.");
          // Continue without avatar instead of failing completely
          avatarUrl = null;
          setUploadProgress(50);
        }
      } else {
        setUploadProgress(50);
      }

      // Insert new profile
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          name: name.trim(),
          mobile: mobile.trim(),
          avatar_url: avatarUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]);

      setUploadProgress(100);

      if (insertError) {
        console.error("Profile insert error:", insertError);
        setError(`Registration failed: ${insertError.message}`);
        setLoading(false);
        return;
      }

      // Success
      setError("");
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error("Unexpected registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      padding: "20px", 
      maxWidth: "500px", 
      margin: "0 auto",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1 style={{ textAlign: "center", color: "#333", marginBottom: "30px" }}>
        Complete Your Profile
      </h1>
      
      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: "15px", 
        borderRadius: "8px", 
        marginBottom: "20px" 
      }}>
        <p style={{ margin: "0", color: "#666" }}>
          <strong>Email:</strong> {email}
        </p>
      </div>

      {error && (
        <div style={{ 
          color: "#dc3545", 
          marginBottom: "20px", 
          padding: "12px", 
          border: "1px solid #dc3545", 
          borderRadius: "6px",
          backgroundColor: "#f8d7da"
        }}>
          {error}
        </div>
      )}

      {loading && uploadProgress > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <div style={{ 
            width: "100%", 
            height: "6px", 
            backgroundColor: "#e9ecef", 
            borderRadius: "3px",
            overflow: "hidden"
          }}>
            <div style={{ 
              width: `${uploadProgress}%`, 
              height: "100%", 
              backgroundColor: "#28a745",
              transition: "width 0.3s ease"
            }}></div>
          </div>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px", color: "#666" }}>
            {uploadProgress === 100 ? "Registration complete!" : `Processing... ${uploadProgress}%`}
          </p>
        </div>
      )}

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
          Full Name *
        </label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "2px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007bff"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
          Mobile Number *
        </label>
        <input
          type="tel"
          placeholder="Enter 10-digit mobile number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
          style={{ 
            width: "100%", 
            padding: "12px", 
            border: "2px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            boxSizing: "border-box",
            transition: "border-color 0.3s ease"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007bff"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
          Profile Picture (Optional)
        </label>
        
        {avatarPreview ? (
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <img 
              src={avatarPreview} 
              alt="Preview" 
              style={{ 
                width: "120px", 
                height: "120px", 
                borderRadius: "50%", 
                objectFit: "cover",
                border: "4px solid #007bff"
              }} 
            />
            <br />
            <button
              type="button"
              onClick={removeImage}
              style={{
                marginTop: "10px",
                padding: "6px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div style={{
            border: "2px dashed #ddd",
            borderRadius: "8px",
            padding: "30px",
            textAlign: "center",
            backgroundColor: "#fafafa"
          }}>
            <p style={{ margin: "0 0 10px 0", color: "#666" }}>
              Click to select an image or drag and drop
            </p>
            <p style={{ margin: "0", fontSize: "14px", color: "#999" }}>
              Max size: 5MB | Formats: JPG, PNG, GIF
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ 
            width: "100%", 
            padding: "10px", 
            border: "2px solid #ddd",
            borderRadius: "6px",
            fontSize: "14px",
            boxSizing: "border-box",
            backgroundColor: "white"
          }}
        />
      </div>

      <button 
        onClick={handleRegister} 
        disabled={loading}
        style={{ 
          width: "100%", 
          padding: "15px", 
          fontSize: "18px",
          fontWeight: "bold",
          backgroundColor: loading ? "#6c757d" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: loading ? "none" : "0 2px 4px rgba(0,123,255,0.3)"
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#0056b3";
            e.target.style.transform = "translateY(-1px)";
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "#007bff";
            e.target.style.transform = "translateY(0)";
          }
        }}
      >
        {loading ? "Creating Profile..." : "Complete Registration"}
      </button>

      <div style={{ 
        marginTop: "20px", 
        padding: "15px", 
        backgroundColor: "#e7f3ff", 
        borderRadius: "6px",
        fontSize: "14px",
        color: "#0056b3"
      }}>
        <p style={{ margin: "0" }}>
          <strong>📝 Note:</strong> All fields marked with * are required. 
          Your profile information will be used to personalize your experience.
        </p>
      </div>

      {/* Debug section for troubleshooting */}
      <div style={{ 
        marginTop: "20px", 
        padding: "10px", 
        backgroundColor: "#f8f9fa", 
        borderRadius: "6px",
        fontSize: "12px",
        color: "#666",
        fontFamily: "monospace"
      }}>
        <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>Debug Info:</p>
        <p style={{ margin: "0" }}>Email from state: {email || "Not provided"}</p>
        <p style={{ margin: "0" }}>User ID will be: {loading ? "Loading..." : "Available after login"}</p>
        <p style={{ margin: "0" }}>Avatar selected: {avatarFile ? avatarFile.name : "None"}</p>
      </div>
    </div>
  );
};