import axios from "axios";
import useAuthStore from "../store/useAuthStore";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // normal response
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // prevent infinite loop

      try {
        // Call refresh endpoint; HttpOnly cookie sent automatically
        const refreshRes = await axios.post(
          "/api/auth/refresh",
          {},
          { withCredentials: true }
        );

        // Update access token in localStorage (or memory)
        const newAccessToken = refreshRes.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        useAuthStore.getState().logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
