// dashboardService.js
import api from "./api";

export const getOperatorDashboardData = async () => {
  const response = await api.get("/operator/dashboard");
  return response.data;
};

export const getAdminDashboardData = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};
