import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
    withCredentials: true,
});

// Request interceptor to attach token from localStorage
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage (Zustand persist storage)
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
            try {
                const { state } = JSON.parse(authStorage);
                const token = state?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error("Error parsing auth storage:", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // For now, we just reject the promise
        }
        return Promise.reject(error);
    }
);

export default api;
