import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import ChatWidget from "./components/ChatWidget";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./pages/Features";
import NaturalPesticides from "./pages/NaturalPesticides";
import PestDiagnosis from "./pages/PestDiagnosis";
import MarketPrice from "./pages/MarketPrice";
import CropSuggestion from "./pages/CropSuggestion";
import CropAi from "./pages/CropAi";
import Weather from "./pages/WeatherPrediction";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import useAuthStore from "./store/useAuthStore";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        {/* Public Routes */}
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/features" element={<Features />} />
            <Route path="/natural-pesticides" element={<NaturalPesticides />} />
            <Route path="/pest-diagnosis" element={<PestDiagnosis />} />
            <Route path="/market-price" element={<MarketPrice />} />
            <Route path="/crop-suggestion" element={<CropSuggestion />} />
            <Route path="/crop-prediction" element={<CropAi />} />
            <Route path="/weather-prediction" element={<Weather />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {isAuthenticated && <ChatWidget />}
    </div>
  );
}

export default App;
