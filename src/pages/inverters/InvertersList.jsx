import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { useEditInverters } from "../../hooks/useEditInverters";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import { usePageLoader } from "../../hooks/usePageLoader";

const actionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  width: "100%",
  padding: "10px 12px",
  fontSize: "14px",
  fontWeight: 500,
  border: "none",
  background: "transparent",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background 0.2s",
};

export const InvertersList = () => {
  const navigate = useNavigate();
  const dt = useRef(null);
  const op = useRef(null);

  const { inverters = [], loading, deleteInverter } = useEditInverters();
  usePageLoader(loading);
  const [selectedInverters, setSelectedInverters] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const filteredInverters = useMemo(() => {
    return inverters?.data?.filter((i) => {
      const matchesSearch =
        i.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        i.serial_number?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        i.plant_name?.toLowerCase().includes(globalFilter.toLowerCase());

      return matchesSearch;
    });
  }, [inverters, globalFilter]);

  const formatNumber = (value, suffix = "") =>
    value !== undefined && value !== null
      ? `${Number(value).toLocaleString()}${suffix}`
      : "-";

  const formatDate = (row, field) =>
    row[field] ? new Date(row[field]).toLocaleDateString() : "-";

  const statusTemplate = (row) => {
    const severityMap = {
      ON: "success",
      OFF: "danger",
      FAULT: "danger",
      MAINTENANCE: "warning",
    };

    return (
      <Tag
        value={row.status}
        severity={severityMap[row.status] || "info"}
        className="text-xs"
      />
    );
  };

  const actionBodyTemplate = (row) => (
    <Button
      icon="pi pi-ellipsis-h"
      className="p-button-rounded p-button-text p-button-sm text-blue-800"
      onClick={(e) => {
        setSelectedRow(row);
        op.current.toggle(e);
      }}
    />
  );

  const header = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex align-items-center gap-2">
        <i className="pi pi-sun text-orange-500"></i>
        <span className="text-lg font-semibold">Inverters</span>
        <Tag
          value={inverters?.data?.length || 0}
          severity="info"
          className="bg-blue-800"
        />
      </div>

      <div className="flex gap-2">
        <span className="p-input-icon-left">
          <i
            className="pi pi-search text-blue-800"
            style={{ right: "10px" }}
          />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search inverters..."
            className="p-inputtext-sm"
          />
        </span>

        <Button
          icon="pi pi-download"
          label="Export"
          className="p-button-text p-button-sm text-blue-800"
          onClick={() => dt.current.exportCSV()}
        />

        <Button
          icon="pi pi-plus"
          label="Add"
          className="p-button-sm bg-blue-800 border-blue-800"
          onClick={() => navigate("/inverters/add")}
        />
      </div>
    </div>
  );

  return (
    <PageLayout title="Inverters" showBack={false}>
      <div className="surface-card border-round-lg shadow-2">

        <DataTable
          ref={dt}
          value={filteredInverters}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          selection={selectedInverters}
          onSelectionChange={(e) => setSelectedInverters(e.value)}
          dataKey="_id"
          header={header}
          scrollable
          scrollHeight="600px"
          resizableColumns
          columnResizeMode="expand"
          showGridlines
          stripedRows
          emptyMessage="No inverters found"
          tableStyle={{ minWidth: "1200px" }}
        >
          <Column selectionMode="multiple" frozen style={{ width: "3rem" }} />

          <Column
            field="name"
            header="Name"
            sortable
            frozen
            style={{ minWidth: "200px" }}
          />

          <Column
            field="plant.name"
            header="Plant"
            sortable
            style={{ minWidth: "180px" }}
          />

          <Column
            field="capacity_kw"
            header="Capacity (kW)"
            body={(row) => formatNumber(row.capacity_kw)}
            sortable
          />

          <Column
            field="serial_number"
            header="Serial Number"
            sortable
          />

          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          />

          <Column
            field="created_at"
            header="Created At"
            body={(row) => formatDate(row, "created_at")}
          />

          <Column
            body={actionBodyTemplate}
            frozen
            alignFrozen="right"
            style={{ width: "80px", textAlign: "center" }}
          />
        </DataTable>

        {/* ACTION PANEL */}

        <OverlayPanel
          ref={op}
          dismissable
          style={{
            width: "240px",
            padding: "8px",
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          {selectedRow ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>

              <button
                onClick={() => navigate(`/inverters/${selectedRow._id}`)}
                style={actionStyle}
              >
                <i className="pi pi-eye" />
                <span>View Inverter</span>
              </button>

              <button
                onClick={() =>
                  navigate(`/inverters/${selectedRow._id}/edit`)
                }
                style={actionStyle}
              >
                <i className="pi pi-pencil" />
                <span>Edit Configuration</span>
              </button>

              <button
                onClick={() =>
                  navigate(`/inverters/${selectedRow._id}/logs`)
                }
                style={actionStyle}
              >
                <i className="pi pi-file" />
                <span>Inverter Logs</span>
              </button>

              <button
                onClick={() =>
                  navigate(`/inverters/${selectedRow._id}/ai`)
                }
                style={actionStyle}
              >
                <i className="pi pi-robot" />
                <span>AI Insights</span>
              </button>

              <div
                style={{
                  height: "1px",
                  background: "#e5e7eb",
                  margin: "6px 0",
                }}
              />

              <button
                onClick={() =>
                  confirmDialog({
                    message: `Delete "${selectedRow.name}"?`,
                    header: "Confirm Delete",
                    acceptClassName: "p-button-danger",
                    accept: () => deleteInverter(selectedRow._id),
                    rejectLabel: "Cancel",
                  })
                }
                style={{
                  ...actionStyle,
                  color: "#dc2626",
                }}
              >
                <i className="pi pi-trash" />
                <span>Delete Inverter</span>
              </button>
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "10px",
                color: "#6b7280",
              }}
            >
              No inverter selected
            </div>
          )}
        </OverlayPanel>

      </div>
    </PageLayout>
  );
};