import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const Features = lazy(() => import("./pages/Features"));
const NaturalPesticides = lazy(() => import("./pages/NaturalPesticides"));
const PestDiagnosis = lazy(() => import("./pages/PestDiagnosis"));
const MarketPrice = lazy(() => import("./pages/MarketPrice"));
const CropSuggestion = lazy(() => import("./pages/CropSuggestion"));
const CropAi = lazy(() => import("./pages/CropAi"));
const Weather = lazy(() => import("./pages/WeatherPrediction"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  // Prefetch authenticated routes and ChatWidget after login for snappier nav
  useEffect(() => {
    if (isAuthenticated) {
      void Promise.all([
        import("./pages/Features"),
        import("./pages/NaturalPesticides"),
        import("./pages/PestDiagnosis"),
        import("./pages/MarketPrice"),
        import("./pages/CropSuggestion"),
        import("./pages/CropAi"),
        import("./pages/WeatherPrediction"),
        import("./components/ChatWidget"),
      ]);
    }
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <Suspense fallback={<LoadingSpinner message="Loading content..." />}>
          {/* Public Routes */}
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/features" element={<Features />} />
              <Route
                path="/natural-pesticides"
                element={<NaturalPesticides />}
              />
              <Route path="/pest-diagnosis" element={<PestDiagnosis />} />
              <Route path="/market-price" element={<MarketPrice />} />
              <Route path="/crop-suggestion" element={<CropSuggestion />} />
              <Route path="/crop-prediction" element={<CropAi />} />
              <Route path="/weather-prediction" element={<Weather />} />
            </Route>
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>

      {isAuthenticated && (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      )}
    </div>
  );
}

export default App;
