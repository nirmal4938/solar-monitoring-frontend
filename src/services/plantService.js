import axiosInstance from "./axiosInstance";

const plantService = {
  // ===============================
  // Existing CRUD for plants
  // ===============================
  getAllPlants: async () => {
    const { data } = await axiosInstance.get("/plants");
    return data;
  },

  getPlantById: async (id) => {
    const { data } = await axiosInstance.get(`/plants/${id}`);
    return data;
  },

  createPlant: async (plant) => {
    const { data } = await axiosInstance.post("/plants", plant);
    return data;
  },

  updatePlant: async (id, plant) => {
    const { data } = await axiosInstance.put(`/plants/${id}`, plant);
    return data;
  },

  deletePlant: async (id) => {
    const { data } = await axiosInstance.delete(`/plants/${id}`);
    return data;
  },

  // ===============================
  // New: Plant Configuration
  // ===============================

  getPlantConfiguration: async (id) => {
    const { data } = await axiosInstance.get(`/plants/${id}/config`);
    return data;
  },

  createPlantConfiguration: async (id, mapping) => {
    // mapping = { inverters: [], batteries: [], weather_sensors: [], grid_meters: [] }
    const { data } = await axiosInstance.post(`/plants/${id}/config`, { mapping });
    return data;
  },

  updatePlantConfiguration: async (id, mapping) => {
    const { data } = await axiosInstance.put(`/plants/${id}/config`, { mapping });
    return data;
  },
};

export default plantService;