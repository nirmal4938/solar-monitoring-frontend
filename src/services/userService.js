import axiosInstance from "./axiosInstance";

// Base path: /api/users
const BASE_URL = "/users";

export const userService = {
  // -----------------------------
  // Get All Users
  // -----------------------------
  async getAll() {
    const res = await axiosInstance.get(BASE_URL);
    return res.data;
  },

  // -----------------------------
  // Get Single User
  // -----------------------------
  async getById(id) {
    const res = await axiosInstance.get(`${BASE_URL}/${id}`);
    return res.data;
  },

  // -----------------------------
  // Create User
  // -----------------------------
  async create(data) {
    const res = await axiosInstance.post(BASE_URL, data);
    return res.data;
  },

  // -----------------------------
  // Update User
  // -----------------------------
  async update(id, data) {
    const res = await axiosInstance.put(`${BASE_URL}/${id}`, data);
    return res.data;
  },

  // -----------------------------
  // Delete User (Soft Delete)
  // -----------------------------
  async remove(id) {
    const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return res.data;
  },
};