import { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { obtenerMisPedidosTodos } from "../../services/pedidosServices";
import { useNavigate } from "react-router-dom";
import "../../styles/pedidos.css";

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const token = localStorage.getItem("token");
  const nav = useNavigate();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);
        const data = await obtenerMisPedidosTodos(token);
        setPedidos(data);
      } catch (err) {
        console.error("Error al cargar todos los pedidos:", err);
        Swal.fire("Error", "No se pudieron cargar todos tus pedidos", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-center m-0">Todos mis pedidos</h2>
        <Button variant="outline-secondary" onClick={() => nav("/pedidos")}>
          ← Volver
        </Button>
      </div>

      {pedidos.length === 0 ? (
        <p className="text-muted text-center">No has realizado pedidos aún.</p>
      ) : (
        <div className="row g-3">
          {pedidos.map((p) => (
            <div key={p.id} className="col-12 col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 rounded-4 shadow hover-card"
                onClick={() => openModal(p)}
                style={{ cursor: "pointer", transition: "all 0.3s ease" }}
              >
                <div className="card-body d-flex flex-column justify-content-between">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-dark fs-4">#{p.id}</span>
                    <span
                      className={`badge ${
                        p.estado.nombre === "Pendiente"
                          ? "bg-warning text-dark"
                          : p.estado.nombre === "En cocina"
                            ? "bg-info text-white"
                            : p.estado.nombre === "Listo"
                              ? "bg-success text-white"
                              : p.estado.nombre === "Entregado"
                                ? "bg-secondary"
                                : "bg-danger"
                      }`}
                    >
                      {p.estado.nombre}
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
          className={`pedido-header d-flex justify-content-between align-items-center ${
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
          <span className="badge bg-light text-dark fw-semibold px-3 py-2 shadow-sm">
            {modalData?.estado?.nombre}
          </span>
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
                      <strong>Pago:</strong> {modalData.metodo_pago.nombre}
                    </p>
                  </div>
                </div>
              </div>

              <hr />
              <div className="productos-section mb-4">
                <h5 className="fw-semibold mb-3 text-dark">Productos</h5>
                {modalData.detalles?.length > 0 ? (
                  modalData.detalles.map((item) => (
                    <div
                      key={item.id}
                      className="producto-item d-flex align-items-center bg-white p-3 mb-3 rounded-4 shadow-sm"
                    >
                      <img
                        src={
                          item.variante.imagen_variante ||
                          item.variante.imagen_producto ||
                          "/sin-imagen.jpg"
                        }
                        alt={item.variante.producto_nombre}
                        className="rounded-circle me-3"
                        style={{ width: 70, height: 70, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-semibold text-dark">
                          {item.variante.producto_nombre}
                        </p>
                        <p className="mb-0 text-muted small">
                          Variante: {item.variante.nombre_variante} • Cant:{" "}
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
                            { style: "currency", currency: "COP" },
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

              <hr />
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
