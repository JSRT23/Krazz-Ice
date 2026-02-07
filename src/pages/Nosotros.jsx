import { motion } from "framer-motion";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaUserTie, FaHeart, FaArrowLeft } from "react-icons/fa";
import { FaGlassWater } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Nosotros() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        background: "#fffaf3",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* 🔙 BOTÓN DE VOLVER */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: "fixed",
          top: "20px",
          left: "12px",
          zIndex: 1000,
          maxWidth: "100vw",
        }}
      >
        <Button
          variant="warning"
          className="rounded-circle shadow-sm d-flex align-items-center justify-content-center"
          style={{
            width: "45px",
            height: "45px",
            padding: 0,
            border: "none",
          }}
          onClick={() => navigate("/")}
        >
          <FaArrowLeft size={20} color="#fff" />
        </Button>
      </motion.div>

      {/* ☕ SECCIÓN PRINCIPAL */}
      <section className="py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="mb-4 mb-md-0">
              <motion.img
                src="/NosotrosKI.jpeg"
                alt="Café y ambiente"
                className="img-fluid rounded-4 shadow"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "450px",
                  objectFit: "cover",
                }}
              />
            </Col>

            <Col md={6}>
              <h1 className="fw-bold text-brown mb-3">Sobre KRAZZ ICE</h1>
              <p className="text-muted">
                Krazz Ice nace del amor por los sabores intensos y las
                experiencias bien frías. Creemos en granizados de calidad,
                combinaciones auténticas y en cuidar cada detalle para que cada
                sorbo se convierta en un momento especial.
              </p>
              <p className="text-muted">
                Desde nuestros inicios, buscamos crear un espacio donde todos se
                sientan cómodos y conectados, ya sea para refrescar una tarde
                tranquila o para disfrutar una noche con más energía. Hoy
                seguimos innovando con nuevos sabores, opciones con y sin
                alcohol y una vibra que mezcla frescura, actitud y estilo
                propio.
              </p>
            </Col>
          </Row>

          {/* 💛 SECCIÓN DE INFORMACIÓN */}
          <Row className="mt-5 text-center">
            <Col md={4} className="mb-4 mb-md-0">
              <FaGlassWater className="display-5 text-primary mb-3" />
              <h5 className="fw-bold">Sabores que Refrescan</h5>
              <p className="text-muted small">
                Creamos granizados con y sin alcohol, combinando frescura, sabor
                intenso y una experiencia que se disfruta en cada sorbo.
              </p>
            </Col>

            <Col md={4} className="mb-4 mb-md-0">
              <FaUserTie className="display-5 text-primary mb-3" />
              <h5 className="fw-bold">Nuestro Creador</h5>
              <p className="text-muted small">
                Fundado por <strong>Juan Sebastián Ramos Torralvo</strong>,
                ingeniero apasionado por la tecnología, el emprendimiento y las
                experiencias que conectan personas.
              </p>
            </Col>

            <Col md={4}>
              <FaHeart className="display-5 text-primary mb-3" />
              <h5 className="fw-bold">Nuestra Esencia</h5>
              <p className="text-muted small">
                Calidad, actitud y buena vibra en cada detalle, para acompañar
                desde una tarde chill hasta una noche inolvidable.
              </p>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
