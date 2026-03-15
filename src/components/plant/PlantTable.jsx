import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { confirmDialog } from "primereact/confirmdialog";

export const PlantTable = ({ plants = [], loading, deletePlant }) => {

  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const dt = useRef(null);
  const op = useRef(null);

  const [selectedPlants, setSelectedPlants] = useState([]);
  const [selectedPlantRow, setSelectedPlantRow] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const formatNumber = (value, suffix = "") =>
    value !== undefined && value !== null
      ? `${Number(value).toLocaleString()}${suffix}`
      : "-";

  const formatDate = (row, field) =>
    row[field] ? new Date(row[field]).toLocaleDateString() : "-";

  const typeTemplate = (row) => {

    const severityMap = {
      RESIDENTIAL: "success",
      INDUSTRIAL: "warning",
      UTILITY: "info"
    };

    return (
      <Tag
        value={row.plant_type}
        severity={severityMap[row.plant_type] || "info"}
        className="text-xs"
      />
    );
  };

  const statusTemplate = (row) => (
    <Tag
      value={row.status || "INACTIVE"}
      severity={row.status === "ACTIVE" ? "success" : "danger"}
      className="text-xs"
    />
  );

  const nameTemplate = (row) => (
    <div className="flex flex-column">
      <span className="font-semibold">{row.name}</span>
      <small className="text-500">{row.location}</small>
    </div>
  );

  const metricTemplate = (value, suffix = "") => (
    <span className="text-sm font-medium">
      {formatNumber(value, suffix)}
    </span>
  );

  const actionBodyTemplate = (row) => (
    <Button
      icon="pi pi-ellipsis-h"
      className="p-button-rounded p-button-text p-button-sm text-blue-800"
      onClick={(e) => {
        setSelectedPlantRow(row);
        op.current.toggle(e);
      }}
    />
  );

  const header = (
    <div className="flex justify-content-between align-items-center">

      <div className="flex align-items-center gap-2">
        <i className="pi pi-sun text-orange-500"></i>
        <span className="text-lg font-semibold">Solar Plants</span>
        <Tag value={plants.length} severity="" className="bg-blue-800"/>
      </div>

      <div className="flex gap-2">

        <span className="p-input-icon-left">
          <i className="pi pi-search text-blue-800" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search plants..."
            className="p-inputtext-sm"
          />
        </span>

        <Button
          icon="pi pi-download"
          label="Export"
          className="p-button-text p-button-sm text-blue-800"
          onClick={() => dt.current.exportCSV()}
        />

        {hasPermission("PLANT_CREATE") && (
          <Button
            icon="pi pi-plus"
            label="Add"
            className="p-button-sm bg-blue-800 border-blue-800"
            onClick={() => navigate("/plants/new")}
          />
        )}

      </div>

    </div>
  );

  return (

    <div className="surface-card border-round-lg shadow-2">

      <DataTable
        ref={dt}
        value={plants}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 50]}
        loading={loading}

        selection={selectedPlants}
        onSelectionChange={(e) => setSelectedPlants(e.value)}

        dataKey="id"
        header={header}

        globalFilter={globalFilter}

        scrollable
        scrollHeight="600px"

        resizableColumns
        columnResizeMode="expand"

        showGridlines
        stripedRows

        emptyMessage="No plants found"

        tableStyle={{ minWidth: "1600px" }}
      >

        {/* frozen columns */}

        <Column
          selectionMode="multiple"
          frozen
          style={{ width: "3rem" }}
        />

        <Column
          field="name"
          header="Plant"
          body={nameTemplate}
          sortable
          frozen
          style={{ minWidth: "220px" }}
        />

        {/* main columns */}

        <Column
          field="plant_type"
          header="Type"
          body={typeTemplate}
          sortable
          filter
          style={{ width: "140px" }}
        />

        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
          filter
          style={{ width: "120px" }}
        />

        <Column
          field="capacity_kw"
          header="Capacity kW"
          body={(row)=>metricTemplate(row.capacity_kw)}
          sortable
          filter
        />

        <Column
          field="commissioning_date"
          header="Commissioned"
          body={(row)=>formatDate(row,"commissioning_date")}
          sortable
        />

        <Column
          field="inverter_count"
          header="Inv"
          body={(row)=>metricTemplate(row.inverter_count)}
          sortable
        />

        <Column
          field="battery_count"
          header="Bat"
          body={(row)=>metricTemplate(row.battery_count)}
        />

        <Column
          field="latest_generation_kwh"
          header="Generation"
          body={(row)=>metricTemplate(row.latest_generation_kwh)}
        />

        <Column
          field="performance_ratio"
          header="PR %"
          body={(row)=>metricTemplate(row.performance_ratio,"%")}
        />

        <Column
          field="avoided_emissions_kg"
          header="CO₂"
          body={(row)=>metricTemplate(row.avoided_emissions_kg)}
        />

        <Column
          field="trees_equivalent"
          header="Trees"
          body={(row)=>metricTemplate(row.trees_equivalent)}
        />

        <Column
          field="energy_efficiency_score"
          header="AI Score"
          body={(row)=>metricTemplate(row.energy_efficiency_score)}
        />

        <Column
          field="active_alerts_count"
          header="Alerts"
          body={(row)=>(
            <Tag
              value={row.active_alerts_count || 0}
              severity={row.active_alerts_count > 0 ? "danger" : "success"}
            />
          )}
        />

        <Column
          body={actionBodyTemplate}
          frozen
          alignFrozen="right"
          style={{ width: "80px", textAlign: "center" }}
        />

      </DataTable>

      <OverlayPanel ref={op} dismissable style={{ width: "220px" }}>

        {selectedPlantRow && (
          <div className="flex flex-column gap-2">

            <Button
              icon="pi pi-eye"
              label="View"
              className="p-button-text"
              onClick={() => navigate(`/plants/${selectedPlantRow.id}`)}
            />

            <Button
              icon="pi pi-pencil"
              label="Edit"
              className="p-button-text"
              onClick={() => navigate(`/plants/${selectedPlantRow.id}/edit`)}
            />

            <Button
              icon="pi pi-bolt"
              label="Inverters"
              className="p-button-text"
              onClick={() =>
                navigate(`/infra/inverters?plant=${selectedPlantRow.id}`)
              }
            />

            <Button
              icon="pi pi-database"
              label="Batteries"
              className="p-button-text"
              onClick={() =>
                navigate(`/infra/batteries?plant=${selectedPlantRow.id}`)
              }
            />

            <Button
              icon="pi pi-trash"
              label="Delete"
              className="p-button-text p-button-danger"
              onClick={() =>
                confirmDialog({
                  message: `Delete "${selectedPlantRow.name}"?`,
                  header: "Confirm",
                  acceptClassName: "p-button-danger",
                  accept: () => deletePlant(selectedPlantRow.id)
                })
              }
            />

          </div>
        )}

      </OverlayPanel>

    </div>
  );
};