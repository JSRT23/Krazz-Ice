import { useEffect, useState } from "react";
import {
  getProductosDisponibles,
  getMetodosPago,
  getEstados,
  crearPedido,
  agregarDetalle,
} from "../../services/meseroService";
import { buscarClientePorUsername } from "../../services/authServices";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Button,
  Form,
  Table,
  Row,
  Col,
  InputGroup,
  Card,
  Container,
} from "react-bootstrap";
import { FaPlus, FaMinus, FaTrash, FaCartPlus, FaSearch } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function CrearPedidoPage() {
  const { user: empleado } = useAuth();

  const [productos, setProductos] = useState([]);
  const [metodos, setMetodos] = useState([]);
  const [estados, setEstados] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mesa, setMesa] = useState("");
  const [cliente, setCliente] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [estadoPedido, setEstadoPedido] = useState("");
  const [notas, setNotas] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [respProd, respMet, respEst] = await Promise.all([
        getProductosDisponibles(),
        getMetodosPago(),
        getEstados(),
      ]);
      setProductos(respProd.data);
      setMetodos(respMet.data);
      setEstados(respEst.data);

      // Estado por defecto: "Pendiente"
      const estadoPendiente = respEst.data.find(
        (e) => e.nombre.toLowerCase() === "pendiente",
      );
      if (estadoPendiente) setEstadoPedido(estadoPendiente.id);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al cargar datos",
        text: "No se pudieron obtener los productos ni los datos necesarios.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const stockDisponible = (p) =>
    Math.max(0, (p.stock || 0) - (p.stock_bloqueado || 0));

  const filtrarProductos = productos.filter((p) =>
    `${p.producto?.nombre || ""} ${p.nombre_variante || ""} ${
      p.codigo_barras || ""
    }`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const agregar = (producto) => {
    const disponible = stockDisponible(producto);
    if (disponible <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin stock disponible",
        text: "Este producto no tiene unidades disponibles.",
        confirmButtonColor: "#3473f2",
      });
      return;
    }

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        if (existe.cantidad < disponible) {
          return prev.map((p) =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
          );
        }
        Swal.fire({
          icon: "info",
          title: "Stock máximo alcanzado",
          text: `Solo hay ${disponible} unidades disponibles.`,
          confirmButtonColor: "#417ae3",
        });
        return prev;
      }

      const nombreGlobal = `${producto.producto?.nombre || ""} - ${
        producto.nombre_variante
      }`;

      return [
        ...prev,
        {
          ...producto,
          nombreGlobal,
          cantidad: 1,
          stock_disponible: disponible,
        },
      ];
    });
  };

  const aumentar = (id) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id && p.cantidad < p.stock_disponible
          ? { ...p, cantidad: p.cantidad + 1 }
          : p,
      ),
    );
  };

  const disminuir = (id) => {
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p,
      ),
    );
  };

  const eliminar = (id) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "Este producto se eliminará del carrito.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3d74e3",
      cancelButtonColor: "#6c757d",
      background: "#fff8e7",
      color: "#4b3a2f",
    }).then((res) => {
      if (res.isConfirmed)
        setCarrito((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const crear = async () => {
    if (!metodoPago) {
      return Swal.fire({
        icon: "warning",
        title: "Selecciona un método de pago",
        confirmButtonColor: "#3e77ef",
      });
    }

    if (!estadoPedido) {
      return Swal.fire({
        icon: "warning",
        title: "Selecciona un estado del pedido",
        confirmButtonColor: "#3e77ef",
      });
    }

    if (carrito.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "Carrito vacío",
        text: "Agrega productos antes de crear el pedido.",
        confirmButtonColor: "#3876f2",
      });
    }

    setLoading(true);

    try {
      let clienteId = null;

      if (cliente.trim() !== "") {
        try {
          const data = await buscarClientePorUsername(cliente);
          clienteId = data.id;
        } catch {
          await Swal.fire({
            icon: "warning",
            title: "Cliente no encontrado",
            text: `No se encontró ningún cliente con el usuario ${cliente}.`,
            confirmButtonColor: "#3876f2",
          });
        }
      }

      const pedidoData = {
        cliente: clienteId,
        empleado: empleado?.id || null,
        mesa: mesa.trim() === "" ? null : parseInt(mesa),
        metodo_pago_id: parseInt(metodoPago),
        estado_id: parseInt(estadoPedido),
        notas,
      };

      const { data: pedido } = await crearPedido(pedidoData);

      for (const item of carrito) {
        await agregarDetalle({
          pedido_id: pedido.id,
          variante_id: item.id, // ✅ corregido
          cantidad: item.cantidad,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Pedido creado con éxito",
        text: `El pedido #${pedido.id} se ha registrado correctamente.`,
        confirmButtonColor: "#3876f2",
        background: "#fff8e7",
        color: "#4b3a2f",
        showCloseButton: true,
      });

      setCarrito([]);
      setMesa("");
      setCliente("");
      setMetodoPago("");
      setEstadoPedido("");
      setNotas("");
      await cargarDatos();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al crear el pedido",
        text:
          error.response?.data?.detail ||
          JSON.stringify(error.response?.data) ||
          "Revisa la consola para más detalles.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-light min-vh-100 py-5">
      <Container
        className="bg-white p-4 rounded-4 shadow-sm"
        style={{ maxWidth: "1200px" }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="text-brown fw-bold">🧊 Crear Pedido Krazz Ice</h3>
          <span className="text-muted small">
            Mesero: <strong>{empleado?.username || "—"}</strong>
          </span>
        </div>

        <Row className="g-3 mb-4">
          <Col md={2}>
            <Form.Control
              placeholder="Mesa"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Cliente (username opcional)"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
            >
              <option value="">Método de pago</option>
              {metodos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Select
              value={estadoPedido}
              onChange={(e) => setEstadoPedido(e.target.value)}
            >
              <option value="">Estado del pedido</option>
              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              placeholder="Notas (ej: sin cebolla)"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </Col>
        </Row>

        {/* Buscador */}
        <InputGroup className="mb-4">
          <InputGroup.Text style={{ backgroundColor: "#fff8e7" }}>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Buscar producto o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>

        <Row>
          {/* Productos */}
          <Col md={7}>
            <div
              className="row row-cols-1 row-cols-sm-2 g-3"
              style={{ maxHeight: "500px", overflowY: "auto" }}
            >
              {filtrarProductos.map((p) => (
                <div className="col" key={p.id}>
                  <Card className="h-100 shadow-sm border-0">
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title style={{ fontSize: "1rem" }}>
                          {p.producto?.nombre} - {p.nombre_variante}
                        </Card.Title>
                        <Card.Text className="text-muted small mb-0">
                          codigo: {p.codigo_barras}
                        </Card.Text>
                        <Card.Text className="text-muted small">
                          Cantidad: {stockDisponible(p)} | Precio: ${p.precio}
                        </Card.Text>
                      </div>
                      <Button
                        variant="outline-primary"
                        onClick={() => agregar(p)}
                        disabled={stockDisponible(p) <= 0}
                      >
                        <FaCartPlus /> Agregar
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Col>

          {/* Carrito */}
          <Col md={5}>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <h5 className="fw-bold mb-3">🛒 Carrito</h5>
                {carrito.length === 0 ? (
                  <p className="text-muted text-center">
                    Aún no hay productos agregados.
                  </p>
                ) : (
                  <>
                    <Table borderless hover responsive size="sm">
                      <tbody>
                        {carrito.map((item) => (
                          <tr key={item.id}>
                            <td className="text-start">
                              <strong>{item.nombreGlobal}</strong>
                              <div className="text-muted small">
                                ${item.precio}
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="d-flex justify-content-center align-items-center gap-2">
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => disminuir(item.id)}
                                >
                                  <FaMinus />
                                </Button>
                                <span>{item.cantidad}</span>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => aumentar(item.id)}
                                  disabled={
                                    item.cantidad >= item.stock_disponible
                                  }
                                >
                                  <FaPlus />
                                </Button>
                              </div>
                            </td>
                            <td className="text-end">
                              ${(item.precio * item.cantidad).toFixed(2)}
                              <br />
                              <Button
                                variant="link"
                                className="text-danger p-0"
                                onClick={() => eliminar(item.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="d-flex justify-content-between mt-3">
                      <strong>Total:</strong>
                      <span className="fw-bold text-success">
                        $
                        {carrito
                          .reduce(
                            (total, item) =>
                              total + item.precio * item.cantidad,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="text-center mt-4">
                      <Button
                        variant="primary"
                        className="px-4"
                        onClick={crear}
                        disabled={loading}
                      >
                        {loading ? "Creando..." : " Confirmar Pedido ✅ "}
                      </Button>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
