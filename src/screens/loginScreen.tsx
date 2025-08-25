import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { LeafIcon } from "lucide-react";

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

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-green-200">
      {/* Animated Background with Tobacco Leaf Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-pulse">
          <LeafIcon
            className="w-32 h-32 text-green-600 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
        <div className="absolute top-32 right-20 animate-pulse delay-300">
          <LeafIcon
            className="w-32 h-32 text-green-600 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
        <div className="absolute bottom-20 left-32 animate-pulse delay-700">
          <LeafIcon
            className="w-32 h-32 text-green-600 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
        <div className="absolute bottom-32 right-16 animate-pulse delay-1000">
          <LeafIcon
            className="w-32 h-32 text-green-600 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
        <div className="absolute top-48 left-1/2 animate-pulse delay-500">
          <LeafIcon
            className="w-32 h-32 text-green-600 transform rotate-12"
            fill="currentColor"
            viewBox="0 0 24 24"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-600 rounded-full mb-4 shadow-lg">
              <LeafIcon className="w-10 h-10" stroke="white"/>
            </div>
            <h1 className="text-3xl font-bold text-emerald-800 mb-2">
              ToboGrade
            </h1>
            <p className="text-emerald-600 text-sm">
              Intelligent Tobacco Leaf Classification
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSignupMode ? "Create Your Account" : "Welcome Back"}
              </h2>
              <p className="text-gray-600 text-sm">
                {isSignupMode
                  ? "Join the future of tobacco leaf grading"
                  : "Sign in to access your analytics dashboard"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50 hover:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    placeholder={
                      isSignupMode
                        ? "Create a password (min. 6 characters)"
                        : "Enter your password"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50 hover:bg-white"
                    required
                    minLength={isSignupMode ? 6 : undefined}
                  />
                </div>
              </div>

              <button
                onClick={isSignupMode ? handleSignup : handleLogin}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-white font-semibold transition-all transform ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {isSignupMode ? (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                        Create Account
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign In
                      </>
                    )}
                  </div>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsSignupMode(!isSignupMode);
                  setError("");
                  setEmail("");
                  setPassword("");
                }}
                className="w-full py-3 rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold transition-all transform hover:scale-105 active:scale-95"
              >
                {isSignupMode
                  ? "Already have an account? Sign In"
                  : "New to LeafGrade? Create Account"}
              </button>
            </form>

            {/* Features Preview */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center mb-4">
                What you'll get:
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  AI-powered grading
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Personal analytics
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  History tracking
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Expert insights
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-emerald-700">
            <p>Powered by advanced AI • Trusted by farmers worldwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};
