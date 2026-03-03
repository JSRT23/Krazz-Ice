import api from "../api/axios";

export const getEstadisticasCategoria = async (categoriaId, subcategoriaId) => {
  let url = `/dashboard-admin/estadisticas-categoria/?categoria=${categoriaId}`;

  if (subcategoriaId) {
    url += `&subcategoria=${subcategoriaId}`;
  }

  const { data } = await api.get(url);
  return data;
};
