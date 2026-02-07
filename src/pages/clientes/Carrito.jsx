import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useCarrito } from "../../context/CarritoContext";

export default function Carrito() {
  const {
    items = [],
    eliminarDelCarrito,
    vaciarCarrito,
    actualizarCantidad,
  } = useCarrito();

  const total = items.reduce(
    (acc, item) => acc + (item.precio || 0) * (item.cantidad || 0),
    0,
  );

  return (
    <div className="container py-5 mt-5">
      <h2 className="mb-4 fw-bold text-center">
        <i className="bi bi-cart-check text-primary me-2"></i>
        Tu carrito de compras
      </h2>

      {items.length === 0 ? (
        <div className="text-center my-5">
          <i className="bi bi-cart-x display-1 text-secondary"></i>
          <h4 className="mt-3">Tu carrito está vacío</h4>
          <p className="text-muted">
            Agrega productos desde el menú para comenzar tu pedido.
          </p>
          <Link
            to="/menu"
            className="btn btn-primary mt-3 fw-semibold px-4 py-2 rounded-pill"
          >
            <i className="bi bi-cup-straw me-2"></i> Ir al Menú
          </Link>
        </div>
      ) : (
        <>
          {/* ===================== DESKTOP ===================== */}
          <div className="table-responsive d-none d-md-block">
            <table className="table align-middle table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th style={{ width: "150px" }}>Cantidad</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key}>
                    <td className="fw-semibold">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.imagen}
                          alt={item.nombre_variante || item.producto_nombre}
                          className="rounded"
                          style={{ width: 60, height: 60, objectFit: "cover" }}
                        />
                        <div>
                          <div>{item.producto_nombre}</div>
                          <div className="text-muted">
                            {item.nombre_variante}
                          </div>
                          <div className="small text-secondary d-flex align-items-center gap-2">
                            <i className="bi bi-upc-scan"></i>
                            {item.codigo_barra || "Sin código"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>${item.precio.toLocaleString()}</td>

                    <td>
                      <div className="input-group input-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          disabled={item.cantidad <= 1}
                          onClick={() =>
                            actualizarCantidad(item.key, item.cantidad - 1)
                          }
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        <input
                          type="number"
                          className="form-control text-center fw-semibold"
                          value={item.cantidad}
                          min={1}
                          max={item.stock || 999}
                          onChange={(e) =>
                            actualizarCantidad(
                              item.key,
                              Math.min(
                                Math.max(parseInt(e.target.value) || 1, 1),
                                item.stock || 999,
                              ),
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-primary"
                          disabled={item.cantidad >= (item.stock || 999)}
                          onClick={() =>
                            actualizarCantidad(item.key, item.cantidad + 1)
                          }
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </td>

                    <td>${(item.precio * item.cantidad).toLocaleString()}</td>

                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarDelCarrito(item.key)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ===================== MOBILE ===================== */}
          <div className="d-md-none">
            {items.map((item) => (
              <div key={item.key} className="card shadow-sm border-0 mb-3">
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <img
                      src={item.imagen}
                      alt={item.nombre_variante}
                      className="rounded"
                      style={{ width: 80, height: 80, objectFit: "cover" }}
                    />
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{item.producto_nombre}</h6>
                      <div className="text-muted small">
                        {item.nombre_variante}
                      </div>
                      <div className="small text-secondary d-flex align-items-center gap-1">
                        <i className="bi bi-upc-scan"></i>
                        {item.codigo_barra || "Sin código"}
                      </div>
                      <div className="fw-semibold mt-1">
                        ${item.precio.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div
                      className="input-group input-group-sm"
                      style={{ width: 120 }}
                    >
                      <button
                        className="btn btn-outline-primary"
                        disabled={item.cantidad <= 1}
                        onClick={() =>
                          actualizarCantidad(item.key, item.cantidad - 1)
                        }
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className="form-control text-center"
                        value={item.cantidad}
                        onChange={(e) =>
                          actualizarCantidad(
                            item.key,
                            Math.min(
                              Math.max(parseInt(e.target.value) || 1, 1),
                              item.stock || 999,
                            ),
                          )
                        }
                      />
                      <button
                        className="btn btn-outline-primary"
                        onClick={() =>
                          actualizarCantidad(item.key, item.cantidad + 1)
                        }
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>

                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => eliminarDelCarrito(item.key)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>

                  <div className="text-end mt-2 fw-bold">
                    Subtotal: ${(item.precio * item.cantidad).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===================== TOTAL ===================== */}
          <div className="mt-4 d-flex flex-column flex-md-row justify-content-between gap-3">
            <button
              className="btn btn-outline-danger fw-semibold"
              onClick={vaciarCarrito}
            >
              <i className="bi bi-x-circle me-2"></i> Vaciar carrito
            </button>

            <div className="text-end">
              <h4 className="fw-bold">
                Total:{" "}
                <span className="text-danger">${total.toLocaleString()}</span>
              </h4>
              <Link
                to="/confirmar-pedido"
                className="btn btn-primary fw-semibold px-4 py-2 rounded-pill"
              >
                <i className="bi bi-check2-circle me-2"></i>
                Confirmar pedido
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
