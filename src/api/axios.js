// src/api/axios.js
import axios from "axios";
import { refreshToken, logout } from "../services/authServices";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://planchon.pythonanywhere.com/api",
  timeout: 8000,
});

//Interceptor de solicitud → adjunta token si existe
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de respuesta → intenta refrescar token si expira
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado ya refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const nuevoToken = await refreshToken();
      if (nuevoToken) {
        // Reintenta la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
        return instance(originalRequest);
      }

      // Si no se pudo refrescar → cerrar sesión
      logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default instance;
