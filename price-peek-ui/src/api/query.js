import axios from "axios";
import refreshToken from './refreshToken';
// import { getErrorMessage } from '../utils/error/errorHandler';


const api = axios.create({
    baseURL: "https://pricepeek.ashutoshviramgama.com/",
});

// Request interceptor for adding Authorization headers
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Token has expired" &&
      !originalRequest._retry
    ) {
      console.log("Token expired, attempting to refresh...");
      originalRequest._retry = true;
      try {

        const newAccessToken = await refreshToken();
        localStorage.setItem("accessToken", newAccessToken);
        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry original request

      } catch (refreshError) {

        console.error("Refresh token failed:", refreshError);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect to login

      }
    }
    // const errorMessage = getErrorMessage(error);
    return Promise.reject(error);
  }
);

export default api;