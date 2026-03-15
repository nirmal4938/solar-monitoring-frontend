// PlantConfigurationListPage.jsx
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PageLayout from "../../layouts/PageLayout";
import { useEditPlant } from "../../hooks/useEditPlant";
import PlantFilters from "./PlantFilter";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

export const PlantConfigurationListPage = () => {
  const navigate = useNavigate();
  const { plants = [], loading } = useEditPlant();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);

  const safePlants = Array.isArray(plants) ? plants : [];

  // Filtered & searched plants
  const filteredPlants = useMemo(() => {
    return safePlants.filter((p) => {
      const matchesSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter ? p.plant_type === typeFilter : true;

      return matchesSearch && matchesType;
    });
  }, [safePlants, search, typeFilter]);

  // Status: compare solar vs inverter total
  const renderStatus = (plant) => {
    const totalInverter = plant.inverters?.reduce((sum, i) => sum + i.capacity_kw, 0) || 0;
    const balanced = plant.capacity_kw === totalInverter;
    return (
      <Tag
        value={balanced ? "Balanced" : "Capacity Mismatch"}
        severity={balanced ? "success" : "danger"}
        className="p-mr-2 p-mb-2"
      />
    );
  };

  // Config summary: # inverters, batteries, sensors, meters
  const renderConfigurationSummary = (plant) => {
    const invCount = plant.inverters?.length || 0;
    const batCount = plant.batteries?.length || 0;
    const sensorCount = plant.weather_sensors?.length || 0;
    const meterCount = plant.grid_meters?.length || 0;

    return (
      <div className="text-sm text-700">
        {invCount} Inverters • {batCount} Batteries • {sensorCount} Sensors • {meterCount} Meters
      </div>
    );
  };

  // Action button to navigate to designer page
  const renderActions = (rowData) => (
    <Button
      label="Update Configuration"
      icon="pi pi-pencil"
      className="p-button-sm p-button-rounded p-button-warning"
      onClick={() => navigate(`/plants/${rowData.id}/designer`)}
      style={{ minWidth: "180px" }}
    />
  );

  return (
    <PageLayout title="Plant Configurations" showBack={false}>
      {/* Filters */}
      <PlantFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Table */}
      <DataTable
        value={filteredPlants}
        loading={loading}
        responsiveLayout="scroll"
        stripedRows
        className="p-mt-4 shadow-2 border-round-lg"
      >
        <Column field="name" header="Plant Name" sortable style={{ minWidth: "180px" }} />
        <Column field="location" header="Location" sortable style={{ minWidth: "150px" }} />
        <Column field="plant_type" header="Plant Type" sortable style={{ minWidth: "120px" }} />
        <Column header="Configuration" body={renderConfigurationSummary} style={{ minWidth: "300px" }} />
        <Column header="Status" body={renderStatus} style={{ minWidth: "150px" }} />
        <Column header="Action" body={renderActions} style={{ minWidth: "200px" }} />
      </DataTable>
    </PageLayout>
  );
};