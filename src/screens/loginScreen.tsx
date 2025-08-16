import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function LoginScreen  ()  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignupMode, setIsSignupMode] = useState(false);

  const navigate = useNavigate();

  // Shared redirect logic — checks if profile exists
  const redirectAfterAuth = async (userId: string) => {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      setError("Error checking user profile.");
      return;
    }

    if (!profile) {
      navigate("/register", { state: { email: email.trim(), password } });
    } else {
      navigate("/");
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await redirectAfterAuth(data.user.id);
    }

    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError("");

    const { data, error: signupError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: undefined, data: {} },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await redirectAfterAuth(data.user.id);
    } else {
      setError("Signup completed but user data is missing.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center text-emerald-700 mb-6">
          {isSignupMode ? "Create an Account" : "Login to Your Account"}
        </h1>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={isSignupMode ? handleSignup : handleLogin}
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          {loading ? "Processing..." : isSignupMode ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={() => {
            setIsSignupMode(!isSignupMode);
            setError("");
          }}
          className="w-full mt-3 p-3 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors"
        >
          {isSignupMode
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};
