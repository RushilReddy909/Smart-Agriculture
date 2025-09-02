import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading || isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
