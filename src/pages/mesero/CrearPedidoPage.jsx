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

const BASE_URL = "https://planchon.pythonanywhere.com";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

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
      const [prod, met, est] = await Promise.all([
        getProductosDisponibles(),
        getMetodosPago(),
        getEstados(),
      ]);

      setProductos(prod.data);
      setMetodos(met.data);
      setEstados(est.data);

      const pendiente = est.data.find(
        (e) => e.nombre.toLowerCase() === "pendiente",
      );
      if (pendiente) setEstadoPedido(pendiente.id);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error al cargar datos",
        text: "No se pudieron obtener los datos necesarios.",
      });
    }
  };

  const stockDisponible = (p) =>
    Math.max(0, (p.stock || 0) - (p.stock_bloqueado || 0));

  const productosFiltrados = productos.filter((p) =>
    `${p.producto?.nombre || ""} ${p.nombre_variante || ""} ${
      p.codigo_barras || ""
    }`
      .toLowerCase()
      .includes(busqueda.toLowerCase()),
  );

  const agregar = (producto) => {
    const disponible = stockDisponible(producto);
    if (disponible <= 0) {
      return Swal.fire("Sin stock", "Producto agotado", "warning");
    }

    setCarrito((prev) => {
      const existe = prev.find((p) => p.id === producto.id);
      if (existe) {
        if (existe.cantidad < disponible) {
          return prev.map((p) =>
            p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p,
          );
        }
        Swal.fire("Stock máximo", "No hay más unidades disponibles", "info");
        return prev;
      }

      return [
        ...prev,
        {
          ...producto,
          cantidad: 1,
          stock_disponible: disponible,
          nombreGlobal: producto.producto?.nombre,
          variante: producto.nombre_variante,
        },
      ];
    });
  };

  const aumentar = (id) =>
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id && p.cantidad < p.stock_disponible
          ? { ...p, cantidad: p.cantidad + 1 }
          : p,
      ),
    );

  const disminuir = (id) =>
    setCarrito((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p,
      ),
    );

  const eliminar = (id) =>
    Swal.fire({
      title: "¿Eliminar producto?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
    }).then((r) => {
      if (r.isConfirmed) setCarrito((prev) => prev.filter((p) => p.id !== id));
    });

  const crear = async () => {
    if (!metodoPago) return Swal.fire("Falta método de pago", "", "warning");
    if (!estadoPedido)
      return Swal.fire("Falta estado del pedido", "", "warning");
    if (carrito.length === 0) return Swal.fire("Carrito vacío", "", "info");

    setLoading(true);

    try {
      let clienteId = null;
      if (cliente.trim()) {
        try {
          const data = await buscarClientePorUsername(cliente);
          clienteId = data.id;
        } catch {
          await Swal.fire(
            "Cliente no encontrado",
            "Se continuará sin cliente",
            "warning",
          );
        }
      }

      const { data: pedido } = await crearPedido({
        cliente: clienteId,
        empleado: empleado?.id,
        mesa: mesa.trim() ? parseInt(mesa) : null,
        metodo_pago_id: metodoPago,
        estado_id: estadoPedido,
        notas,
      });

      for (const item of carrito) {
        await agregarDetalle({
          pedido_id: pedido.id,
          variante_id: item.id,
          cantidad: item.cantidad,
        });
      }

      await Swal.fire({
        icon: "success",
        title: "Pedido creado",
        text: `Pedido #${pedido.id} registrado correctamente`,
      });

      setCarrito([]);
      setMesa("");
      setCliente("");
      setMetodoPago("");
      setNotas("");
      await cargarDatos();
    } catch (e) {
      Swal.fire("Error", "No se pudo crear el pedido", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-light min-vh-100 py-4">
      <Container fluid="lg" className="bg-white p-4 rounded-4 shadow-sm">
        <div className="d-flex justify-content-between mb-3">
          <h4>🧊 Crear Pedido Krazz Ice</h4>
          <span className="text-muted">
            Mesero: <strong>{empleado?.username}</strong>
          </span>
        </div>

        {/* CONTROLES */}
        <Row className="g-3 mb-3">
          <Col md={2}>
            <Form.Control
              placeholder="Mesa"
              value={mesa}
              onChange={(e) => setMesa(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Control
              placeholder="Cliente"
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
              {estados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              placeholder="Notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </Col>
        </Row>

        {/* BUSCADOR */}
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>

        <Row className="g-3">
          {/* PRODUCTOS */}
          <Col lg={7}>
            <div
              className="row row-cols-2 row-cols-md-3 g-3"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {productosFiltrados.map((p) => (
                <div className="col" key={p.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Img
                      src={getImageUrl(p.imagen_variante)}
                      style={{ height: 140, objectFit: "cover" }}
                    />
                    <Card.Body className="p-2">
                      <h6>{p.producto?.nombre}</h6>
                      <small className="text-muted">{p.nombre_variante}</small>
                      <div className="d-flex justify-content-between mt-1">
                        <strong className="text-success">${p.precio}</strong>
                        <span className="badge bg-secondary">
                          {stockDisponible(p)}
                        </span>
                      </div>
                      <Button
                        size="sm"
                        className="w-100 mt-2"
                        onClick={() => agregar(p)}
                      >
                        <FaCartPlus /> Agregar
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>
          </Col>

          {/* CARRITO */}
          <Col lg={5}>
            <Card className="shadow-sm sticky-lg-top">
              <Card.Body>
                <h5>🛒 Carrito</h5>
                <Table size="sm" borderless responsive>
                  <tbody>
                    {carrito.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={getImageUrl(i.imagen_variante)}
                              width={40}
                              height={40}
                              style={{ objectFit: "cover", borderRadius: 6 }}
                            />
                            <strong>{i.nombreGlobal}</strong>
                          </div>
                          <div className="text-muted small mt-1">
                            <strong>{i.variante} - </strong>
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(i.precio)}
                            x {i.cantidad}
                          </div>
                        </td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => disminuir(i.id)}
                          >
                            <FaMinus />
                          </Button>
                          <span className="mx-2">{i.cantidad}</span>{" "}
                          <Button
                            size="sm"
                            variant="outline-secondary"
                            onClick={() => aumentar(i.id)}
                          >
                            <FaPlus />
                          </Button>
                        </td>
                        <td className="text-end">
                          <strong>
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                              minimumFractionDigits: 0,
                            }).format(i.precio * i.cantidad)}
                          </strong>
                          <br />
                          <Button
                            size="sm"
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => eliminar(i.id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="d-flex justify-content-between border-top pt-2">
                  <strong>Total</strong>
                  <span className="fw-bold text-success fs-5">
                    {new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(
                      carrito.reduce((t, i) => t + i.precio * i.cantidad, 0),
                    )}
                  </span>
                </div>

                <Button
                  className="w-100 mt-3"
                  onClick={crear}
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Confirmar Pedido ✅"}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
