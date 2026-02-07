import { useState } from "react";
import {
  Modal,
  Button,
  Image,
  Row,
  Col,
  Badge,
  Form,
  Stack,
} from "react-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCarrito } from "../context/CarritoContext";
import Swal from "sweetalert2";
import "../styles/modal-blur.css";

export default function ProductModal({ show, onHide, data }) {
  const [qty, setQty] = useState(1);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const { agregarAlCarrito, items = [] } = useCarrito(); // ✅ Protegemos items

  if (!data) return null;

  const {
    id,
    producto_nombre,
    nombre_variante,
    descripcion,
    precio,
    sku,
    codigo_barra,
    stock = 0, // ✅ Stock por defecto 0
    imagen,
  } = data;

  const handleAdd = () => {
    if (!isAuthenticated) return;

    // Ver cuántas unidades de esta variante ya están en el carrito
    const existente = items.find((item) => item.id === id);
    const cantidadExistente = existente ? existente.cantidad : 0;

    if (qty + cantidadExistente > stock) {
      Swal.fire({
        icon: "warning",
        title: "¡Stock insuficiente!",
        text: `Solo quedan ${
          stock - cantidadExistente
        } unidades disponibles de esta variante.`,
      });
      return;
    }

    // Agregar al carrito
    agregarAlCarrito({ ...data, cantidad: qty });

    Swal.fire({
      icon: "success",
      title: "Agregado al carrito",
      text: `${nombre_variante} se ha agregado correctamente`,
      timer: 1500,
      showConfirmButton: false,
    });

    onHide();
  };

  const imageUrl = imagen && imagen !== "" ? imagen : null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="modal-blur"
      dialogClassName="modal-rounded"
    >
      <Modal.Header closeButton className="border-0">
        <Modal.Title className="fw-bold text-dark">
          {producto_nombre}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4">
          <Col
            md={6}
            className="d-flex align-items-center justify-content-center"
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={nombre_variante}
                className="img-fluid rounded-4 shadow"
                style={{ maxHeight: 350, objectFit: "cover", width: "100%" }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-light rounded-4 w-100 border"
                style={{ height: 350 }}
              >
                <span className="text-muted">Sin imagen disponible</span>
              </div>
            )}
          </Col>

          <Col md={6}>
            <Stack gap={3}>
              <div>
                <h5 className="fw-semibold text-dark mb-1">
                  {nombre_variante}
                </h5>
                <p className="text-muted small mb-0">{descripcion}</p>
              </div>

              <div>
                <Badge bg="dark" className="me-2">
                  SKU: {sku || "—"}
                </Badge>
                <Badge bg="secondary">Cód: {codigo_barra || "—"}</Badge>
              </div>

              <h3 className="fw-bold text-warning mb-0">
                ${precio ? precio.toFixed(2) : "0.00"}
              </h3>

              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">Cantidad:</span>
                <Form.Control
                  type="number"
                  min={1}
                  max={stock}
                  value={qty}
                  onChange={(e) =>
                    setQty(
                      Math.min(
                        stock,
                        Math.max(1, parseInt(e.target.value) || 1),
                      ),
                    )
                  }
                  style={{ width: 90 }}
                />
                <span className="text-muted">Disponible: {stock}</span>
              </div>

              <Button
                variant="warning"
                size="lg"
                className="w-100 fw-semibold mt-2 d-flex align-items-center justify-content-center gap-2"
                onClick={handleAdd}
                disabled={!isAuthenticated || stock <= 0}
              >
                <FaShoppingCart />
                Agregar al carrito
              </Button>

              {!isAuthenticated && (
                <p className="text-danger text-center small mb-0">
                  ⚠️ Debes iniciar sesión para realizar pedidos.
                </p>
              )}
            </Stack>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
