// src/api/axios.js
import axios from "axios";
import { refreshToken, logout } from "../services/authServices";

// URL fija y segura para producción
const API_URL = "https://planchon.pythonanywhere.com/api";

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// 🔐 Interceptor de solicitud: adjunta token
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

// 🔄 Interceptor de respuesta: refresh token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const nuevoToken = await refreshToken();

        if (nuevoToken) {
          localStorage.setItem("token", nuevoToken);
          originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
          return instance(originalRequest);
        }
      } catch (e) {
        console.error("Error refrescando token", e);
      }

      // ❌ Token inválido o expirado definitivamente
      logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default instance;
