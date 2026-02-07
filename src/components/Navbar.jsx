import { Link } from "react-router-dom";
import { useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCarrito();

  const totalItems = items?.reduce((acc, item) => acc + item.cantidad, 0) || 0;

  const navbarCollapseRef = useRef(null);

  const closeNavbar = () => {
    if (navbarCollapseRef.current?.classList.contains("show")) {
      navbarCollapseRef.current.classList.remove("show");
    }
  };

  const navLinks = [];

  if (!user || user.rol === "CLIENTE") {
    navLinks.push(
      { to: "/", label: "Inicio", icon: "house-door" },
      { to: "/menu", label: "Menú", icon: "cup-straw" },
    );

    if (user) {
      navLinks.push(
        { to: "/pedidos", label: "Pedidos", icon: "bag-check" },
        { to: "/carrito", label: "Carrito", icon: "cart3" },
      );
    }

    navLinks.push({
      to: "/nosotros",
      label: "Nosotros",
      icon: "info-circle",
    });
  }

  if (user?.rol === "MESERO") {
    navLinks.push(
      { to: "/mesero", label: "Panel de Mesero", icon: "gear-fill" },
      { to: "/mesero/pedidos/nuevo", label: "Caja", icon: "clipboard-plus" },
      { to: "/mesero/pedidos/hoy", label: "Pedidos", icon: "bag-check" },
      { to: "/Register", label: "Registrar clientes", icon: "person-plus" },
    );
  }

  if (user?.rol === "COCINERO") {
    navLinks.push({
      to: "/cocina",
      label: "Preparación",
      icon: "cup-straw",
    });
  }

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark fixed-top shadow-sm"
      style={{ backgroundColor: "#1f1f1f", transition: "all 0.3s ease" }}
    >
      <div className="container py-2">
        {/* Logo */}
        <Link
          className="navbar-brand fw-bold d-flex align-items-center gap-2"
          to="#"
          onClick={closeNavbar}
          style={{ fontFamily: "Poppins, sans-serif", letterSpacing: "0.5px" }}
        >
          <i
            className="bi bi-cup-straw text-primary"
            style={{
              fontSize: "1.8rem",
              transform: "rotate(-10deg)",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "rotate(10deg)")}
            onMouseLeave={(e) => (e.target.style.transform = "rotate(-10deg)")}
          ></i>
          <span className="text-light">KRAZZ ICE</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú */}
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
          ref={navbarCollapseRef}
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-3">
            {navLinks.map((item) => (
              <li className="nav-item position-relative" key={item.to}>
                <Link
                  to={item.to}
                  onClick={closeNavbar}
                  className="nav-link d-flex align-items-center gap-2 text-light fw-semibold position-relative"
                  style={{
                    transition: "color 0.3s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.color = "rgb(26, 89, 236)")
                  }
                  onMouseLeave={(e) => (e.target.style.color = "#f8f9fa")}
                >
                  <i
                    className={`bi bi-${item.icon}`}
                    style={{ transition: "transform 0.3s ease" }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.3)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  ></i>
                  {item.label}

                  {item.icon === "cart3" && totalItems > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "0.7rem" }}
                    >
                      {totalItems}
                    </span>
                  )}
                </Link>
              </li>
            ))}

            {/* Login / Logout */}
            <li className="nav-item ms-lg-3 d-flex align-items-center gap-2">
              {user ? (
                <>
                  <span className="text-light small me-2">
                    👋 {user.username} ({user.rol})
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      closeNavbar();
                    }}
                    className="btn btn-outline-primary fw-semibold text-light px-3 py-1 rounded-pill d-flex align-items-center gap-2 shadow-sm"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={closeNavbar}
                  className="btn btn-primary fw-semibold text-dark px-3 py-1 rounded-pill d-flex align-items-center gap-2 shadow-sm"
                  style={{ transition: "all 0.3s ease" }}
                >
                  <i className="bi bi-person-fill"></i>
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
