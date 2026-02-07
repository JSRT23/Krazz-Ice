// src/pages/pedidos/ModificarPedidosPage.jsx
import { useEffect, useState } from "react";
import {
  listarPedidos,
  actualizarEstadoPedido,
  getEstados,
} from "../../services/meseroService";
import Swal from "sweetalert2";
import {
  Card,
  Button,
  Badge,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUtensils,
  FaStickyNote,
  FaCalendarAlt,
  FaUser,
  FaReceipt,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "sweetalert2/dist/sweetalert2.min.css";

export default function ModificarPedidosPage() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [loading, setLoading] = useState(false);

  const fechaHoy = new Date().toISOString().split("T")[0];

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 10000);
    return () => clearInterval(interval);
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [respEstados, respPedidos] = await Promise.all([
        getEstados(),
        listarPedidos({ fecha: fechaHoy }),
      ]);
      setEstados(respEstados.data);
      setPedidos(respPedidos.data);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al cargar pedidos",
        text: "No se pudieron obtener los pedidos del día.",
        confirmButtonColor: "#a47551",
      });
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstadoNombre) => {
    const estado = estados.find((e) => e.nombre === nuevoEstadoNombre);
    if (!estado) return;

    const confirm = await Swal.fire({
      title: `¿Cambiar pedido a "${nuevoEstadoNombre}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
      confirmButtonColor:
        nuevoEstadoNombre === "Cancelado" ? "#d33" : "#28a745",
      cancelButtonColor: "#6c757d",
      background: "#fffefb",
      color: "#4b3a2f",
    });

    if (!confirm.isConfirmed) return;

    try {
      await actualizarEstadoPedido(pedidoId, estado.id);
      await cargarDatos();
      Swal.fire({
        icon: "success",
        title: `Pedido actualizado a "${nuevoEstadoNombre}"`,
        timer: 1500,
        showConfirmButton: false,
        background: "#fffefb",
        color: "#4b3a2f",
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "No se pudo cambiar el estado.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const formatoCOP = (valor) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valor);

  const colorEstado = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "warning text-dark";
      case "En cocina":
        return "info text-white";
      case "Listo":
        return "success text-white";
      case "Entregado":
        return "secondary text-white";
      case "Cancelado":
        return "danger text-white";
      default:
        return "light text-dark";
    }
  };

  const pedidosFiltrados =
    filtroEstado === "Todos"
      ? pedidos
      : pedidos.filter((p) => p.estado.nombre === filtroEstado);

  return (
    <main className="bg-light min-vh-100 py-5">
      <Container style={{ maxWidth: "1200px" }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-brown">🧊 Pedidos del Día</h2>
          <p className="text-muted">
            Gestiona y entrega pedidos del{" "}
            <strong>{new Date().toLocaleDateString("es-CO")}</strong>
          </p>
        </div>

        {/* 🔹 Filtros */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {[
            { estado: "Todos", color: "secondary" },
            { estado: "Pendiente", color: "warning" },
            { estado: "En cocina", color: "info" },
            { estado: "Listo", color: "success" },
            { estado: "Entregado", color: "secondary" },
            { estado: "Cancelado", color: "danger" },
          ].map(({ estado, color }) => (
            <button
              key={estado}
              className={`btn btn-sm rounded-pill shadow-sm fw-semibold ${
                filtroEstado === estado
                  ? `btn-${color}`
                  : `btn-outline-${color}`
              }`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : (
          <Row className="g-4">
            {pedidosFiltrados.map((p) => (
              <Col md={4} key={p.id}>
                <Card
                  className="pedido-card shadow-sm border border-1 border-secondary-subtle rounded-4"
                  onClick={() => setPedidoSeleccionado(p)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    overflow: "hidden",
                  }}
                >
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0">#{p.id}</h5>
                      <Badge
                        className={`px-3 py-2 bg-${colorEstado(
                          p.estado.nombre,
                        )}`}
                      >
                        {p.estado.nombre}
                      </Badge>
                    </div>
                    <p className="small mb-1">
                      <FaUtensils /> <strong>Mesa:</strong> {p.mesa || "—"}
                    </p>
                    <p className="small mb-1">
                      <FaUser /> <strong>Cliente:</strong>{" "}
                      {p.cliente_nombre || "—"}
                    </p>
                    <p className="small mb-1">
                      <FaStickyNote /> <strong>Notas:</strong>{" "}
                      {p.notas || "Sin notas"}
                    </p>
                    <p className="small mb-1">
                      <FaCalendarAlt />{" "}
                      {new Date(p.fecha_pedido).toLocaleTimeString("es-CO")}
                    </p>
                    <p className="fw-semibold text-success mt-2">
                      Total: {formatoCOP(p.total || 0)}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Ventana flotante con animación */}
        <AnimatePresence>
          {pedidoSeleccionado && (
            <motion.div
              className="fixed-top start-0 w-100 h-100 d-flex align-items-center justify-content-center backdrop-blur"
              style={{
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
                zIndex: 1050,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white rounded-4 shadow-lg p-4"
                style={{
                  width: "90%",
                  maxWidth: "650px",
                  border: "1px solid #ddd",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <FaReceipt className="text-warning me-2" />
                    Pedido #{pedidoSeleccionado.id}
                  </h5>
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => setPedidoSeleccionado(null)}
                  >
                    ✕
                  </Button>
                </div>

                <p className="mb-1">
                  <FaUtensils className="text-warning me-2" />
                  <strong>Mesa:</strong> {pedidoSeleccionado.mesa || "—"}
                </p>
                <p className="mb-1">
                  <FaUser className="text-secondary me-2" />
                  <strong>Cliente:</strong>{" "}
                  {pedidoSeleccionado.cliente_nombre || "—"}
                </p>
                <p className="mb-1">
                  <FaStickyNote className="text-secondary me-2" />
                  <strong>Notas:</strong>{" "}
                  {pedidoSeleccionado.notas || "Sin notas"}
                </p>
                <p className="mb-3">
                  <FaCalendarAlt className="text-secondary me-2" />
                  <strong>Fecha:</strong>{" "}
                  {new Date(pedidoSeleccionado.fecha_pedido).toLocaleString(
                    "es-CO",
                  )}
                </p>

                <hr />

                <h6 className="fw-bold text-dark mb-3">🍽 Productos</h6>
                <ul className="list-unstyled">
                  {pedidoSeleccionado.detalles?.length ? (
                    pedidoSeleccionado.detalles.map((d) => (
                      <li
                        key={d.id}
                        className="mb-2 p-2 rounded bg-light border small"
                      >
                        <strong>{d.variante?.nombre_completo}</strong> ×{" "}
                        {d.cantidad}
                      </li>
                    ))
                  ) : (
                    <p className="text-muted small">
                      (Sin detalles disponibles)
                    </p>
                  )}
                </ul>

                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="text-success fw-bold mb-0">
                    Total: {formatoCOP(pedidoSeleccionado.total || 0)}
                  </h5>

                  <div className="d-flex gap-2">
                    {/* ✅ Entregar solo si está en Listo */}
                    {pedidoSeleccionado?.estado.nombre === "Listo" && (
                      <Button
                        variant="success"
                        onClick={() => {
                          cambiarEstado(pedidoSeleccionado.id, "Entregado");
                          setPedidoSeleccionado(null);
                        }}
                      >
                        <FaCheckCircle className="me-1" /> Entregar
                      </Button>
                    )}

                    {/* ✅ Cancelar si está Pendiente o Listo */}
                    {["Pendiente", "Listo"].includes(
                      pedidoSeleccionado?.estado.nombre,
                    ) && (
                      <Button
                        variant="danger"
                        onClick={() => {
                          Swal.fire({
                            title: "¿Cancelar pedido?",
                            text: "Esta acción no se puede revertir",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonText: "Sí, cancelar",
                            cancelButtonText: "No",
                            confirmButtonColor: "#d33",
                            cancelButtonColor: "#6c757d",
                          }).then((res) => {
                            if (res.isConfirmed)
                              cambiarEstado(pedidoSeleccionado.id, "Cancelado");
                            setPedidoSeleccionado(null);
                          });
                        }}
                      >
                        <FaTimesCircle className="me-1" /> Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <style>{`
        .pedido-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 18px rgba(0,0,0,0.12);
        }
      `}</style>
    </main>
  );
}
