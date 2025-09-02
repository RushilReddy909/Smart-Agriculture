import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading || isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/features" replace /> : <Outlet />;
};

export default PublicRoute;
