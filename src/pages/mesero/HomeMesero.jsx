import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function HomeMesero() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Realizar Pedido",
      description:
        "Crea un nuevo pedido desde cero, selecciona tus granizados y confirma la orden.",
      emoji: "🍧",
      btnText: "Ir a crear →",
      color: "#00c6ff",
      route: "/mesero/pedidos/nuevo",
      img: "/fondo.webp",
    },
    {
      title: "Modificar Pedidos",
      description:
        "Consulta los pedidos del día y actualiza su estado en tiempo real.",
      emoji: "🧊",
      btnText: "Ver pedidos →",
      color: "#0072ff",
      route: "/mesero/pedidos/hoy",
      img: "/Nosotros(KrazzIce).jpeg",
    },
    {
      title: "Registrar Cliente",
      description:
        "Registra nuevos clientes para agilizar pedidos y mejorar la atención.",
      emoji: "🧑‍💼",
      btnText: "Nuevo cliente →",
      color: "#00b894",
      route: "/register",
      img: "/Logokrazz.jpeg",
    },
  ];

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #e0f7fa, #b2ebf2)",
        padding: "50px 20px",
      }}
    >
      {/* 🔑 container-fluid para que entren 3 */}
      <div className="container-fluid" style={{ maxWidth: "1400px" }}>
        <div className="row g-4 justify-content-center">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              className="col-12 col-md-6 col-lg-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="card border-0 shadow-lg h-100 overflow-hidden"
                style={{
                  borderRadius: "2rem",
                  cursor: "pointer",
                  background: "#ffffff",
                }}
                onClick={() => navigate(card.route)}
              >
                {/* Imagen */}
                <div className="position-relative" style={{ height: "220px" }}>
                  <img
                    src={card.img}
                    alt={card.title}
                    className="w-100 h-100"
                    style={{
                      objectFit: "cover",
                      filter: "brightness(0.85)",
                    }}
                  />
                  <motion.div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: `linear-gradient(135deg, ${card.color}33, #00000022)`,
                      opacity: 0,
                    }}
                    whileHover={{ opacity: 0.25 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Contenido */}
                <div className="card-body text-center p-4">
                  <div className="display-4 mb-3">{card.emoji}</div>
                  <h4 className="fw-bold mb-3" style={{ color: card.color }}>
                    {card.title}
                  </h4>
                  <p className="text-secondary mb-4">{card.description}</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn text-white fw-bold px-5 py-2"
                    style={{
                      background: `linear-gradient(90deg, ${card.color}, #00aaff)`,
                      borderRadius: "30px",
                      border: "none",
                      boxShadow: `0 6px 12px ${card.color}66`,
                    }}
                  >
                    {card.btnText}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
