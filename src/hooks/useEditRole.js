// useEditRole.js
import { useState, useEffect, useCallback } from "react";
import { roleService } from "../services/roleService";

export const useEditRole = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all roles
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roleService.getAll();
      setRoles(Array.isArray(response) ? response : response?.data || []);
    } catch (err) {
      setError(err?.message || "Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all permissions (only once)
  const fetchPermissions = useCallback(async () => {
    try {
      const response = await roleService.getPermissions();
      setPermissions(Array.isArray(response?.data) ? response.data : response || []);
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, [fetchRoles, fetchPermissions]);

  // Map frontend keys (RESOURCE_ACTION) to backend UUIDs for saving
  const mapKeysToUUIDs = useCallback((selectedKeys) => {
    return selectedKeys
      .map((key) => {
        const [resource, action] = key.split("_");
        const perm = permissions.find(p => p.resource === resource && p.action === action);
        return perm?._id;
      })
      .filter(Boolean);
  }, [permissions]);

  // Save role
  const saveRole = useCallback(async ({ id, values, permissions: selectedKeys, organization_id }) => {
    const payload = {
      ...values,
      organization_id,
      permissions: mapKeysToUUIDs(selectedKeys),
    };
    if (id) {
      await roleService.update(id, payload);
    } else {
      await roleService.create(payload);
    }
    await fetchRoles();
  }, [mapKeysToUUIDs, fetchRoles]);

  // Delete role
  const deleteRole = useCallback(async (id) => {
    await roleService.remove(id);
    await fetchRoles();
  }, [fetchRoles]);

  // Get role by ID — now returns permissions as frontend keys directly
  const getRoleById = useCallback(async (id) => {
    const res = await roleService.getById(id);
    const roleData = res?.data || res;

    // Permissions already come as RESOURCE_ACTION keys in API
    return { ...roleData, permissions: roleData.permissions || [] };
  }, []);

  return {
    roles,
    permissions,
    loading,
    error,
    fetchRoles,
    fetchPermissions,
    saveRole,
    deleteRole,
    getRoleById,
  };
};