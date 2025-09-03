import { create } from "zustand";
import { api } from "../utils/axiosInstances";

const useAuthStore = create((set) => ({
  isAuthenticated: null, // null = unknown, true/false after verification
  loading: false,

  verifyToken: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ isAuthenticated: false });
      return false;
    }

    set({ loading: true });
    try {
      await api.get("/auth/verify");
      set({ isAuthenticated: true, loading: false });
      return true;
    } catch {
      set({ isAuthenticated: false, loading: false });
      return false;
    }
  },

  login: (token) => {
    localStorage.setItem("token", token);
    set({ isAuthenticated: true });
  },

  logout: async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error("Logout request failed", e);
    }
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
  },
}));

export default useAuthStore;
