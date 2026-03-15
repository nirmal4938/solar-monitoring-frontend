// import { useMemo, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { Dropdown } from "primereact/dropdown";
// import { Tag } from "primereact/tag";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";
// import PageLayout from "../../layouts/PageLayout";
// import { useEditPlant } from "../../hooks/useEditPlant";
// import { Dialog } from "primereact/dialog";
// import { OverlayPanel } from "primereact/overlaypanel";
// import { Divider } from "primereact/divider";
// import PlantFilters from "./PlantFilter";
// export const PlantListPage = () => {
//   const navigate = useNavigate();
//   const { hasPermission } = useAuth();
//   const toast = useRef(null);
//   const dt = useRef(null);

// const op = useRef(null);
// const [selectedPlantRow, setSelectedPlantRow] = useState(null);
//   const { plants = [], loading, deletePlant } = useEditPlant();
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [search, setSearch] = useState("");
//   const [typeFilter, setTypeFilter] = useState(null);

//   const safePlants = Array.isArray(plants) ? plants : [];

//   const totalCapacity = useMemo(
//     () =>
//       safePlants.reduce((sum, p) => sum + Number(p.capacity_kw || 0), 0),
//     [safePlants]
//   );

//   const activeCount = useMemo(
//     () => safePlants.filter((p) => p.status === "ACTIVE").length,
//     [safePlants]
//   );

//   const filteredPlants = useMemo(() => {
//     return safePlants.filter((p) => {
//       const matchesSearch =
//         p.name?.toLowerCase().includes(search.toLowerCase()) ||
//         p.location?.toLowerCase().includes(search.toLowerCase());
//       const matchesType = typeFilter ? p.plant_type === typeFilter : true;
//       return matchesSearch && matchesType;
//     });
//   }, [safePlants, search, typeFilter]);

//   // -----------------------------
//   // Templates
//   // -----------------------------
//   const formatCapacity = (row) => (
//     <span style={{ fontWeight: 500 }}>{Number(row.capacity_kw || 0).toLocaleString()} kW</span>
//   );

//   const formatDate = (row, field) => (row[field] ? new Date(row[field]).toLocaleDateString() : "-");

//   const typeTemplate = (row) => {
//     const severityMap = {
//       RESIDENTIAL: "success",
//       INDUSTRIAL: "warning",
//       UTILITY: "info",
//     };
//     return <Tag value={row.plant_type} severity={severityMap[row.plant_type] || "info"} style={{ fontSize: "0.75rem" }} />;
//   };

//   const statusTemplate = (row) => (
//     <Tag value={row.status || "INACTIVE"} severity={row.status === "ACTIVE" ? "success" : "danger"} />
//   );

//   const formatNumber = (value, suffix = "") =>
//     value !== undefined && value !== null ? `${Number(value).toLocaleString()}${suffix}` : "-";

// const actionBodyTemplate = (rowData) => {
//   return (
//     <div className="flex justify-content-center">
//       <Button
//         icon="pi pi-ellipsis-v"
//         className="p-button-text p-button-rounded p-button-sm"
//         onClick={(e) => {
//           setSelectedPlantRow(rowData);
//           op.current.toggle(e);
//         }}
//       />
//     </div>
//   );
// };



//   // -----------------------------
//   // UI
//   // -----------------------------
//   return (
//     <PageLayout title="" showBack={false}>
//       <Toast ref={toast} />
// <OverlayPanel
//   ref={op}
//   dismissable
//   showCloseIcon={false}
//   style={{
//     width: "196px",
//     padding: 0,
//     borderRadius: 0,
//     boxShadow: "none",
//     border: "1px solid #c5cbd3",
//     background: "#ffffff"
//   }}
//   pt={{
//     content: { style: { padding: 0 } }
//   }}
// >
//   {selectedPlantRow && (
//     <div className="bb-menu">

//       {hasPermission("PLANT_VIEW") && (
//         <Button
//           icon="pi pi-eye"
//           label="View"
//           className="bb-item"
//           onClick={() => {
//             op.current.hide();
//             navigate(`/plants/${selectedPlantRow.id}`);
//           }}
//         />
//       )}

//       {hasPermission("PLANT_VIEW") && (
//         <Button
//           icon="pi pi-pencil"
//           label="Edit"
//           className="bb-item"
//           onClick={() => {
//             op.current.hide();
//             navigate(`/plants/${selectedPlantRow.id}/edit`);
//           }}
//         />
//       )}

//       {hasPermission("PLANT_VIEW") && <div className="bb-separator" />}

//       {hasPermission("PLANT_VIEW") && (
//         <>
//           <Button
//             icon="pi pi-bolt"
//             label="Inverters"
//             className="bb-item"
//             onClick={() => {
//               op.current.hide();
//               navigate(`/infra/inverters?plant=${selectedPlantRow.id}`);
//             }}
//           />

//           <Button
//             icon="pi pi-database"
//             label="Batteries"
//             className="bb-item"
//             onClick={() => {
//               op.current.hide();
//               navigate(`/infra/batteries?plant=${selectedPlantRow.id}`);
//             }}
//           />
//         </>
//       )}

//       {hasPermission("PLANT_VIEW") && (
//         <>
//           <div className="bb-separator-strong" />

//           <Button
//             icon="pi pi-trash"
//             label="Delete"
//             className="bb-item bb-danger"
//             onClick={() => {
//               op.current.hide();
//               confirmDialog({
//                 message: `Delete "${selectedPlantRow.name}"?`,
//                 header: "Confirm",
//                 acceptClassName: "p-button-danger",
//                 accept: async () => {
//                   await deletePlant(selectedPlantRow.id);
//                 }
//               });
//             }}
//           />
//         </>
//       )}

//     </div>
//   )}

//   <style>{`
//     .bb-menu {
//       display: flex;
//       flex-direction: column;
//       background: #ffffff;
//       font-family: "Inter", -apple-system, BlinkMacSystemFont, 
//                    "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
//       -webkit-font-smoothing: antialiased;
//       -moz-osx-font-smoothing: grayscale;
//     }

//     .bb-item {
//       width: 100%;
//       height: 32px;
//       padding: 0 14px !important;
//       justify-content: flex-start;
//       border-radius: 0 !important;
//       box-shadow: none !important;
//       background: #ffffff !important;
//       border-left: 2px solid transparent;

//       /* FORCE TEXT VISIBILITY */
//       color: #1f2937 !important;
//       font-size: 13px !important;
//       font-weight: 500 !important;
//       letter-spacing: 0.2px;
//     }

//     .bb-item .p-button-label {
//       color: #1f2937 !important;
//     }

//     .bb-item .p-button-icon {
//       font-size: 13px;
//       margin-right: 10px;
//       color: #4b5563 !important;
//     }

//     .bb-item:hover {
//       background: #f8fafc !important;
//       border-left: 2px solid #2563eb;
//     }

//     .bb-danger {
//       color: #b91c1c !important;
//     }

//     .bb-danger .p-button-label {
//       color: #b91c1c !important;
//     }

//     .bb-danger .p-button-icon {
//       color: #b91c1c !important;
//     }

//     .bb-separator {
//       height: 1px;
//       background: #e5e7eb;
//       margin: 4px 0;
//     }

//     .bb-separator-strong {
//       height: 1px;
//       background: #cbd5e1;
//       margin: 4px 0;
//     }
//   `}</style>
// </OverlayPanel>
// {/* KPI + Actions */}
// <div className="flex justify-content-between align-items-center mb-2">
//   <div style={{ color: "#6b7280", fontSize: "12px" }}>
//     {activeCount} Active | {totalCapacity.toLocaleString()} kW
//   </div>

//   <div className="flex gap-2">
//     <Button
//       label="Export"
//       icon="pi pi-download"
//       className="p-button-text p-button-sm"
//       style={{ padding: "4px 8px" }}
//       onClick={() => dt.current?.exportCSV?.()}
//     />
//     {hasPermission("PLANT_CREATE") && (
//       <Button
//         label="Add"
//         icon="pi pi-plus"
//         className="p-button-sm"
//         style={{
//           padding: "4px 10px",
//           background: "#1f3a8a",
//           border: "none",
//           fontSize: "12px",
//         }}
//         onClick={() => navigate("/plants/new")}
//       />
//     )}
//   </div>
// </div>

// {/* =========================
//     ENTERPRISE FILTER BAR
// ========================= */}

// <PlantFilters/>

// {/* ================================
//     ENTERPRISE DATA TABLE
// ================================ */}

// <div className="bb-table-wrapper">
//   <DataTable
//     ref={dt}
//     value={filteredPlants}
//     paginator
//     rows={10}
//     rowsPerPageOptions={[10, 20, 50]}
//     loading={loading}
//     selection={selectedPlants}
//     onSelectionChange={(e) => setSelectedPlants(e.value)}
//     dataKey="id"
//     emptyMessage="No plants found."
//     scrollable
//     scrollHeight="flex"
//     resizableColumns
//     columnResizeMode="fit"
//     showGridlines={false}
//     className="bb-datatable"
//     tableStyle={{ minWidth: "1600px", tableLayout: "fixed" }}
//   >
//     <Column selectionMode="multiple" style={{ width: "40px" }} />

//     <Column field="name" header="Plant Name" sortable style={{ width: "240px" }} />
//     <Column field="location" header="Location" sortable style={{ width: "170px" }} />
//     <Column field="plant_type" header="Type" body={typeTemplate} style={{ width: "150px", textAlign: "center" }} />
//     <Column field="status" header="Status" body={statusTemplate} style={{ width: "130px", textAlign: "center" }} />
//     <Column field="capacity_kw" header="Capacity (kW)" body={formatCapacity} sortable style={{ width: "150px", textAlign: "right" }} />
//     <Column field="commissioning_date" header="Commissioned" body={(row) => formatDate(row, "commissioning_date")} sortable style={{ width: "150px" }} />

//     <Column field="inverter_count" header="Inv" body={(row) => formatNumber(row.inverter_count)} sortable style={{ width: "90px", textAlign: "right" }} />
//     <Column field="battery_count" header="Bat" body={(row) => formatNumber(row.battery_count)} sortable style={{ width: "90px", textAlign: "right" }} />
//     <Column field="latest_generation_kwh" header="Gen (kWh)" body={(row) => formatNumber(row.latest_generation_kwh)} sortable style={{ width: "130px", textAlign: "right" }} />
//     <Column field="performance_ratio" header="PR %" body={(row) => formatNumber(row.performance_ratio, "%")} sortable style={{ width: "100px", textAlign: "right" }} />
//     <Column field="avoided_emissions_kg" header="CO₂ kg" body={(row) => formatNumber(row.avoided_emissions_kg)} sortable style={{ width: "110px", textAlign: "right" }} />
//     <Column field="trees_equivalent" header="Trees" body={(row) => formatNumber(row.trees_equivalent)} sortable style={{ width: "100px", textAlign: "right" }} />
//     <Column field="energy_efficiency_score" header="AI Score" body={(row) => formatNumber(row.energy_efficiency_score)} sortable style={{ width: "100px", textAlign: "right" }} />
//     <Column field="active_alerts_count" header="Alerts" body={(row) => formatNumber(row.active_alerts_count)} sortable style={{ width: "90px", textAlign: "right" }} />

//     <Column body={actionBodyTemplate} header="" style={{ width: "70px", textAlign: "center" }} />
//   </DataTable>
// </div>

// <style>{`

// /* ============================================
//    ENTERPRISE DENSE GRID (Balanced Upgrade)
// ============================================ */

// .bb-table-wrapper {
//   border: 1.5px solid #cbd5e1;
//   background: #ffffff;
// }

// /* Slightly larger base font */
// .bb-datatable {
//   font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//   font-size: 12.5px; /* was 11px */
//   color: #1f2937;
// }

// /* Stable height */
// .bb-datatable .p-datatable-wrapper {
//   min-height: 440px;
// }

// /* =========================
//    Controlled Row Height
// ========================= */

// .bb-datatable .p-datatable-thead > tr,
// .bb-datatable .p-datatable-tbody > tr {
//   height: 32px !important; /* was 28px */
// }

// .bb-datatable .p-datatable-thead > tr > th,
// .bb-datatable .p-datatable-tbody > tr > td {
//   height: 32px !important;
//   padding: 0 10px !important; /* slightly increased */
//   line-height: 32px !important;
//   vertical-align: middle !important;
// }

// /* Header */
// .bb-datatable .p-datatable-thead > tr > th {
//   font-size: 11.5px !important;
//   font-weight: 600 !important;
//   color: #111827 !important;
//   background: #f3f4f6 !important;
//   border-bottom: 2px solid #cbd5e1 !important;
//   border-right: 1px solid #e2e8f0 !important;
// }

// /* Body cells */
// .bb-datatable .p-datatable-tbody > tr > td {
//   border-bottom: 1px solid #e5e7eb !important;
//   border-right: 1px solid #f1f5f9 !important;
// }

// /* Remove last right border */
// .bb-datatable .p-datatable-thead > tr > th:last-child,
// .bb-datatable .p-datatable-tbody > tr > td:last-child {
//   border-right: none !important;
// }

// /* Remove internal spacing noise */
// .bb-datatable .p-column-title,
// .bb-datatable .p-sortable-column-icon,
// .bb-datatable .p-datatable-tbody > tr > td > * {
//   line-height: 32px !important;
// }

// /* Hover (subtle institutional tone) */
// .bb-datatable .p-datatable-tbody > tr:hover {
//   background: #f8fafc !important;
// }

// /* =========================
//    Paginator — Clean Dense
// ========================= */

// .bb-datatable .p-paginator {
//   padding: 0 8px !important;
//   min-height: 34px !important;
//   height: 34px !important;
//   border-top: 1.5px solid #cbd5e1;
//   font-size: 11.5px !important;
// }

// /* Page buttons */
// .bb-datatable .p-paginator .p-paginator-page,
// .bb-datatable .p-paginator .p-paginator-first,
// .bb-datatable .p-paginator .p-paginator-prev,
// .bb-datatable .p-paginator .p-paginator-next,
// .bb-datatable .p-paginator .p-paginator-last {
//   height: 24px !important;
//   min-width: 24px !important;
//   font-size: 11px !important;
//   margin: 0 3px !important;
// }

// /* Rows per page dropdown */
// .bb-datatable .p-paginator .p-dropdown {
//   height: 24px !important;
//   min-height: 24px !important;
// }

// .bb-datatable .p-paginator .p-dropdown .p-dropdown-label {
//   padding: 0 6px !important;
//   line-height: 24px !important;
//   font-size: 11px !important;
// }

// .bb-datatable .p-paginator .p-dropdown .p-dropdown-trigger {
//   width: 20px !important;
// }

// /* Checkbox slightly bigger */
// .bb-datatable .p-checkbox {
//   width: 16px;
//   height: 16px;
// }

// `}</style>
//     </PageLayout>
//   );
// };



import { useState, useMemo } from "react";
import PageLayout from "../../layouts/PageLayout";
import { useEditPlant } from "../../hooks/useEditPlant";
import PlantFilters from "./PlantFilter";
import { PlantTable } from "../../components/plant/PlantTable";
import { usePageLoader } from "../../hooks/usePageLoader";

export const PlantListPage = () => {

  const { plants = [], loading, deletePlant } = useEditPlant();
  usePageLoader(loading);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState(null);

  const safePlants = Array.isArray(plants) ? plants : [];

  const filteredPlants = useMemo(() => {

    return safePlants.filter((p) => {

      const matchesSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.location?.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter ? p.plant_type === typeFilter : true;

      return matchesSearch && matchesType;

    });

  }, [safePlants, search, typeFilter]);

  return (
    <PageLayout title="" showBack={false}>

      <PlantFilters
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      <PlantTable
        plants={filteredPlants}
        loading={loading}
        deletePlant={deletePlant}
      />

    </PageLayout>
  );
};