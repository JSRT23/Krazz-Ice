import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container, Row, Col, Card, Accordion, Spinner } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductModal from "../components/ProductModal";
import { productosService } from "../services/productosService";
import "../styles/card-hover.css";

const src = (path) =>
  path && path !== ""
    ? path.startsWith("http")
      ? path
      : `http://localhost:8000${path}`
    : null;

export default function Menu() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await productosService.getMenu();
        setMenu(res.data);
      } catch (err) {
        setError("No se pudo cargar el menú");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading)
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="warning" />
      </div>
    );

  if (error)
    return (
      <div className="error-container text-danger">
        <p>{error}</p>
      </div>
    );

  const openModal = (prod, varnt) =>
    setModalData({
      producto_nombre: prod.nombre,
      nombre_variante: varnt.nombre_variante,
      descripcion: prod.descripcion,
      precio: varnt.precio,
      sku: varnt.sku,
      codigo_barra: varnt.codigo_barras,
      stock: varnt.stock,
      imagen: src(varnt.imagen_variante || prod.imagen),
      id: varnt.id,
    });

  return (
    <main className="menu-background">
      <motion.div
        className="back-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/home")}
      >
        <FaArrowLeft />
      </motion.div>

      <Container className="py-5">
        <motion.h1
          className="menu-title text-center fw-bold mb-5"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Menú
        </motion.h1>

        <Accordion defaultActiveKey="0" alwaysOpen>
          {menu.map((cat, idxCat) => (
            <Accordion.Item
              eventKey={String(idxCat)}
              key={idxCat}
              className="categoria-item rounded-4 overflow-hidden"
            >
              <Accordion.Header>
                <h5 className="fw-bold text-dark mb-0">{cat.categoria}</h5>
              </Accordion.Header>

              <Accordion.Body className="bg-white rounded-bottom-4 p-4">
                {cat.subcategorias.map((sub, idxSub) => (
                  <div key={idxSub} className="mb-4">
                    <h4 className="text-muted mb-3">{sub.nombre}</h4>
                    <hr className="mb-4" />

                    <Row className="g-4">
                      {sub.productos.map((prod) =>
                        prod.variantes.map((varnt, idxVar) => (
                          <Col key={varnt.id} xs={6} sm={4} md={3} lg={2}>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                duration: 0.4,
                                delay: idxVar * 0.05,
                              }}
                            >
                              <Card
                                className="menu-card h-100 rounded-4 border-0 shadow-lg card-hover-relieve"
                                onClick={() => openModal(prod, varnt)}
                                role="button"
                              >
                                <div className="image-wrapper">
                                  <Card.Img
                                    variant="top"
                                    src={
                                      src(
                                        varnt.imagen_variante || prod.imagen,
                                      ) || "/sin-imagen.jpg"
                                    }
                                    alt={varnt.nombre_variante}
                                    className="menu-card-img"
                                  />
                                </div>

                                <Card.Body className="d-flex flex-column p-2">
                                  <Card.Title className="fw-bold text-dark mb-1 text-truncate small">
                                    {prod.nombre}
                                  </Card.Title>

                                  <Card.Text className="text-muted small mb-2 text-truncate">
                                    {varnt.nombre_variante}
                                  </Card.Text>

                                  <div className="mt-auto d-flex justify-content-between align-items-center">
                                    <motion.span
                                      className="fw-bold text-warning"
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      ${parseFloat(varnt.precio).toFixed(2)}
                                    </motion.span>

                                    <span className="badge bg-light text-dark border small">
                                      {varnt.sku}
                                    </span>
                                  </div>
                                </Card.Body>
                              </Card>
                            </motion.div>
                          </Col>
                        )),
                      )}
                    </Row>
                  </div>
                ))}
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>

      <ProductModal
        show={!!modalData}
        onHide={() => setModalData(null)}
        data={modalData}
      />
    </main>
  );
}
