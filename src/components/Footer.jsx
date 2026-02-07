import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function Footer() {
  return (
    <footer
      className="text-white pt-5 pb-3 mt-auto"
      style={{
        backgroundColor: "#1f1f1f",
        borderTop: "3px solid #075eff",
      }}
    >
      <div className="container">
        <div className="row gy-4">
          {/* LOGO Y DESCRIPCIÓN */}
          <div className="col-md-4">
            <h5 className="fw-bold d-flex align-items-center mb-3">
              <i
                className="bi bi-cup-straw text-primary me-2"
                style={{
                  fontSize: "1.6rem",
                  transform: "rotate(-8deg)",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.target.style.transform = "rotate(8deg)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "rotate(-8deg)")
                }
              ></i>
              KRAZZ ICE
            </h5>
            <p className="small text-white-50">
              Sabores que refrescan, conectan y acompañan cada plan, desde una
              tarde relajada hasta una noche que no se olvida
            </p>

            {/* ICONOS DE REDES */}
            <div className="d-flex gap-3 mt-3">
              {[
                { icon: "facebook", url: "#" },
                { icon: "instagram", url: "#" },
                { icon: "twitter-x", url: "#" },
                { icon: "tiktok", url: "#" },
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  className="text-primary fs-5"
                  style={{
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fff")}
                  onMouseLeave={(e) => (e.target.style.color = "#1d0aeadd")}
                >
                  <i className={`bi bi-${social.icon}`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* ENLACES ÚTILES */}
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase text-primary mb-3">
              Enlaces
            </h6>
            <ul className="list-unstyled">
              {[
                { to: "/", label: "Inicio", icon: "house-door" },
                { to: "/menu", label: "Menú", icon: "cup-straw" },
                { to: "/nosotros", label: "Nosotros", icon: "info-circle" },
              ].map((item) => (
                <li key={item.to} className="mb-2">
                  <a
                    href={item.to}
                    className="text-white-50 text-decoration-none d-flex align-items-center gap-2"
                    style={{ transition: "color 0.3s ease" }}
                    onMouseEnter={(e) => (e.target.style.color = "#2807ff")}
                    onMouseLeave={(e) => (e.target.style.color = "#adb5bd")}
                  >
                    <i className={`bi bi-${item.icon}`}></i> {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACTO */}
          <div className="col-md-4">
            <h6 className="fw-bold text-uppercase text-primary mb-3">
              Contacto
            </h6>
            <p className="small text-white-50 mb-2">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i>
              Calle 4 # 10-65, Palo de agua
            </p>
            <p className="small text-white-50 mb-2">
              <i className="bi bi-telephone-fill text-primary me-2"></i>
              +123 456 7890
            </p>
            <p className="small text-white-50 mb-0">
              <i className="bi bi-envelope-fill text-primary me-2"></i>
              info@coffeehouse.com
            </p>
          </div>
        </div>

        <hr className="border-secondary mt-4 mb-3" />

        <div className="text-center">
          <p className="small text-white-50 mb-0">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-primary fw-semibold">Krazz Ice</span>. Todos
            los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
