import React from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/layout/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Features from "./pages/Features";
import CropSuggestion from "./pages/CropSuggestion";
import CropAi from "./pages/CropAi";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/features" element={<Features />} />
            <Route path="/crop-suggestion" element={<CropSuggestion />} />
            <Route path="/crop-prediction" element={<CropAi />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
