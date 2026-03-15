// services/invertersService.js
import axiosInstance from "./axiosInstance";

export const invertersService = {
  getAll: () => axiosInstance.get("/inverters"),
  getById: (id) => axiosInstance.get(`/inverters/${id}`),
  create: (data) => axiosInstance.post("/inverters/add", data),
  update: (id, data) => axiosInstance.put(`/inverters/${id}`, data),
  delete: (id) => axiosInstance.delete(`/inverters/${id}`),
  getLogs: (id) => axiosInstance.get(`/inverters/${id}/logs`),
  getAlerts: (id) => axiosInstance.get(`/inverters/${id}/alerts`),
  getAI: (id) => axiosInstance.get(`/inverters/${id}/ai`),
  getMaintenance: (id) => axiosInstance.get(`/inverters/${id}/maintenance`),
  getByPlant: (plantId) => axiosInstance.get(`/inverters/plant/${plantId}`),
};