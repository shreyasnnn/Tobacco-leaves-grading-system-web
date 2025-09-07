import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./services/supabase";
import Spinner from "./components/spinner";
import HomeScreen from "./screens/homeScreen";

// Lazy imports
const LoginScreen = lazy(() => import("./screens/loginScreen"));
const RegisterScreen = lazy(() => import("./screens/registerScreen"));
const ResultScreen = lazy(() => import("./screens/resultScreen"));
const HistoryScreen = lazy(() => import("./screens/historyScreen"));
const AnalysisScreen = lazy(() => import("./screens/analysisScreen"));
const AboutScreen = lazy(() => import("./screens/aboutScreen"));

function AppRouter() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        const session = data.session;

        if (!session?.user) {
          if (isMounted) setLoading(false);
          if (location.pathname !== "/login") {
            navigate("/login", { replace: true });
          }
          return;
        }

        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        if (!profile && location.pathname !== "/register") {
          navigate("/register", { replace: true });
        }

        if (isMounted) setLoading(false);
      } catch (error) {
        console.error("Auth error:", error);
        if (isMounted) setLoading(false);
        if (location.pathname !== "/login") {
          navigate("/login", { replace: true });
        }
      }
    };

    checkAuthAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" && location.pathname === "/login") {
        navigate("/", { replace: true });
      } else if (event === "SIGNED_OUT") {
        navigate("/login", { replace: true });
      }
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, location]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
          color: "#666",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/result" element={<ResultScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/analysis" element={<AnalysisScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
