import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { api } from "../utils/api";

const ProtectedRoute = () => {
  const [valid, setValid] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setValid(false);
        return;
      }

      try {
        await api.get("/auth/verify");
        setValid(true);
      } catch (err) {
        setValid(false);
      }
    };

    verifyToken();
  }, [token]);

  if (valid === null) return null;

  return valid ? <Outlet /> : <Navigate to={"/login"} replace />;
};

export default ProtectedRoute;
