import { useState, useEffect } from "react";
import { useCarrito } from "../../context/CarritoContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  crearPedido,
  agregarProductoAPedido,
  obtenerMetodosPago,
} from "../../services/pedidosServices";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RealizarPedido() {
  const { items, vaciarCarrito } = useCarrito();
  const { user } = useAuth();
  const [metodoPago, setMetodoPago] = useState("");
  const [metodos, setMetodos] = useState([]);
  const [notas, setNotas] = useState("");
  const [pedidoIdTemporal, setPedidoIdTemporal] = useState("0000");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  // 🔹 Cargar métodos de pago y generar ID temporal
  useEffect(() => {
    const fetchMetodos = async () => {
      try {
        const data = await obtenerMetodosPago(token);
        setMetodos(data);
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudieron cargar los métodos de pago",
          "error",
        );
      }
    };
    fetchMetodos();

    if (user?.id) {
      setPedidoIdTemporal(`0000${user.id}`);
    }
  }, [token, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!metodoPago) {
      Swal.fire("Error", "Debes seleccionar un método de pago", "warning");
      return;
    }

    if (!items || items.length === 0) {
      Swal.fire("Error", "Tu carrito está vacío", "warning");
      return;
    }

    try {
      // 🔹 Crear pedido real
      const pedido = await crearPedido(token, metodoPago, "externo");

      // 🔹 Agregar productos
      for (const item of items) {
        const itemData = {
          pedido_id: pedido.id,
          variante_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio,
          notas: notas || "",
          tipo: "externo",
        };
        await agregarProductoAPedido(token, itemData);
      }

      // 🔹 Alerta de éxito y redirección
      Swal.fire(
        "¡Listo!",
        "Tu pedido ha sido enviado correctamente",
        "success",
      ).then(() => {
        vaciarCarrito();
        setNotas("");
        setMetodoPago("");
        navigate("/pedidos");
      });
    } catch (error) {
      Swal.fire(
        "Error",
        "No se pudo crear el pedido. Revisa la consola para más detalles.",
        "error",
      );
    }
  };

  const obtenerIcono = (nombre) => {
    switch (nombre.toLowerCase()) {
      case "efectivo":
        return "bi-cash";
      case "tarjeta":
        return "bi-credit-card-2-front";
      case "transferencia":
        return "bi-bank";
      case "pse":
        return "bi-wallet2";
      default:
        return "bi-credit-card";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 fw-bold">Checkout</h2>

      {/* Información del pedido */}
      <div className="card p-3 mb-4 shadow-sm border-0">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Cliente:</strong> {user?.username || "Usuario anónimo"}
          </div>
          <div>
            <strong>ID Orden:</strong> {pedidoIdTemporal}
          </div>
          <div>
            <strong>Fecha:</strong> {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      <hr />

      <div className="row g-4">
        {/* Lista de productos */}
        <div className="col-lg-8">
          {items.map((item) => (
            <div key={item.key} className="card mb-3 shadow-sm border-0">
              <div className="row g-0">
                <div className="col-md-3 d-flex align-items-center justify-content-center p-2">
                  <img
                    src={item.imagen}
                    className="img-fluid rounded"
                    alt={item.nombre_variante || item.nombre}
                    style={{ maxHeight: "100px", objectFit: "cover" }}
                  />
                </div>
                <div className="col-md-6">
                  <div className="card-body p-0 ps-3">
                    <h5 className="card-title mb-1">{item.producto_nombre}</h5>
                    <h6 className="card-title mb-1">
                      {item.nombre_variante || item.nombre}
                    </h6>
                    <p className="text-muted mb-1">
                      {item.codigo_barra || "—"}
                    </p>
                    <p className="card-text mb-0">Cantidad: {item.cantidad}</p>
                    <p className="card-text mb-0 fw-bold text-danger">
                      Precio unitario: ${item.precio.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-center justify-content-end pe-3">
                  <div>
                    <p className="fw-bold mb-0">Subtotal:</p>
                    <p className="fw-bold text-danger">
                      ${(item.precio * item.cantidad).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="mt-2 mb-0" /> {/* Solo línea de abajo */}
            </div>
          ))}
        </div>

        {/* Resumen de pago y método */}
        <div className="col-lg-4">
          <div className="card p-3 shadow-sm mb-3 border-0">
            <h5 className="fw-bold mb-3">Resumen de Pago</h5>
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>${total.toLocaleString()}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold text-primary">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="card p-3 shadow-sm mb-3">
            <h5 className="fw-bold mb-3">Método de Pago</h5>
            {metodos.length === 0 ? (
              <p className="text-muted">Cargando métodos...</p>
            ) : (
              metodos.map((metodo) => (
                <div
                  key={metodo.id}
                  className="form-check mb-2 d-flex align-items-center"
                >
                  <input
                    className="form-check-input border border-secondary"
                    type="radio"
                    name="metodoPago"
                    value={metodo.id}
                    checked={metodoPago === metodo.id}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <label className="form-check-label ms-2 fw-semibold">
                    <i className={`${obtenerIcono(metodo.nombre)} me-2`}></i>
                    {metodo.nombre}
                  </label>
                </div>
              ))
            )}
          </div>

          <div className="card p-3 shadow-sm mb-3">
            <label className="form-label fw-semibold">Notas (opcional)</label>
            <textarea
              className="form-control"
              placeholder="Escribe alguna nota para el pedido..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary fw-bold w-100 mt-3"
            onClick={handleSubmit}
          >
            <i className="bi bi-check2-circle me-2"></i> Confirmar Pedido
          </button>
        </div>
      </div>
      <br />
    </div>
  );
}
