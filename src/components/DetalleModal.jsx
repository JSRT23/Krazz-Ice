import { Modal, Button, Table, Image } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaUserAlt,
  FaCalendarAlt,
  FaChair,
} from "react-icons/fa";
import "../../styles/pedidos.css";

export default function DetallePedidoModal({ modalData, closeModal }) {
  const estadoColor = (estado) => {
    switch (estado) {
      case "Pendiente":
        return "bg-warning";
      case "En cocina":
        return "bg-info";
      case "Listo":
        return "bg-success";
      case "Entregado":
        return "bg-secondary";
      default:
        return "bg-danger";
    }
  };

  return (
    <AnimatePresence>
      {modalData && (
        <Modal
          show={!!modalData}
          onHide={closeModal}
          size="lg"
          centered
          backdrop="static"
          className="pedido-modal"
        >
          {/* Animación de entrada del modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Modal.Header
              closeButton
              className={`text-white py-3 px-4 border-0 ${estadoColor(
                modalData?.estado?.nombre,
              )}`}
            >
              <Modal.Title className="d-flex align-items-center gap-3 fs-4 fw-semibold">
                <i className="bi bi-receipt fs-3"></i>
                <div>
                  Pedido <span className="fw-bold">#{modalData?.id}</span>
                  <br />
                  <span className="badge bg-light text-dark mt-1 fs-6 shadow-sm">
                    {modalData?.estado?.nombre}
                  </span>
                </div>
              </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light p-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Información del cliente */}
                <div className="row mb-4 text-dark">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <FaUserAlt className="me-2 text-primary" />
                      <strong>Cliente:</strong> {modalData.cliente_nombre}
                    </p>
                    {modalData.mesa && (
                      <p className="mb-2">
                        <FaChair className="me-2 text-secondary" />
                        <strong>Mesa:</strong> {modalData.mesa}
                      </p>
                    )}
                    <p className="mb-2">
                      <strong>📦 Tipo:</strong>{" "}
                      {modalData.tipo === "externo"
                        ? "🛵 Para llevar"
                        : "🏪 En tienda"}
                    </p>
                  </div>

                  <div className="col-md-6 text-md-end">
                    <p className="mb-2">
                      <FaCalendarAlt className="me-2 text-success" />
                      <strong>Fecha:</strong>{" "}
                      {new Date(modalData.fecha_pedido).toLocaleString()}
                    </p>
                    <p className="mb-2">
                      <FaMoneyBillWave className="me-2 text-success" />
                      <strong>Método de pago:</strong>{" "}
                      {modalData.metodo_pago.nombre}
                    </p>
                  </div>
                </div>

                {/* Tabla de productos */}
                <div className="table-responsive shadow-sm rounded-4 overflow-hidden">
                  <Table hover bordered className="align-middle bg-white mb-0">
                    <thead className="table-light text-center">
                      <tr>
                        <th>Imagen</th>
                        <th>Producto</th>
                        <th>Variante</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modalData.detalles?.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          className="text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <td>
                            <Image
                              src={
                                item.variante.imagen_variante ||
                                item.variante.imagen_producto ||
                                "/sin-imagen.jpg"
                              }
                              roundedCircle
                              className="shadow-sm"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                              }}
                            />
                          </td>
                          <td className="text-start fw-semibold">
                            {item.variante.producto_nombre}
                          </td>
                          <td>{item.variante.nombre_variante}</td>
                          <td>{item.cantidad}</td>
                          <td className="text-end">
                            ${parseFloat(item.precio_unitario).toLocaleString()}
                          </td>
                          <td className="text-end fw-bold text-success">
                            $
                            {(
                              item.cantidad * parseFloat(item.precio_unitario)
                            ).toLocaleString()}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {/* Total */}
                <motion.div
                  className="d-flex justify-content-end mt-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="bg-dark text-white px-5 py-3 rounded-pill shadow-sm">
                    <span className="fw-bold fs-5">
                      💰 Total: ${parseFloat(modalData.total).toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </Modal.Body>

            <Modal.Footer className="bg-light border-0 py-3">
              <Button variant="outline-secondary" onClick={closeModal}>
                <i className="bi bi-x-circle me-2"></i> Cerrar
              </Button>
            </Modal.Footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
}
