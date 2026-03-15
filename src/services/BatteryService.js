// services/batteriesService.js
import axiosInstance from "./axiosInstance";

const selectedPlantId = localStorage.getItem("selectedPlantId");

export const batteriesService = {
  getAll: (plantId = selectedPlantId) =>
    axiosInstance.get("/batteries", { params: { plantId } }),
  getById: (id) => axiosInstance.get(`/batteries/${id}`),
  create: (data) => axiosInstance.post("/batteries/add", data),
  update: (id, data) => axiosInstance.put(`/batteries/${id}`, data),
  delete: (id) => axiosInstance.delete(`/batteries/${id}`),
  getLogs: (id) => axiosInstance.get(`/batteries/${id}/logs`),
  getAlerts: (id) => axiosInstance.get(`/batteries/${id}/alerts`),
  getAI: (id) => axiosInstance.get(`/batteries/${id}/ai`),
  getMaintenance: (id) => axiosInstance.get(`/batteries/${id}/maintenance`),
  getByPlant: (plantId) => axiosInstance.get(`/batteries/plant/${plantId}`),
};