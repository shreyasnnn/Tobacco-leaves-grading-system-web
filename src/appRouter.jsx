import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import { HomeScreen, LoginScreen, HistoryScreen, AnalysisScreen, RegisterScreen } from './screens/index';
import { supabase } from "./lib/supabaseClient";

function AppRouter() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        // Check if user has a session
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          navigate("/login", { replace: true });
          setLoading(false);
          return;
        }

        if (!session?.user) {
          // No session - redirect to login
          navigate("/login", { replace: true });
          setLoading(false);
          return;
        }

        // User has session - check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Profile check error:", profileError);
          // On error, assume profile doesn't exist and go to register
          navigate("/register", { replace: true });
          setLoading(false);
          return;
        }

        if (!profile) {
          // User exists but no profile - redirect to register
          navigate("/register", { replace: true });
        } else {
          // User exists and has profile - redirect to home
          navigate("/", { replace: true });
        }

        setLoading(false);

      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login", { replace: true });
        setLoading(false);
      }
    };

    checkAuthAndProfile();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User just signed in - check if they have a profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!profile) {
          navigate("/register", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else if (event === 'SIGNED_OUT') {
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/history' element={<HistoryScreen />} />
      <Route path='/analysis' element={<AnalysisScreen />} />
      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  )
}

export default AppRouter