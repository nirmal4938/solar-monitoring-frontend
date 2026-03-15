// import axiosInstance from "./axiosInstance";

// const BASE_URL = "/roles";

// export const roleService = {
//   // -----------------------------------
//   // Get All Roles
//   // -----------------------------------
//   async getAll() {
//     const res = await axiosInstance.get(BASE_URL);
//     return res.data;
//   },

//   // -----------------------------------
//   // Get Role By ID
//   // -----------------------------------
//   async getById(id) {
//     const res = await axiosInstance.get(`${BASE_URL}/${id}`);
//     return res.data;
//   },

//   // -----------------------------------
//   // Create Role
//   // -----------------------------------
//   async create(payload) {
//     const res = await axiosInstance.post(BASE_URL, payload);
//     return res.data;
//   },

//   // -----------------------------------
//   // Update Role
//   // -----------------------------------
//   async update(id, payload) {
//     const res = await axiosInstance.put(`${BASE_URL}/${id}`, payload);
//     return res.data;
//   },

//   // -----------------------------------
//   // Delete Role
//   // -----------------------------------
//   async remove(id) {
//     const res = await axiosInstance.delete(`${BASE_URL}/${id}`);
//     return res.data;
//   },
// };


// services/roleService.js
import axiosInstance from "./axiosInstance";

export const roleService = {
  getAll: async () => {
    const res = await axiosInstance.get("/roles");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/roles/${id}`);
    return res.data;
  },

  create: async (payload) => {
    const res = await axiosInstance.post("/roles", payload);
    return res.data;
  },

  update: async (id, payload) => {
    const res = await axiosInstance.put(`/roles/${id}`, payload);
    return res.data;
  },

  remove: async (id) => {
    const res = await axiosInstance.delete(`/roles/${id}`);
    return res.data;
  },
  getPermissions: async () => {
    const res = await axiosInstance.get("/permissions");
    return res.data;
  },
};