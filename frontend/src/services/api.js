
import axios from "axios";

// Set up Axios instance with the backend base URL
const API = axios.create({
  baseURL: "http://localhost:8000", // Backend server's URL
});
// for mobile
// const API = axios.create({
//   baseURL: "http://192.168.43.217:8000", // Backend server's URL
// });

// Request interceptor to include the latest access token in headers
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and refresh logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired, attempt to refresh it
    if (error.response?.status === 401 && error.response?.data?.message === "Access token expired" && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite retry loops

      try {
        // Request a new access token using the refresh token
        const refreshResponse = await axios.get("http://localhost:4000/api/auth/refresh-token", {
          withCredentials: true, // Send cookies (refresh token stored in cookies)
        });

        const newAccessToken = refreshResponse.data.accessToken;

        // Update localStorage and retry the original request
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return API(originalRequest); // Retry the failed request
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);

        // Handle logout or redirect to login page if refresh fails
        localStorage.removeItem("accessToken");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
