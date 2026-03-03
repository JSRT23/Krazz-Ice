// src/router/AppRouter.jsx
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import HomeMesero from "../pages/mesero/HomeMesero";
import CrearPedidoPage from "../pages/mesero/CrearPedidoPage";
import ModificarPedidosPage from "../pages/mesero/ModificarPedidosPage";
import CocinaPage from "../pages/cocinero/CocinaPage";
import Nosotros from "../pages/Nosotros";
import Menu from "../pages/Menu";
import VarianteDetalle from "../pages/VarianteDetalle";
import Carrito from "../pages/clientes/Carrito";
import RealizarPedido from "../pages/clientes/RealizarPedido";
import Pedidos from "../pages/clientes/Pedidos";
import MisPedidos from "../pages/clientes/MisPedidos";
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import EstadisticasProductos from "../pages/admin/EstadisticasProductos";

export default function AppRouter() {
  return (
    <Routes>
      {/* Público */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/producto/variante/:id" element={<VarianteDetalle />} />

      {/* Cliente */}

      {/*Pedidos */}
      <Route
        path="/carrito"
        element={
          <PrivateRoute allowedRoles={["CLIENTE"]}>
            <Carrito />
          </PrivateRoute>
        }
      />
      <Route
        path="/confirmar-pedido"
        element={
          <PrivateRoute allowedRoles={["CLIENTE"]}>
            <RealizarPedido />
          </PrivateRoute>
        }
      />

      <Route
        path="/pedidos"
        element={
          <PrivateRoute allowedRoles={["CLIENTE"]}>
            <Pedidos />
          </PrivateRoute>
        }
      />
      <Route
        path="/pedidos/todos"
        element={
          <PrivateRoute allowedRoles={["CLIENTE"]}>
            <MisPedidos />
          </PrivateRoute>
        }
      />

      {/* Mesero */}

      {/*Registrar clientes nuevos   */}

      <Route
        path="/register"
        element={
          <PrivateRoute allowedRoles={["MESERO"]}>
            <Register />
          </PrivateRoute>
        }
      />
      <Route
        path="/mesero"
        element={
          <PrivateRoute allowedRoles={["MESERO"]}>
            <HomeMesero />
          </PrivateRoute>
        }
      />
      <Route
        path="/mesero/pedidos/nuevo"
        element={
          <PrivateRoute allowedRoles={["MESERO"]}>
            <CrearPedidoPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/mesero/pedidos/hoy"
        element={
          <PrivateRoute allowedRoles={["MESERO"]}>
            <ModificarPedidosPage />
          </PrivateRoute>
        }
      />

      {/* Cocinero */}
      <Route
        path="/cocina"
        element={
          <PrivateRoute allowedRoles={["COCINERO"]}>
            <CocinaPage />
          </PrivateRoute>
        }
      />
      {/* Dashboard Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <DashboardAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/estadisticas-productos"
        element={
          <PrivateRoute allowedRoles={["ADMIN"]}>
            <EstadisticasProductos />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
