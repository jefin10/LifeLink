import axios from 'axios'

// Use environment variable or fallback to relative URL for production
const API_BASE_URL = import.meta.env.VITE_API_URL || "/"; 

export const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Export api as default
export default api;

// Specific API functions
export const registerUser = async (role, email, password, additionalData = {}) => {
  const endpoint = role === "hospital" ? "/api/hospital/register" : "/api/doctors/register";
  return api.post(endpoint, { email, password, ...additionalData });
};

export const loginUser = async (role, email, password) => {
  const endpoint = role === "hospital" ? "/api/hospital/login" : "/api/doctors/login";
  return api.post(endpoint, { email, password, role });
};