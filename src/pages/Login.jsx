import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await login(username, password);
      const rol = user?.rol?.toUpperCase();

      if (rol === "MESERO") navigate("/mesero");
      else if (rol === "COCINERO") navigate("/cocina");
      else navigate("/");
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <motion.div
        className="card shadow-lg border-0 p-5"
        style={{
          width: "100%",
          maxWidth: "460px",
          backgroundColor: "#ffffff",
          borderRadius: "18px",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* LOGO KRAZZ ICE */}
        <div className="text-center mb-4">
          <motion.img
            src="/LogoKrazz.jpeg"
            alt="Krazz Ice"
            style={{
              width: "110px",
              height: "110px",
              objectFit: "contain",
            }}
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          />

          <h4 className="fw-bold mt-3" style={{ color: "#0f2027" }}>
            KRAZZ ICE
          </h4>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger py-2 text-center">{error}</div>
          )}

          {/* USUARIO */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Usuario</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiUser />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Tu usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          {/* CONTRASEÑA */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FiLock />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="input-group-text bg-light border-0"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* BOTÓN */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="btn w-100 text-white fw-semibold py-2"
            style={{
              background: "linear-gradient(135deg, #00c6ff, #0072ff)",
              border: "none",
              borderRadius: "10px",
            }}
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
