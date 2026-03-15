import { useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import PageLayout from "../../layouts/PageLayout";
import { useEditUser } from "../../hooks/useEditUser";

export const UserListPage = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const toast = useRef(null);
  const dt = useRef(null);

  const { users = [], loading, deleteUser } = useEditUser();
// console.log("users", users);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const safeUsers = Array.isArray(users) ? users : [];

  // ----------------------------------
  // KPIs
  // ----------------------------------
  const activeCount = useMemo(
    () => safeUsers.filter((u) => u.is_active === true).length,
    [safeUsers]
  );

  const filteredUsers = useMemo(() => {
    return safeUsers.filter((u) => {
      const fullName = `${u.first_name || ""} ${u.last_name || ""}`.toLowerCase();
      return (
        fullName.includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [safeUsers, search]);

  // ----------------------------------
  // Templates
  // ----------------------------------

  const nameTemplate = (row) => (
    <span style={{ fontWeight: 500 }}>
       {row.name}
       {/* {row.first_name} {row.last_name} || */}
    </span>
  );

  const statusTemplate = (row) => (
    <Tag
      value={row.is_active ? "ACTIVE" : "INACTIVE"}
      severity={row.is_active === true ? "success" : "danger"}
    />
  );

  const roleTemplate = (row) => {
    if (!row.roles || !row.roles.length) return "-";
    return (
      <div className="flex flex-wrap gap-1">
        {row.roles.map((role, idx) => (
          <Tag
            key={idx}
            value={role}
            severity="info"
            style={{ fontSize: "0.7rem" }}
          />
        ))}
      </div>
    );
  };

  const formatDate = (row) =>
    row.created_at
      ? new Date(row.created_at).toLocaleDateString()
      : "-";

  const actionBodyTemplate = (rowData) => {
    const handleDelete = () => {
      confirmDialog({
        message: `Are you sure you want to delete "${rowData.email}"?`,
        header: "Confirm Deletion",
        icon: "pi pi-exclamation-triangle",
        acceptClassName: "p-button-danger",
        accept: async () => {
          try {
            await deleteUser(rowData.id);
            toast.current.show({
              severity: "success",
              summary: "Deleted",
              detail: "User removed successfully",
            });
          } catch (err) {
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Failed to delete user",
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
        {hasPermission("USER_VIEW") && (
          <Button
            icon="pi pi-eye"
            tooltip="View"
            className="p-button-rounded"
            style={{ ...buttonStyle, backgroundColor: "#3b82f6", color: "#fff" }}
            onClick={() => navigate(`/users/${rowData.id}`)}
          />
        )}

        {hasPermission("USER_EDIT") && (
          <Button
            icon="pi pi-pencil"
            tooltip="Edit"
            className="p-button-rounded"
            style={{ ...buttonStyle, backgroundColor: "#f59e0b", color: "#fff" }}
            onClick={() => navigate(`/users/${rowData._id}/edit`)}
          />
        )}

        {hasPermission("USER_DELETE") && (
          <Button
            icon="pi pi-trash"
            tooltip="Delete"
            className="p-button-rounded"
            style={{ ...buttonStyle, backgroundColor: "#ef4444", color: "#fff" }}
            onClick={handleDelete}
          />
        )}
      </div>
    );
  };

  // ----------------------------------
  // UI
  // ----------------------------------
  console.log("loading", loading, filteredUsers)
  return (
    <PageLayout title="User Management" showBack={false}>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* KPI + Header */}
      <div className="flex justify-content-between align-items-center mb-4">
        <div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          {activeCount} Active Users | {safeUsers.length} Total Users
        </div>

        <div className="flex gap-2">
          <Button
            label="Export"
            icon="pi pi-download"
            className="p-button-outlined p-button-sm"
            onClick={() => dt.current?.exportCSV?.()}
          />

          {hasPermission("USER_CREATE") && (
            <Button
              label="Add User"
              icon="pi pi-plus"
              className="p-button-sm"
              style={{ background: "#1f3a8a", border: "none" }}
              onClick={() => navigate("/users/new")}
            />
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-3 align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-inputtext-sm"
          />
        </span>

        {search && (
          <Button
            label="Clear"
            className="p-button-text p-button-sm"
            onClick={() => setSearch("")}
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
          value={filteredUsers}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          responsiveLayout="scroll"
          loading={loading}
          selection={selectedUsers}
          onSelectionChange={(e) => setSelectedUsers(e.value)}
          dataKey="_id"
          className="p-datatable-sm"
          emptyMessage="No users found."
          scrollable
          scrollHeight="600px"
          resizableColumns
          columnResizeMode="fit"
          showGridlines
          tableStyle={{ minWidth: "1000px", tableLayout: "fixed" }}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }} />

          <Column
            field="name"
            header="Name"
            body={nameTemplate}
            sortable
            style={{ width: "200px" }}
          />

          <Column
            field="email"
            header="Email"
            sortable
            style={{ width: "250px" }}
          />

          <Column
            header="Roles"
              field="roles"
            body={roleTemplate}
            style={{ width: "250px" }}
          />

          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
            style={{ width: "150px", textAlign: "center" }}
          />

          <Column
            header="Created On"
            body={formatDate}
            sortable
            style={{ width: "180px" }}
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