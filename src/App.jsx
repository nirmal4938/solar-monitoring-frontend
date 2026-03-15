// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout
import AppLayout from "./layout/AppLayout";

// Dashboards
import { Dashboard } from "./pages/Dashboard";
import GenerationDashboard from "./pages/GenerationDashboard";
import ConsumptionDashboard from "./pages/ConsumptionDashboard";
import EnterpriseEnergyCenter from "./pages/EnterpriseEnergyCenter";
import BatteryIntelligence from "./pages/BatteryIntelligence";
import InverterIntelligence from "./pages/InverterIntelligence";

// Plants
import { PlantListPage } from "./pages/plants/PlantListPage";
import { PlantCreatePage } from "./pages/plants/PlantCreatePage";
import { PlantViewPage } from "./pages/plants/PlantViewPage";

// Users & Roles
import { UserListPage } from "./pages/users/UserListPage";
import { AddEditUser } from "./pages/users/AddEditUser";
import { RoleListPage } from "./pages/roles/RoleListPage";
import { AddEditRole } from "./pages/roles/AddEditRole";

// Alerts
import AlertRulesPage from "./pages/alerts/AlertRulesPage";
import { AlertHistoryPage } from "./pages/alerts/AlertHistoryPage";
import AlertRuleEditor from "./components/alerts/AlertRuleEditor";
import { AlertConsolePage } from "./components/alerts/AlertConsolePage";

// Public Pages
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";

// Batteries Pages
import { BatteriesList } from "./pages/battries/BatteriesList";
import { BatteryAdd } from "./pages/battries/BatteryAdd";
import { BatteryDetails } from "./pages/battries/BatteryDetails";
import { BatteryLogs } from "./pages/battries/BatteryLogs";
import { BatteryAlerts } from "./pages/battries/BatteryAlerts";
import { BatteryAI } from "./pages/battries/BatteryAI";
import { BatteryMaintenance } from "./pages/battries/BatteryMaintenance";
import { PlantBatteries } from "./pages/battries/PlantBatteries";

// Inverters Pages
import { InvertersList } from "./pages/inverters/InvertersList";
import { InverterAddUpdate } from "./pages/inverters/InverterAdd";
import { InverterDetails } from "./pages/inverters/InverterDetails";
import { InverterLogs } from "./pages/inverters/InverterLogs";
import { InverterAlerts } from "./pages/inverters/InverterAlerts";
import { InverterAI } from "./pages/inverters/InverterAI";
import { InverterMaintenance } from "./pages/inverters/InverterMaintenance";
import { PlantInverters } from "./pages/inverters/PlantInverters";
import { PlantDesignerPage } from "./pages/plants/PlantDesignerPage";
import { PlantConfigurationListPage } from "./pages/plants/PlantConfigurationListPage";
import { usePageLoader } from "./hooks/usePageLoader";
/* ======================================================
   🔐 Protected Route
====================================================== */
const ProtectedRoute = ({ children, permission }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();

  usePageLoader(loading);

  // WAIT until auth is resolved
  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

/* ======================================================
   🌐 Public Route
====================================================== */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/generation" replace />;
  return children;
};

/* ======================================================
   🚫 Unauthorized Page
====================================================== */
const UnauthorizedPage = () => (
  <div
    className="flex align-items-center justify-content-center min-h-screen"
    style={{ background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)" }}
  >
    <div
      style={{
        background: "#ffffff",
        padding: "40px",
        borderRadius: "10px",
        border: "1px solid #e6e9ef",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "10px", color: "#111827" }}>
        403 — Access Restricted
      </h2>
      <p style={{ color: "#6b7280" }}>
        Your role does not grant access to this module.
      </p>
    </div>
  </div>
);

/* ======================================================
   🌍 App Routes
====================================================== */
export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* Dashboards */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute permission="GENERATION_VIEW">
              <Dashboard />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="generation"
          element={
            <ProtectedRoute permission="GENERATION_VIEW">
              <GenerationDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="consumption"
          element={
            <ProtectedRoute permission="CONSUMPTION_VIEW">
              <ConsumptionDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="operational"
          element={
            <ProtectedRoute permission="OPERATIONAL_VIEW">
              <EnterpriseEnergyCenter />
            </ProtectedRoute>
          }
        />

        {/* Batteries */}
        <Route
          path="batteries"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteriesList />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/add"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id/edit"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryAdd />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id/logs"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id/alerts"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id/ai"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/:id/maintenance"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <BatteryMaintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="batteries/plant/:plantId"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <PlantBatteries />
            </ProtectedRoute>
          }
        />

        {/* Inverters */}
        <Route
          path="inverters"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InvertersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="inverters/add"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterAddUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/:id"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/:id/logs"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/:id/alerts"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterAlerts />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/:id/ai"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterAI />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/:id/maintenance"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <InverterMaintenance />
            </ProtectedRoute>
          }
        />
        <Route
          path="inverters/plant/:plantId"
          element={
            <ProtectedRoute permission="BATTERY_VIEW">
              <PlantInverters />
            </ProtectedRoute>
          }
        />

        {/* Plants */}
        <Route
          path="plants"
          element={
            <ProtectedRoute permission="PLANT_VIEW">
              <PlantListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plants/new"
          element={
            <ProtectedRoute permission="PLANT_CREATE">
              <PlantCreatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plants/:id"
          element={
            <ProtectedRoute permission="PLANT_VIEW">
              <PlantViewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plants/:id/edit"
          element={
            <ProtectedRoute permission="PLANT_EDIT">
              <PlantCreatePage />
            </ProtectedRoute>
          }
        />

        {/* Users */}
        <Route
          path="users"
          element={
            <ProtectedRoute permission="USER_VIEW">
              <UserListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/new"
          element={
            <ProtectedRoute permission="USER_CREATE">
              <AddEditUser mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:id"
          element={
            <ProtectedRoute permission="USER_VIEW">
              <AddEditUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:id/edit"
          element={
            <ProtectedRoute permission="USER_EDIT">
              <AddEditUser mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* NEW — Infrastructure Mapping */}
        <Route
          path="plants/config"
          element={
            <ProtectedRoute permission="PLANT_EDIT">
              <PlantConfigurationListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="plants/:id/designer"
          element={
            <ProtectedRoute permission="PLANT_EDIT">
              <PlantDesignerPage />
            </ProtectedRoute>
          }
        />
        {/* Roles */}
        <Route
          path="roles"
          element={
            <ProtectedRoute permission="ROLE_VIEW">
              <RoleListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles/new"
          element={
            <ProtectedRoute permission="ROLE_CREATE">
              <AddEditRole mode="create" />
            </ProtectedRoute>
          }
        />
        <Route
          path="roles/:id/edit"
          element={
            <ProtectedRoute permission="ROLE_EDIT">
              <AddEditRole mode="edit" />
            </ProtectedRoute>
          }
        />

        {/* Alerts */}
        <Route
          path="alerts/rules"
          element={
            <ProtectedRoute permission="ALERT_VIEW">
              <AlertRulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="alerts/history"
          element={
            <ProtectedRoute permission="ALERT_VIEW">
              <AlertHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="alerts/console"
          element={
            <ProtectedRoute permission="ALERT_VIEW">
              <AlertConsolePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="alert/rule/editor"
          element={
            <ProtectedRoute permission="ALERT_MANAGE">
              <AlertRuleEditor />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Route>
    </Routes>
  );
}
