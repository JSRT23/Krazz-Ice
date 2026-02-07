// src/services/pedidosServices.js
import axios from "../api/axios";

const PEDIDOS_URL = "/pedidos/pedidos/";
const DETALLES_URL = "/pedidos/detalles/";
const METODOS_PAGO_URL = "/pedidos/metodos-pago/";
const ESTADOS_URL = "/pedidos/estados/";
const ULTIMOS_15_URL = "/pedidos/mis-pedidos/ultimos-15-dias/";
const MIS_PEDIDOS_TODOS_URL = "/pedidos/mis-pedidos/todos/";

/**
 * Crear pedido nuevo (cliente)
 */
export const crearPedido = async (token, metodoPagoId, tipo = "externo") => {
  const estadosResp = await axios.get(ESTADOS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pendienteEstado = estadosResp.data.find(
    (e) => e.nombre === "Pendiente",
  );
  if (!pendienteEstado) throw new Error("No se encontró el estado 'Pendiente'");

  const { data } = await axios.post(
    PEDIDOS_URL,
    { metodo_pago_id: metodoPagoId, tipo, estado_id: pendienteEstado.id },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
};

/**
 * Agregar producto a pedido existente
 */
export const agregarProductoAPedido = async (token, productoData) => {
  const { data } = await axios.post(DETALLES_URL, productoData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Métodos de pago
 */
export const obtenerMetodosPago = async (token) => {
  const { data } = await axios.get(METODOS_PAGO_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Pedidos del DÍA DE HOY del cliente logueado
 * (el backend ya filtra por token)
 */
export const obtenerPedidosHoy = async (token) => {
  const { data } = await axios.get(PEDIDOS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Pedidos últimos 15 días del cliente logueado
 */
export const obtenerPedidosUltimos15 = async (token) => {
  const { data } = await axios.get(ULTIMOS_15_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

/**
 * Todos los pedidos del cliente sin límite
 */
export const obtenerMisPedidosTodos = async (token) => {
  const { data } = await axios.get(MIS_PEDIDOS_TODOS_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
