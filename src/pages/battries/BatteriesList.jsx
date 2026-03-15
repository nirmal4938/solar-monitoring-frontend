import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import { useEditBatteries } from "../../hooks/useEditBattries";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";
import "./Battries.css";
import BatteryFilters from "./BatteryFilters";
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

export const BatteriesList = () => {
  const navigate = useNavigate();
  const dt = useRef(null);
  const op = useRef(null);

  const { batteries = [], loading, deleteBattery } = useEditBatteries();
  usePageLoader(loading);
  const [selectedBatteries, setSelectedBatteries] = useState([]);
  const [selectedBatteryRow, setSelectedBatteryRow] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [plantFilter, setPlantFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);

  //   const safeBatteries = Array.isArray(batteries) ? batteries : [];

  const filteredBatteries = useMemo(() => {
    return batteries?.data?.filter((b) => {
      const matchesSearch =
        b.name?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        b.plant?.name?.toLowerCase().includes(globalFilter.toLowerCase());

      const matchesPlant = plantFilter ? b.plant?.id === plantFilter : true;
      const matchesStatus = statusFilter ? b.status === statusFilter : true;

      return matchesSearch && matchesPlant && matchesStatus;
    });
  }, [globalFilter, plantFilter, statusFilter]);

  const formatNumber = (value, suffix = "") =>
    value !== undefined && value !== null
      ? `${Number(value).toLocaleString()}${suffix}`
      : "-";

  const formatDate = (row, field) =>
    row[field] ? new Date(row[field]).toLocaleDateString() : "-";

  const statusTemplate = (row) => {
    const severityMap = {
      CHARGING: "success",
      DISCHARGING: "info",
      IDLE: "warning",
      FAULT: "danger",
      OFFLINE: "danger",
    };
    return (
      <Tag
        value={row.status}
        severity={severityMap[row.status] || "info"}
        className="text-xs"
      />
    );
  };

  //   const plantTemplate = (row) => <span>{row.plant_name || "-"}</span>;

  const actionBodyTemplate = (row) => (
    <Button
      icon="pi pi-ellipsis-h"
      className="p-button-rounded p-button-text p-button-sm text-blue-800"
      onClick={(e) => {
        setSelectedBatteryRow(row);
        op.current.toggle(e);
      }}
    />
  );

  const header = (
    <div className="flex justify-content-between align-items-center">
      <div className="flex align-items-center gap-2">
        <i className="pi pi-bolt text-orange-500"></i>
        <span className="text-lg font-semibold">Batteries</span>
        <Tag
          value={batteries.data?.length}
          severity="info"
          className="bg-blue-800"
        />
      </div>

      <div className="flex gap-2">
        <span className="p-input-icon-left">
          <i className="pi pi-search text-blue-800" style={{ right: "10px" }} />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search batteries..."
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
          onClick={() => navigate("/batteries/add")}
        />
      </div>
    </div>
  );
  return (
    <PageLayout title="Batteries" showBack={false}>
      <BatteryFilters
        plantFilter={plantFilter}
        setPlantFilter={setPlantFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <div className="surface-card border-round-lg shadow-2">
        <DataTable
          ref={dt}
          value={batteries?.data}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          loading={loading}
          selection={selectedBatteries}
          onSelectionChange={(e) => setSelectedBatteries(e.value)}
          dataKey="id"
          header={header}
          scrollable
          scrollHeight="600px"
          resizableColumns
          columnResizeMode="expand"
          showGridlines
          stripedRows
          emptyMessage="No batteries found"
          tableStyle={{ minWidth: "1600px" }}
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
            field="plant_name"
            header="Plant"
            sortable
            style={{ minWidth: "180px" }}
          />
          <Column
            field="capacity_kwh"
            header="Capacity (kWh)"
            body={(row) => formatNumber(row.capacity_kwh)}
            sortable
          />
          <Column
            field="usable_capacity_kwh"
            header="Usable (kWh)"
            body={(row) => formatNumber(row.usable_capacity_kwh)}
          />
          <Column
            field="max_charge_kw"
            header="Max Charge (kW)"
            body={(row) => formatNumber(row.max_charge_kw)}
          />
          <Column
            field="max_discharge_kw"
            header="Max Discharge (kW)"
            body={(row) => formatNumber(row.max_discharge_kw)}
          />
          <Column
            field="soc_percent"
            header="SOC (%)"
            body={(row) => formatNumber(row.soc_percent, "%")}
          />
          <Column
            field="health_pct"
            header="Health (%)"
            body={(row) => formatNumber(row.health_pct, "%")}
          />
          <Column
            field="round_trip_efficiency_pct"
            header="Round Trip Eff. (%)"
            body={(row) => formatNumber(row.round_trip_efficiency_pct, "%")}
          />
          <Column
            field="depth_of_discharge_pct"
            header="DoD (%)"
            body={(row) => formatNumber(row.depth_of_discharge_pct, "%")}
          />
          <Column
            field="status"
            header="Status"
            body={statusTemplate}
            sortable
          />
          <Column
            field="commissioning_date"
            header="Commissioned"
            body={(row) => formatDate(row, "commissioning_date")}
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
          {selectedBatteryRow ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              {/* View */}
              <button
                onClick={() => navigate(`/batteries/${selectedBatteryRow._id}`)}
                style={actionStyle}
              >
                <i className="pi pi-eye" />
                <span>View Battery</span>
              </button>

              {/* Edit */}
              <button
                onClick={() =>
                  navigate(`/batteries/${selectedBatteryRow._id}/edit`)
                }
                style={actionStyle}
              >
                <i className="pi pi-pencil" />
                <span>Edit Configuration</span>
              </button>

              {/* Logs */}
              <button
                onClick={() =>
                  navigate(`/batteries/${selectedBatteryRow._id}/logs`)
                }
                style={actionStyle}
              >
                <i className="pi pi-file" />
                <span>Battery Logs</span>
              </button>

              {/* AI */}
              <button
                onClick={() =>
                  navigate(`/batteries/${selectedBatteryRow._id}/ai`)
                }
                style={actionStyle}
              >
                <i className="pi pi-robot" />
                <span>AI Insights</span>
              </button>

              {/* Maintenance */}
              <button
                onClick={() =>
                  navigate(`/batteries/${selectedBatteryRow._id}/maintenance`)
                }
                style={actionStyle}
              >
                <i className="pi pi-wrench" />
                <span>Maintenance</span>
              </button>

              {/* Divider */}
              <div
                style={{
                  height: "1px",
                  background: "#e5e7eb",
                  margin: "6px 0",
                }}
              />

              {/* Delete */}
              <button
                onClick={() =>
                  confirmDialog({
                    message: `Delete "${selectedBatteryRow.name}"?`,
                    header: "Confirm Delete",
                    acceptClassName: "p-button-danger",
                    accept: () => deleteBattery(selectedBatteryRow._id),
                    rejectLabel: "Cancel",
                  })
                }
                style={{
                  ...actionStyle,
                  color: "#dc2626",
                }}
              >
                <i className="pi pi-trash" />
                <span>Delete Battery</span>
              </button>
            </div>
          ) : (
            <div
              style={{ textAlign: "center", padding: "10px", color: "#6b7280" }}
            >
              No battery selected
            </div>
          )}
        </OverlayPanel>
      </div>
    </PageLayout>
  );
};
