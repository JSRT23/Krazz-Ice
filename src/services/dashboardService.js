import api from "../api/axios";

// 📊 KPIs Generales
export const getKPIsGenerales = async () => {
  const { data } = await api.get("/dashboard-admin/kpis-generales/");
  return data;
};

// 📘 Lista de días con ventas
export const getDiasVentas = async () => {
  const { data } = await api.get("/dashboard-admin/dias-ventas/");
  return data;
};

// 📅 Detalle por día
export const getDetalleDia = async (fecha) => {
  const { data } = await api.get(
    `/dashboard-admin/detalle-ventas-dia/?fecha=${fecha}`,
  );
  return data;
};
