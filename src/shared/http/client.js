import axios from "axios";

const baseURL = import.meta?.env?.VITE_API_URL || "/api";
const client = axios.create({ baseURL });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("__token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401) {
      // Optionally redirect to login
    }
    return Promise.reject(err);
  }
);

export default client;
