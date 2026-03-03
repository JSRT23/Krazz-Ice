// src/router/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;

  const userRol = user.rol?.toUpperCase();
  const allowed = allowedRoles.map((r) => r.toUpperCase());

  if (allowed.length && !allowed.includes(userRol)) {
    console.warn("🚫 Rol no permitido → /home (403)");
    return <Navigate to="/" replace />;
  }

  return children;
}
