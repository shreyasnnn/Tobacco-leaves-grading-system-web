import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);

  const navigate = useNavigate();

  // Shared redirect logic — checks if profile exists
  const redirectAfterAuth = async (userId) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile check error:", profileError);
        setError("Error checking user profile.");
        return;
      }

      if (!profile) {
        navigate("/register", { state: { email: email.trim(), password } });
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Profile check exception:", err);
      setError("Error checking user profile.");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        console.log("Login error:", loginError);
        setError(loginError.message);
        return;
      }

      if (data.user) {
        await redirectAfterAuth(data.user.id);
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Unexpected error during login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: undefined, // disables email confirm redirect
          data: {},
        },
      });

      if (signupError) {
        console.log("Signup error:", signupError);
        setError(signupError.message);
        return;
      }

      if (data.user) {
        // Immediately redirect based on profile existence
        await redirectAfterAuth(data.user.id);
      } else {
        setError("Signup completed but user data is missing.");
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setError("Unexpected error during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h1>{isSignupMode ? "Sign Up" : "Login"}</h1>

      {error && (
        <div style={{
          color: "red",
          marginBottom: "10px",
          padding: "10px",
          border: "1px solid red",
          borderRadius: "4px",
          backgroundColor: "#ffeaea"
        }}>
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
      />

      <button
        onClick={isSignupMode ? handleSignup : handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          marginBottom: "10px"
        }}
      >
        {loading ? "Processing..." : (isSignupMode ? "Sign Up" : "Login")}
      </button>

      <button
        onClick={() => {
          setIsSignupMode(!isSignupMode);
          setError("");
        }}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "transparent",
          color: "#007bff",
          border: "1px solid #007bff",
          borderRadius: "4px",
          cursor: "pointer"
        }}
      >
        {isSignupMode ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
};
