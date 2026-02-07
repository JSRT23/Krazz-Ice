// src/pages/Pedidos.jsx
import { useEffect, useState } from "react";
import { Modal, Button, Image, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import {
  obtenerPedidosUltimos15,
  obtenerPedidosHoy,
} from "../../services/pedidosServices";
import { useNavigate } from "react-router-dom";
import "../../styles/pedidos.css";

export default function Pedidos() {
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [pedidosHoy, setPedidosHoy] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);

  const token = localStorage.getItem("token");
  const nav = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      if (!token) return;
      try {
        setLoading(true);
        const [ultimos, hoy] = await Promise.all([
          obtenerPedidosUltimos15(token),
          obtenerPedidosHoy(token),
        ]);

        // Quitar de "últimos" los que ya están en "hoy"
        const hoyIds = new Set(hoy.map((p) => p.id));
        const ultimosSinHoy = ultimos.filter((p) => !hoyIds.has(p.id));

        setPedidosHoy(hoy);
        setUltimosPedidos(ultimosSinHoy);

        // Notificar pedidos listos
        hoy.forEach((p) => {
          if (p.estado?.nombre?.toLowerCase() === "listo") {
            Swal.fire(
              "Pedido Listo",
              `Tu pedido #${p.id} está listo para reclamar`,
              "success",
            );
          }
        });
      } catch (err) {
        console.error("Error al cargar pedidos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
    const interval = setInterval(fetchPedidos, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const openModal = (pedido) => setModalData(pedido);
  const closeModal = () => setModalData(null);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="warning" />
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold text-center">Pedidos</h2>

      {/* HOY */}
      <h5 className="mb-3 fw-bold text-dark">📅 Pedidos de hoy</h5>
      {pedidosHoy.length === 0 ? (
        <p className="text-muted">No tienes pedidos hoy.</p>
      ) : (
        <div className="row g-3 mb-4">
          {pedidosHoy.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 rounded-4 shadow hover-card"
                onClick={() => openModal(p)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark fs-4">#{p.id}</span>
                    <span
                      className={`badge ${
                        p.estado?.nombre === "Pendiente"
                          ? "bg-warning text-dark"
                          : p.estado?.nombre === "En cocina"
                            ? "bg-info text-white"
                            : p.estado?.nombre === "Listo"
                              ? "bg-success text-white"
                              : p.estado?.nombre === "Entregado"
                                ? "bg-secondary text-white"
                                : "bg-danger text-white"
                      }`}
                    >
                      {p.estado?.nombre || "Desconocido"}
                    </span>
                  </div>

                  <div className="small text-muted mb-2">
                    <div>Mesa: {p.mesa || "-"}</div>
                    <div>Cliente: {p.cliente_nombre}</div>
                    <div>Notas: {p.notas || "Sin notas"}</div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="text-muted">
                      🕒 {new Date(p.fecha_pedido).toLocaleTimeString()}
                    </span>
                    <span className="fw-bold text-dark fs-5">
                      ${parseFloat(p.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ÚLTIMOS 15 DÍAS */}
      <h5 className="mb-3 fw-bold text-dark">📆 Últimos 15 días</h5>
      {ultimosPedidos.length === 0 ? (
        <p className="text-muted">No tienes pedidos recientes.</p>
      ) : (
        <div className="row g-3 mb-4">
          {ultimosPedidos.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 rounded-4 shadow hover-card"
                onClick={() => openModal(p)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark fs-4">#{p.id}</span>
                    <span
                      className={`badge ${
                        p.estado?.nombre === "Pendiente"
                          ? "bg-warning text-dark"
                          : p.estado?.nombre === "En cocina"
                            ? "bg-info text-white"
                            : p.estado?.nombre === "Listo"
                              ? "bg-success text-white"
                              : p.estado?.nombre === "Entregado"
                                ? "bg-secondary text-white"
                                : "bg-danger text-white"
                      }`}
                    >
                      {p.estado?.nombre || "Desconocido"}
                    </span>
                  </div>

                  <div className="small text-muted mb-2">
                    <div>Mesa: {p.mesa || "-"}</div>
                    <div>Cliente: {p.cliente_nombre}</div>
                    <div>Notas: {p.notas || "Sin notas"}</div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <span className="text-muted">
                      📅 {new Date(p.fecha_pedido).toLocaleDateString()}
                    </span>
                    <span className="fw-bold text-dark fs-5">
                      ${parseFloat(p.total).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-4">
        <Button variant="outline-primary" onClick={() => nav("/pedidos/todos")}>
          Ver todos mis pedidos
        </Button>
      </div>

      {/* MODAL */}
      <Modal
        show={!!modalData}
        onHide={closeModal}
        size="lg"
        centered
        className="pedido-modal fade-in"
        backdrop="static"
      >
        <Modal.Header
          closeButton
          className={`pedido-header ${
            modalData?.estado?.nombre === "Pendiente"
              ? "bg-warning"
              : modalData?.estado?.nombre === "En cocina"
                ? "bg-info text-white"
                : modalData?.estado?.nombre === "Listo"
                  ? "bg-success text-white"
                  : modalData?.estado?.nombre === "Entregado"
                    ? "bg-secondary text-white"
                    : "bg-danger text-white"
          }`}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-journal-text fs-5"></i>
            <div className="d-flex flex-column lh-1">
              <span className="fw-semibold">Pedido #{modalData?.id}</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 estado-box">
            <span className="fw-semibold">Estado:</span>
            <span className="badge bg-light text-dark fw-semibold px-3 py-2 shadow-sm">
              {modalData?.estado?.nombre}
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className="bg-light p-4">
          {modalData && (
            <>
              <div className="info-section bg-white rounded-4 p-3 shadow-sm mb-4">
                <h5 className="fw-semibold mb-3 text-dark">
                  Información del cliente
                </h5>
                <div className="row text-dark">
                  <div className="col-md-6 mb-2">
                    <p className="mb-1">
                      <strong>Nombre:</strong> {modalData.cliente_nombre}
                    </p>
                    <p className="mb-1">
                      <strong>Mesa:</strong> {modalData.mesa || "—"}
                    </p>
                    <p className="mb-0">
                      <strong>Tipo:</strong>{" "}
                      {modalData.tipo === "externo" ? "Externo" : "En tienda"}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <strong>Fecha:</strong>{" "}
                      {new Date(modalData.fecha_pedido).toLocaleString("es-CO")}
                    </p>
                    <p className="mb-0">
                      <strong>Pago:</strong> {modalData?.metodo_pago?.nombre}
                    </p>
                  </div>
                </div>
              </div>

              <div className="productos-section mb-4">
                <h5 className="fw-semibold mb-3 text-dark">Productos</h5>
                {modalData.detalles?.length > 0 ? (
                  modalData.detalles.map((item) => (
                    <div
                      key={item.id}
                      className="producto-item d-flex align-items-center bg-white p-3 mb-3 rounded-4 shadow-sm"
                    >
                      <Image
                        src={
                          item.variante?.imagen_variante ||
                          item.variante?.imagen_producto ||
                          "https://via.placeholder.com/80"
                        }
                        roundedCircle
                        className="shadow-sm me-3"
                        style={{ width: 70, height: 70, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold text-dark">
                          {item.variante?.producto_nombre ||
                            "Producto sin nombre"}
                        </p>
                        <p className="mb-0 text-muted small">
                          Variante: {item.variante?.nombre_variante} • Cant:{" "}
                          {item.cantidad}
                        </p>
                      </div>
                      <div className="text-end">
                        <p className="mb-0 fw-bold text-success">
                          {(
                            item.cantidad * parseFloat(item.precio_unitario)
                          ).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                          })}
                        </p>
                        <small className="text-muted">
                          {parseFloat(item.precio_unitario).toLocaleString(
                            "es-CO",
                            {
                              style: "currency",
                              currency: "COP",
                            },
                          )}{" "}
                          c/u
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted fst-italic">
                    (Sin productos disponibles)
                  </p>
                )}
              </div>

              <div className="d-flex justify-content-end align-items-center">
                <h5 className="fw-bold text-dark mb-0">
                  Total:{" "}
                  {parseFloat(modalData.total).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                  })}
                </h5>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
