import { useEffect, useState } from "react";
import {
  getKPIsGenerales,
  getDiasVentas,
  getDetalleDia,
} from "../../services/dashboardService";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Modal } from "react-bootstrap";

export default function DashboardAdmin() {
  const [kpis, setKpis] = useState({
    total_ventas_mes: 0,
    total_ventas_semana: 0,
    ticket_promedio: 0,
    producto_mas_vendido: null,
    meses: [],
    semanas: [],
  });

  const [dias, setDias] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [loading, setLoading] = useState(true);

  const [showMeses, setShowMeses] = useState(false);
  const [showSemanas, setShowSemanas] = useState(false);

  const formatearCOP = (valor) => {
    const numero = Number(valor) || 0;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numero);
  };

  const formatearMes = (mesString) => {
    if (!mesString) return "";
    const [anio, mes] = mesString.split("-");
    const fecha = new Date(Number(anio), Number(mes) - 1);
    return fecha.toLocaleDateString("es-CO", {
      month: "long",
      year: "numeric",
    });
  };

  const formatearRangoSemana = (inicio, fin) => {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const opciones = { day: "numeric", month: "long" };
    return `${fechaInicio.toLocaleDateString("es-CO", opciones)} al ${fechaFin.toLocaleDateString("es-CO", opciones)}`;
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [kpiData, diasData] = await Promise.all([
        getKPIsGenerales(),
        getDiasVentas(),
      ]);

      setKpis({
        total_ventas_mes: kpiData?.total_ventas_mes || 0,
        total_ventas_semana: kpiData?.total_ventas_semana || 0,
        ticket_promedio: kpiData?.ticket_promedio || 0,
        producto_mas_vendido: kpiData?.producto_mas_vendido || null,
        meses: kpiData?.meses || [],
        semanas: kpiData?.semanas || [],
      });

      setDias(diasData || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verDetalle = async (fecha) => {
    try {
      const data = await getDetalleDia(fecha);
      setDetalle(data);
      setMostrarDetalle(true);
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setTimeout(() => setDetalle(null), 300);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-dark"></div>
        <p className="mt-3">Cargando panel...</p>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-3 py-md-4 px-3 px-md-4"
      style={{ background: "#f5f7fa", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 mb-4 text-center text-md-start">
        <h2 className="fw-bold mb-0">Panel Administrativo</h2>

        <span className="badge bg-dark px-3 py-2 align-self-center align-self-md-auto">
          <i className="bi bi-graph-up-arrow me-2"></i>
          Control de Ventas
        </span>
      </div>

      {/* KPIs */}
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow border-0 rounded-4 p-3 h-100"
            style={{ cursor: "pointer" }}
            onClick={() => setShowMeses(true)}
          >
            <p className="text-muted mb-1">Total Mes</p>
            <h4 className="fw-bold text-success">
              {formatearCOP(kpis.total_ventas_mes)}
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div
            className="card shadow border-0 rounded-4 p-3 h-100"
            style={{ cursor: "pointer" }}
            onClick={() => setShowSemanas(true)}
          >
            <p className="text-muted mb-1">Total Semana</p>
            <h4 className="fw-bold text-primary">
              {formatearCOP(kpis.total_ventas_semana)}
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow border-0 rounded-4 p-3 h-100">
            <p className="text-muted mb-1">Ticket Promedio</p>
            <h4 className="fw-bold text-warning">
              {formatearCOP(kpis.ticket_promedio)}
            </h4>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow border-0 rounded-4 p-3 h-100">
            <p className="text-muted mb-1">Producto Top</p>
            <h6 className="fw-bold">
              {kpis.producto_mas_vendido
                ? `${kpis.producto_mas_vendido["variante__producto__nombre"]} - ${kpis.producto_mas_vendido["variante__nombre_variante"]}`
                : "Sin datos"}
            </h6>
            <small>
              Cantidad: {kpis.producto_mas_vendido?.total_vendido ?? 0}
            </small>
          </div>
        </div>
      </div>

      {/* MODAL MESES */}
      <Modal
        show={showMeses}
        onHide={() => setShowMeses(false)}
        centered
        size="lg"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <i className="bi bi-calendar-month me-2 text-success"></i>
            Resumen Mensual
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          {kpis.meses.length > 0 ? (
            <div className="row g-3">
              {kpis.meses.map((mes, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <small className="text-muted text-capitalize">
                      {formatearMes(mes.mes)}
                    </small>
                    <h5 className="fw-bold text-success mt-2 mb-0">
                      {formatearCOP(mes.total)}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-database-exclamation fs-3"></i>
              <p className="mt-2 mb-0">No hay datos mensuales disponibles</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL SEMANAS */}
      <Modal
        show={showSemanas}
        onHide={() => setShowSemanas(false)}
        centered
        size="lg"
        fullscreen="sm-down"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">
            <i className="bi bi-calendar-week me-2 text-primary"></i>
            Detalle Semanal
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="pt-2">
          {kpis.semanas.length > 0 ? (
            <div className="row g-3">
              {kpis.semanas.map((semana, i) => (
                <div key={i} className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 p-3 h-100">
                    <small className="text-muted text-capitalize">
                      Semana {i + 1}
                    </small>
                    <div className="small text-muted">
                      {formatearRangoSemana(semana.inicio, semana.fin)}
                    </div>
                    <h5 className="fw-bold text-primary mt-2 mb-0">
                      {formatearCOP(semana.total)}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <i className="bi bi-calendar-x fs-3"></i>
              <p className="mt-2 mb-0">No hay datos semanales disponibles</p>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* DETALLE DIARIO */}
      <div className="row mt-4 mt-md-5 g-4">
        <div className="col-12 col-lg-4">
          <div className="card shadow border-0 rounded-4 p-3 h-100">
            <h5 className="fw-semibold mb-3">
              <i className="bi bi-calendar3 me-2"></i>
              Días con Ventas
            </h5>

            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
              {dias.map((dia) => (
                <div
                  key={dia.fecha_dia}
                  className="d-flex justify-content-between align-items-center border-bottom py-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => verDetalle(dia.fecha_dia)}
                >
                  <span>{dia.fecha_dia}</span>
                  <span className="fw-bold text-success">
                    {formatearCOP(dia.total_dia)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          {mostrarDetalle && detalle ? (
            <div className="card shadow rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-semibold mb-0">
                  <i className="bi bi-bar-chart-line me-2"></i>
                  Detalle del Día
                </h5>

                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={cerrarDetalle}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded-3">
                    <strong>Total General</strong>
                    <h5 className="text-success">
                      {formatearCOP(detalle.total_general)}
                    </h5>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded-3">
                    <strong>Efectivo</strong>
                    <h6>{formatearCOP(detalle.total_efectivo)}</h6>
                    <strong>Transferencia</strong>
                    <h6>{formatearCOP(detalle.total_transferencia)}</h6>
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="bg-light p-3 rounded-3">
                    <strong>Total Productos</strong>
                    <h6>{detalle.cantidad_total_productos}</h6>
                  </div>
                </div>
              </div>

              {detalle.categorias?.map((categoria, indexCat) => (
                <div key={indexCat} className="mb-4">
                  <div className="bg-dark text-white p-3 rounded-3">
                    <h6 className="mb-1">{categoria.categoria}</h6>
                    <small>
                      Cantidad: {categoria.cantidad_total} | Total:{" "}
                      {formatearCOP(categoria.total_dinero)}
                    </small>
                  </div>

                  {categoria.subcategorias?.map((sub, indexSub) => (
                    <div
                      key={indexSub}
                      className="border rounded-3 p-3 mt-3 bg-light"
                    >
                      <h6 className="fw-bold">{sub.subcategoria}</h6>
                      <small>
                        Cantidad: {sub.cantidad_total} | Total:{" "}
                        {formatearCOP(sub.total_dinero)}
                      </small>

                      <div className="table-responsive mt-2">
                        <table className="table table-sm table-striped">
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sub.productos?.map((prod, indexProd) => (
                              <tr key={indexProd}>
                                <td>{prod.producto}</td>
                                <td>{prod.cantidad_total}</td>
                                <td>{formatearCOP(prod.total_dinero)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="card shadow rounded-4 p-4 text-center text-muted">
              Selecciona un día para ver el detalle
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
