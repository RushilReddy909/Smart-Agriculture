import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../utils/api";

const PublicRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const res = await api.get("/auth/verify");
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/features" replace /> : <Outlet />;
};

export default PublicRoute;
