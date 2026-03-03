import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import { getEstadisticasCategoria } from "../../services/estadisticasService";
import {
  getCategorias,
  getSubcategorias,
} from "../../services/categoriasService";

/* 🎨 Generador automático de color basado en texto */
const generarColorDesdeTexto = (texto) => {
  let hash = 0;

  for (let i = 0; i < texto.length; i++) {
    hash = texto.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 50%)`;
};

const EstadisticasProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] =
    useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  /* 🔄 Cargar categorías */
  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const res = await getCategorias();
        setCategorias(res);
      } catch (error) {
        console.error(error);
      }
    };
    cargarCategorias();
  }, []);

  /* 🔄 Cargar subcategorías cuando cambia categoría */
  useEffect(() => {
    if (!categoriaSeleccionada) return;

    const cargarSubcategorias = async () => {
      try {
        const res = await getSubcategorias(categoriaSeleccionada.id);
        setSubcategorias(res);
        setSubcategoriaSeleccionada(null);
      } catch (error) {
        console.error(error);
      }
    };

    cargarSubcategorias();
  }, [categoriaSeleccionada]);

  /* 🔄 Cargar estadísticas */
  useEffect(() => {
    if (!categoriaSeleccionada) return;

    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const res = await getEstadisticasCategoria(
          categoriaSeleccionada.id,
          subcategoriaSeleccionada?.id,
        );
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [categoriaSeleccionada, subcategoriaSeleccionada]);

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">
      <h2 className="fw-bold mb-4">Estadísticas de Productos</h2>

      {/* FILTROS */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body row g-3">
          {/* Categoría */}
          <div className="col-md-4">
            <label className="fw-semibold mb-2">Categoría</label>
            <select
              className="form-select rounded-3"
              value={categoriaSeleccionada?.id || ""}
              onChange={(e) => {
                const cat = categorias.find(
                  (c) => c.id === parseInt(e.target.value),
                );
                setCategoriaSeleccionada(cat);
              }}
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategoría */}
          <div className="col-md-4">
            <label className="fw-semibold mb-2">Subcategoría</label>
            <select
              className="form-select rounded-3"
              disabled={!categoriaSeleccionada}
              value={subcategoriaSeleccionada?.id || ""}
              onChange={(e) => {
                const sub = subcategorias.find(
                  (s) => s.id === parseInt(e.target.value),
                );
                setSubcategoriaSeleccionada(sub);
              }}
            >
              <option value="">Seleccionar subcategoría</option>
              {subcategorias.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-dark" />
        </div>
      )}

      {/* GRÁFICOS */}
      {data && (
        <div className="row g-4">
          {/* TOP PRODUCTOS */}
          <div className="col-lg-6">
            <div className="card border-0 shadow rounded-4 h-100 card-hover">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Top Productos</h5>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.productos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="variante__producto__nombre" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_vendido" radius={[8, 8, 0, 0]}>
                      {data.productos.map((entry, index) => (
                        <Cell
                          key={`cell-prod-${index}`}
                          fill={generarColorDesdeTexto(
                            entry.variante__producto__nombre,
                          )}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* TOP VARIANTES */}
          <div className="col-lg-6">
            <div className="card border-0 shadow rounded-4 h-100 card-hover">
              <div className="card-body">
                <h5 className="fw-bold mb-3">Top Variantes</h5>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.variantes}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="variante__nombre_variante" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total_vendido" radius={[8, 8, 0, 0]}>
                      {data.variantes.map((entry, index) => (
                        <Cell
                          key={`cell-var-${index}`}
                          fill={generarColorDesdeTexto(
                            entry.variante__producto__nombre +
                              entry.variante__nombre_variante,
                          )}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estilos hover */}
      <style>
        {`
          .card-hover {
            transition: all 0.25s ease;
          }

          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 28px rgba(0,0,0,0.08);
          }
        `}
      </style>
    </div>
  );
};

export default EstadisticasProductos;
