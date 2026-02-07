import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaBox,
  FaBarcode,
  FaTag,
  FaWarehouse,
  FaShoppingCart,
} from "react-icons/fa";
import { productosService } from "../services/productosService";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import Swal from "sweetalert2";
import "../styles/VarianteDetalle.css";

export default function VarianteDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [variante, setVariante] = useState(null);
  const [qty, setQty] = useState(1);

  const { user } = useAuth();
  const { agregarAlCarrito, items } = useCarrito();
  const isLoggedIn = !!user;

  useEffect(() => {
    productosService
      .getProductoById(id)
      .then((response) => setVariante(response.data))
      .catch((error) => console.error("❌ Error al cargar variante:", error));
  }, [id]);

  if (!variante) {
    return (
      <Container className="text-center mt-5">
        <h4>Cargando información...</h4>
      </Container>
    );
  }

  const handleAdd = () => {
    if (!isLoggedIn) return;

    const key = `${variante.id}-${variante.nombre_variante || variante.sku}`;
    const existente = items.find((item) => item.key === key);
    const cantidadExistente = existente ? existente.cantidad : 0;

    if (cantidadExistente + qty > variante.stock_disponible) {
      Swal.fire({
        icon: "warning",
        title: "¡Stock insuficiente!",
        text: `Solo quedan ${
          variante.stock_disponible - cantidadExistente
        } unidades disponibles.`,
      });
      return;
    }

    const itemCarrito = {
      id: variante.id,
      key,
      producto_nombre: variante.nombre,
      nombre_variante: variante.nombre_variante,
      precio: variante.precio,
      sku: variante.sku,
      codigo_barra: variante.codigo_barras || "—",
      stock: variante.stock_disponible,
      imagen: variante.imagen_variante || variante.imagen || "",
      cantidad: qty,
    };

    agregarAlCarrito(itemCarrito);

    Swal.fire({
      icon: "success",
      title: "¡Agregado!",
      text: `${qty} unidad(es) de ${variante.nombre_variante} se agregaron al carrito`,
      timer: 1500,
      showConfirmButton: false,
    });

    setQty(1);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5 mb-5">
      <Card className="detalle-card shadow-lg border-0 rounded-4 p-4">
        <div className="mb-3">
          <Button
            variant="light"
            className="btn-volver shadow-sm"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft className="me-1" /> Volver
          </Button>
        </div>

        <Row className="align-items-center g-4">
          {/* IMAGEN */}
          <Col md={6} className="text-center">
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="image-container rounded-4"
            >
              {variante.imagen_variante || variante.imagen ? (
                <img
                  src={variante.imagen_variante || variante.imagen}
                  alt={variante.nombre_variante}
                  className="imagen-fija rounded-4 shadow-sm"
                />
              ) : (
                <div className="no-image rounded-4 border border-2 text-muted d-flex flex-column align-items-center justify-content-center">
                  <FaBox size={70} className="mb-3" />
                  <p>Sin imagen disponible</p>
                </div>
              )}
            </motion.div>
          </Col>

          {/* DETALLE */}
          <Col md={6}>
            <h2 className="fw-bold mb-2">{variante.nombre_variante}</h2>
            <p className="text-secondary mb-2">
              <FaTag className="me-2 text-primary" />
              <strong>SKU:</strong> {variante.sku}
            </p>

            <p className="text-muted mb-3">
              <FaBarcode className="me-2 text-primary" />
              <strong>Código de barras:</strong> {variante.codigo_barras || "—"}
            </p>

            <p className="text-secondary mb-4">
              <FaWarehouse className="me-2 text-warning" />
              <strong>Stock disponible:</strong> {variante.stock_disponible}
            </p>

            <div className="d-flex align-items-center gap-3 mb-4">
              <span>Cantidad:</span>
              <Form.Control
                type="number"
                min={1}
                max={variante.stock_disponible}
                value={qty}
                onChange={(e) =>
                  setQty(
                    Math.max(
                      1,
                      Math.min(
                        parseInt(e.target.value) || 1,
                        variante.stock_disponible,
                      ),
                    ),
                  )
                }
                style={{ width: 90 }}
              />
            </div>

            <div className="d-flex align-items-center justify-content-between">
              <h3 className="fw-bold mb-0">
                {parseFloat(variante.precio).toLocaleString("es-CO", {
                  style: "currency",
                  currency: "COP",
                })}
              </h3>

              {/* BOTÓN CORREGIDO */}
              {!isLoggedIn ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>🔒 Inicia sesión para agregar</Tooltip>}
                >
                  <span>
                    <Button
                      className="btn-agregar d-flex align-items-center gap-2 px-4 py-2"
                      disabled
                    >
                      <FaShoppingCart /> Agregar al carrito
                    </Button>
                  </span>
                </OverlayTrigger>
              ) : (
                <Button
                  className="btn-agregar d-flex align-items-center gap-2 px-4 py-2"
                  onClick={handleAdd}
                >
                  <FaShoppingCart /> Agregar al carrito
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
