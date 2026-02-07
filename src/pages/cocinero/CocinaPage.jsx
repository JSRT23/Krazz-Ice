import { useEffect, useState } from "react";
import {
  listarPedidos,
  actualizarEstadoPedido,
  getEstados,
} from "../../services/cocinaServives";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
} from "react-bootstrap";
import { FaUtensils, FaClock, FaCheck, FaStickyNote } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CocinaPage() {
  const [pedidos, setPedidos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargar();
    const intervalo = setInterval(cargar, 15000);
    return () => clearInterval(intervalo);
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const fechaHoy = new Date().toISOString().split("T")[0];

      const [respEstados, respPedidos] = await Promise.all([
        getEstados(),
        listarPedidos({ fecha: fechaHoy }),
      ]);

      setEstados(respEstados.data);

      const pedidosFiltrados = respPedidos
        .filter((p) => ["Pendiente", "En cocina"].includes(p.estado.nombre))
        .sort((a, b) => a.id - b.id);

      setPedidos(pedidosFiltrados);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al cargar pedidos",
        text: "Verifica tu conexión o permisos.",
        confirmButtonColor: "#a47551",
      });
    } finally {
      setLoading(false);
    }
  };

  const pasarASiguienteEstado = async (pedido) => {
    const actual = pedido.estado.nombre;
    const siguiente =
      actual === "Pendiente"
        ? "En cocina"
        : actual === "En cocina"
          ? "Listo"
          : null;

    if (!siguiente) return;

    const estadoDestino = estados.find((e) => e.nombre === siguiente);
    if (!estadoDestino) return;

    const confirm = await Swal.fire({
      title: `¿Cambiar pedido #${pedido.id} a "${siguiente}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#a47551",
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await actualizarEstadoPedido(pedido.id, estadoDestino.id);
      cargar();
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-light min-vh-100 py-5">
      <Container style={{ maxWidth: "1100px" }}>
        <div className="text-center mb-5">
          <h2 className="fw-bold text-brown">
            🧊 Panel de pedidos en preparación
          </h2>
          <p className="text-muted">
            Pedidos del día en estado <strong>Pendiente</strong> o{" "}
            <strong>En cocina</strong>.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" />
          </div>
        ) : pedidos.length === 0 ? (
          <p className="text-center text-muted">No hay pedidos pendientes.</p>
        ) : (
          <Row className="g-4">
            {pedidos.map((p) => (
              <Col md={4} key={p.id}>
                <Card className="shadow-sm border-0 rounded-4 h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between mb-2">
                      <h5 className="fw-bold mb-0">#{p.id}</h5>
                      <Badge
                        bg={
                          p.estado.nombre === "Pendiente" ? "warning" : "info"
                        }
                        text={
                          p.estado.nombre === "Pendiente" ? "dark" : "light"
                        }
                      >
                        {p.estado.nombre}
                      </Badge>
                    </div>

                    <p className="small mb-1">
                      <FaUtensils /> <strong>Mesa:</strong> {p.mesa || "—"}
                    </p>
                    <p className="small mb-2">
                      <FaClock /> <strong>Cliente:</strong>{" "}
                      {p.cliente_nombre || "—"}
                    </p>

                    {/* 📝 NOTAS GENERALES */}
                    {p.notas && (
                      <div className="bg-warning bg-opacity-10 p-2 rounded-3 mb-3">
                        <p className="small mb-0">
                          <FaStickyNote /> <strong>Notas del pedido:</strong>
                        </p>
                        <p className="small mb-0 text-muted">{p.notas}</p>
                      </div>
                    )}

                    <hr className="my-3" />

                    {/* 🍹 DETALLES */}
                    <ul className="small mb-3" style={{ lineHeight: "1.5em" }}>
                      {p.detalles?.length ? (
                        p.detalles.map((d) => (
                          <li key={d.id}>
                            <strong>
                              {d.variante?.nombre_completo ||
                                `${d.variante?.producto_nombre} - ${d.variante?.nombre_variante}`}
                            </strong>{" "}
                            × {d.cantidad}
                            {d.notas && (
                              <div className="text-muted fst-italic">
                                📝 {d.notas}
                              </div>
                            )}
                          </li>
                        ))
                      ) : (
                        <li className="text-muted">
                          (Sin detalles disponibles)
                        </li>
                      )}
                    </ul>

                    <div className="text-center">
                      <Button
                        variant={
                          p.estado.nombre === "Pendiente"
                            ? "warning"
                            : "success"
                        }
                        className="px-4 fw-semibold"
                        onClick={() => pasarASiguienteEstado(p)}
                        disabled={loading}
                      >
                        {p.estado.nombre === "Pendiente" ? (
                          "Pasar a En cocina"
                        ) : (
                          <>
                            <FaCheck /> Marcar como Listo
                          </>
                        )}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </main>
  );
}
