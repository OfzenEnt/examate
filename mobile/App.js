import "./global.css";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { SplashScreen } from "./screens/SplashScreen";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { InvigilatorDashboard } from "./screens/InvigilatorDashboard";
import { ExamCoordinatorDashboard } from "./screens/ExamCoordinatorDashboard";

function AppContent() {
  const { isDark } = useTheme();
  const { user, login, loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (!loading && showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 100);
      return () => clearTimeout(timer);
    }
  }, [loading, showSplash]);

  const renderDashboard = () => {
    switch (user.role) {
      case 0:
        return <InvigilatorDashboard user={user} />;
      case 1:
        return <ExamCoordinatorDashboard user={user} />;
      default:
        return <LoginScreen onLogin={login} />;
    }
  };

  if (showSplash || loading) {
    return <SplashScreen />;
  }

  if (user) {
    return renderDashboard();
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={() => setShowOnboarding(false)} />;
  }

  return <LoginScreen onLogin={login} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style={"dark"} />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
