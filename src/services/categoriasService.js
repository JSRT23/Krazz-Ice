import api from "../api/axios";

export const getCategorias = async () => {
  const { data } = await api.get("/dashboard-admin/categorias/");
  return data;
};

export const getSubcategorias = async (categoriaId) => {
  const { data } = await api.get(
    `/dashboard-admin/subcategorias/?categoria=${categoriaId}`,
  );
  return data;
};
