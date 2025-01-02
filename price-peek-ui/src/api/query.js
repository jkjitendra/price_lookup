import axios from "axios";
import { useNavigate } from 'react-router-dom';
import refreshToken from './refreshToken';
import useAuth from '../hooks/useAuth';

const api = axios.create({
    baseURL: "https://pricepeek.ashutoshviramgama.com/",
});

api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const {logout} = useAuth();
    const navigate = useNavigate();
    const originalRequest = error.config;
    console.log('Error status:', error);

    // If token expired and the request is not retried
    if (error.response?.status === 401
        && error.response?.data?.message === 'Token has expired' 
        && !originalRequest._retry
    ) {
      console.log('Token expired, attempting to refresh...');
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Refresh token expired', err.response?.data || err.messagerr);
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        logout();
        navigate("/login") // Redirect to login page
      }
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;