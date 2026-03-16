import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import PageLayout from "../../layouts/PageLayout";
import { useEditRole } from "../../hooks/useEditRole";

export const RoleListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const toast = useRef(null);
  const dt = useRef(null);

  const { roles = [], loading, deleteRole } = useEditRole();

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);

  const safeRoles = Array.isArray(roles) ? roles : [];

  // -----------------------------
  // KPI
  // -----------------------------
  const totalRoles = safeRoles.length;

  const systemRoles = useMemo(
    () => safeRoles.filter((r) => r.is_system).length,
    [safeRoles],
  );

  const customRoles = totalRoles - systemRoles;

  // -----------------------------
  // Filtering
  // -----------------------------
  const filteredRoles = useMemo(() => {
    return safeRoles.filter((r) => {
      const matchesSearch =
        r.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.description?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === null
          ? true
          : typeFilter === "SYSTEM"
            ? r.is_system
            : !r.is_system;

      return matchesSearch && matchesType;
    });
  }, [safeRoles, search, typeFilter]);

  // -----------------------------
  // Templates
  // -----------------------------
  const typeTemplate = (row) => (
    <Tag
      value={row.is_system ? "SYSTEM" : "CUSTOM"}
      severity={row.is_system ? "danger" : "info"}
      style={{ fontSize: "0.75rem" }}
    />
  );

  const formatNumber = (value) =>
    value !== undefined && value !== null
      ? Number(value).toLocaleString()
      : "-";

  const actionBodyTemplate = (row) => {
    const handleDelete = () => {
      confirmDialog({
        message: `Are you sure you want to delete "${row.name}"?`,
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: "p-button-danger",
        accept: async () => {
          try {
            await deleteRole(row._id);
            toast.current.show({
              severity: "success",
              summary: "Deleted",
              detail: "Role removed successfully",
            });
          } catch (err) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete role",
            });
          }
        },
      });
    };

    const buttonStyle = {
      width: "30px",
      height: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <div className="flex align-items-center justify-content-center gap-2">
        {hasPermission("PLANT_EDIT") && (
          <Button
            icon="pi pi-pencil"
            tooltip="Edit Role"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded"
            style={{
              ...buttonStyle,
              backgroundColor: "#f59e0b",
              color: "#ffffff",
            }}
            onClick={() => navigate(`/roles/${row._id}/edit`)}
          />
        )}

        {hasPermission("PLANT_DELETE") && !row.is_system && (
          <Button
            icon="pi pi-trash"
            tooltip="Delete Role"
            tooltipOptions={{ position: "top" }}
            className="p-button-rounded"
            style={{
              ...buttonStyle,
              backgroundColor: "#ef4444",
              color: "#ffffff",
            }}
            onClick={handleDelete}
          />
        )}
      </div>
    );
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <PageLayout title="Role Management" showBack={false}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* KPI */}
      <div className="flex justify-content-between align-items-center mb-4">
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          {totalRoles} Total | {systemRoles} System | {customRoles} Custom
        </div>

        <div className="flex gap-2">
          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-outlined p-button-sm p-button-rounded"
            onClick={() => dt.current?.exportCSV?.()}
          />

          {hasPermission("PLANT_CREATE") && (
            <Button
              label="Add Role"
              icon="pi pi-plus"
              className="p-button-sm p-button-rounded"
              style={{ background: "#1f3a8a", border: "none" }}
              onClick={() => navigate("/roles/new")}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-3 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-inputtext-sm"
          />
        </span>

        <Dropdown
          value={typeFilter}
          options={[
            { label: "System Roles", value: "SYSTEM" },
            { label: "Custom Roles", value: "CUSTOM" },
          ]}
          placeholder="Filter by Type"
          onChange={(e) => setTypeFilter(e.value)}
          className="p-inputtext-sm"
          showClear
        />

        {(search || typeFilter) && (
          <Button
            label="Clear"
            className="p-button-text p-button-sm"
            onClick={() => {
              setSearch("");
              setTypeFilter(null);
            }}
          />
        )}
      </div>

      {/* Table */}
      <div
        style={{
          background: "#ffffff",
          border: "1px solid #e6e9ef",
          borderRadius: "6px",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.04)",
        }}
      >
        <DataTable
          ref={dt}
          value={filteredRoles}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          responsiveLayout="scroll"
          loading={loading}
          selection={selectedRoles}
          onSelectionChange={(e) => setSelectedRoles(e.value)}
          dataKey="_id"
          className="p-datatable-sm"
          emptyMessage="No roles found."
          scrollable
          scrollHeight="500px"
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          tableStyle={{ minWidth: "900px", tableLayout: "fixed" }}
        >
          <Column
            selectionMode="multiple"
            style={{ width: "3rem", whiteSpace: "nowrap" }}
          />

          <Column
            field="name"
            header="Role Name"
            sortable
            style={{ width: "200px", whiteSpace: "nowrap" }}
          />

          <Column
            field="description"
            header="Description"
            style={{ width: "250px", whiteSpace: "nowrap" }}
          />

          <Column
            header="Type"
            body={typeTemplate}
            style={{ width: "150px", textAlign: "center" }}
          />

          <Column
            field="userCount"
            header="Users"
            body={(row) => formatNumber(row.userCount)}
            sortable
            style={{ width: "120px", textAlign: "right" }}
          />

          <Column
            field="permissionCount"
            header="Permissions"
            body={(row) => formatNumber(row.permissionCount)}
            sortable
            style={{ width: "140px", textAlign: "right" }}
          />

          <Column
            body={actionBodyTemplate}
            header="Actions"
            style={{ width: "120px", textAlign: "center" }}
          />
        </DataTable>
      </div>
    </PageLayout>
  );
};
