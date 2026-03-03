// src/services/authServices.js
import axios from "../api/axios";

// Guarda tokens de sesión de forma segura
const saveTokens = (access, refresh) => {
  localStorage.setItem("token", access);
  localStorage.setItem("refresh", refresh);
};

//  Refresca el token de acceso automáticamente cuando expira
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const { data } = await axios.post("/usuarios/auth/refresh/", { refresh });
    if (data?.access) {
      localStorage.setItem("token", data.access);
      console.log("🔁 Token de acceso refrescado correctamente");
      return data.access;
    }
    return null;
  } catch (error) {
    console.warn(
      "⚠️ No se pudo refrescar el token:",
      error.response?.data || error.message,
    );
    logout();
    return null;
  }
};

// Iniciar sesión y guardar tokens
export const login = async (username, password) => {
  try {
    const { data } = await axios.post("/usuarios/auth/login/", {
      username,
      password,
    });

    saveTokens(data.access, data.refresh);

    // Si el backend no envía el usuario, lo obtenemos manualmente
    let user = data.user;
    if (!user) {
      const { data: userData } = await axios.get("/usuarios/auth/me/");
      user = userData;
    }

    localStorage.setItem("user", JSON.stringify(user));
    return { access: data.access, refresh: data.refresh, user };
  } catch (error) {
    console.error(
      "❌ Error en inicio de sesión:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

//  Registrar nuevo cliente
export const register = async ({ username, email, password }) => {
  const { data } = await axios.post("/usuarios/auth/registro/", {
    username,
    email,
    password,
  });
  return data;
};

// Obtener usuario autenticado (según token actual)
export const getMe = async () => {
  const { data } = await axios.get("/usuarios/auth/me/");
  return data;
};

// Buscar cliente por nombre de usuario (solo mesero/admin)
export const buscarClientePorUsername = async (username) => {
  const { data } = await axios.get(
    `/usuarios/auth/buscar-cliente/${username}/`,
  );
  return data;
};

// Cerrar sesión limpiamente
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
};

// Verificar si la sesión sigue activa (y refrescar si es posible)
export const checkSession = async () => {
  const token = localStorage.getItem("token");
  const refresh = localStorage.getItem("refresh");

  // Si no hay token pero sí refresh → intentar renovarlo
  if (!token && refresh) {
    const nuevoToken = await refreshToken();
    return !!nuevoToken;
  }

  // Si no hay ningún token → no hay sesión
  if (!token && !refresh) return false;

  // Si hay token → validar
  try {
    await getMe();
    return true;
  } catch {
    const nuevoToken = await refreshToken();
    return !!nuevoToken;
  }
};
