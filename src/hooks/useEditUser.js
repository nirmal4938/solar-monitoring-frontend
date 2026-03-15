import { useEffect, useState, useCallback } from "react";
import { userService } from "../services/userService";

export const useEditUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // -----------------------------------
  // Fetch All Users
  // -----------------------------------
  const fetchUsers = useCallback(async () => {
    try {
      console.log("fetchUsers called");

      setLoading(true);
      setError(null);

      const response = await userService.getAll();
      console.log("response:", response);

      const normalizedUsers =
        Array.isArray(response)
          ? response
          : response?.data || [];

      setUsers(normalizedUsers);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------
  // Auto Fetch On Mount
  // -----------------------------------
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = useCallback(async (payload) => {
    const response = await userService.create(payload);
    await fetchUsers();
    return response;
  }, [fetchUsers]);

  const updateUser = useCallback(async (id, payload) => {
    const response = await userService.update(id, payload);
    await fetchUsers();
    return response;
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id) => {
    const response = await userService.remove(id);
    await fetchUsers();
    return response;
  }, [fetchUsers]);

  const getUserById = useCallback(async (id) => {
    return await userService.getById(id);
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
  };
};