import { createContext, useContext, useState, useEffect } from "react";
import {
  loginUser,
  signupUser,
  fetchProfile,
  logoutUser,
} from "../services/authService";
// import { error } from "echarts/types/src/util/log.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [plantAccess, setPlantAccess] = useState([]);
  const [organization, setOrganization] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchProfile();
        setOrganization(data?.organization);
        setUser(data.user);
        setRoles(data.roles || []);
        setPermissions(data.permissions || []);
        // setPlantAccess(profile.plantAccess || []);
      } catch (err) {
        console.log("error", err);
        localStorage.removeItem("accessToken");
        setUser(null);
        setRoles([]);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("accessToken", data.accessToken);
    const profile = await fetchProfile();
    setUser(profile.user);
    setRoles(profile.roles || []);
    setPermissions(profile.permissions || []);
  };
  const signup = async (payload) => {
    const data = await signupUser(payload);

    localStorage.setItem("accessToken", data.accessToken);

    const profile = await fetchProfile();

    setUser(profile.user);
    setRoles(profile.roles || []);
    setPermissions(profile.permissions || []);
    setOrganization(profile.organization);
  };

  const logout = async () => {
    const data = await logoutUser();
    localStorage.removeItem("accessToken");
    setUser(null);
    setRoles([]);
    setPermissions([]);
  };

  const hasRole = (roleName) => roles.includes(roleName);

  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        permissions,
        loading,
        login,
        signup,
        logout,
        hasRole,
        hasPermission,
        isAuthenticated: !!user,
        organization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
