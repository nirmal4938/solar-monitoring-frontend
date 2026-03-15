// src/pages/BatteryDetails.jsx
import React, { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Timeline } from "primereact/timeline";
import { Carousel } from "primereact/carousel";
import { Chart } from "primereact/chart";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useNavigate, useParams } from "react-router-dom";
import "../plants/HeaderOrganism.css";
import { useEditBatteries } from "../../hooks/useEditBattries";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export const BatteryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [headerSticky, setHeaderSticky] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const toast = useRef(null);

  const { batteryDetails } = useEditBatteries(id);
  const { battery, maintenance, aiMetrics, alerts } = batteryDetails || {
    battery: null,
    maintenance: [],
    aiMetrics: null,
    alerts: [],
  };

  // Scroll event for sticky header
  useEffect(() => {
    const handleScroll = () => setHeaderSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // KPI Carousel
  const kpis = [
    { label: "Total Capacity", value: battery?.totalCapacity },
    { label: "Usable Capacity", value: battery?.usableCapacity },
    { label: "Max Charge Power", value: battery?.maxChargePower },
    { label: "Max Discharge Power", value: battery?.maxDischargePower },
    { label: "Efficiency", value: battery?.roundTripEfficiency },
    {
      label: "Active Alerts",
      value: <Tag value={battery?.activeAlerts || 0} severity="danger" />,
    },
  ];

  // AI Radar Chart
  const radarData = {
    labels: ["Efficiency", "Arbitrage", "Peak Shaving", "Health", "Overall"],
    datasets: [
      {
        label: "AI Scores",
        data: [
          aiMetrics?.efficiencyScore,
          aiMetrics?.arbitrageScore,
          aiMetrics?.peakShavingScore,
          aiMetrics?.healthScore,
          aiMetrics?.overallScore,
        ],
        backgroundColor: "rgba(30,58,175,0.3)",
        borderColor: "#1e3a8a",
        borderWidth: 2,
      },
    ],
  };

  // Maintenance DataTable Columns
  const maintenanceColumns = [
    { field: "issue", header: "Issue" },
    { field: "actionTaken", header: "Action Taken" },
    { field: "cost", header: "Cost" },
    { field: "performedAt", header: "Performed At" },
  ];

  return (
    <div className="bb-page">
      <Toast ref={toast} />
      {/* HEADER */}
      <div className={`bb-header ${headerSticky ? "bb-header-sticky" : ""}`}>
        <div className="bb-header-left">
          <div className="bb-breadcrumb">
            <i className="pi pi-home"></i>
            <span>Batteries</span>
            <i className="pi pi-angle-right"></i>
            <span className="current">Battery Details</span>
          </div>
          <div className="bb-title-row">
            <h1 className="bb-title">Battery Insights</h1>
            <span className="bb-status-dot healthy"></span>
          </div>
          <div className="bb-header-meta">
            <Tag
              value={battery?.type}
              icon="pi pi-bolt"
              severity="info"
              rounded
            />
            <span className="bb-meta-item">
              <i className="pi pi-map-marker"></i>
              {battery?.location}
            </span>
            <Tag
              value="Operating Normally"
              icon="pi pi-check-circle"
              severity="success"
              rounded
            />
            <span className="bb-meta-item">
              <i className="pi pi-chart-line"></i>
              {battery?.totalCapacity} kWh
            </span>
          </div>
        </div>
        <div className="bb-actions">
          <Button
            icon="pi pi-arrow-left"
            label="Back"
            className="p-button-text p-button-sm"
            onClick={() => navigate("/batteries")}
          />
          <Button
            icon="pi pi-pencil"
            label="Edit Battery"
            className="p-button-sm CTA-Button"
            onClick={() => navigate(`/batteries/edit/${id}`)}
            rounded
          />
          <Button
            icon="pi pi-bell"
            className="p-button-text"
            onClick={() =>
              toast.current.show({
                severity: "info",
                summary: "Alerts",
                detail: "You have new alerts",
                life: 3000,
              })
            }
          />
        </div>
      </div>

      {/* KPI Carousel */}
      <Carousel
        value={kpis}
        numVisible={3}
        numScroll={1}
        className="bb-carousel"
        itemTemplate={(item) => (
          <Card className="bb-card-xxl">
            <div className="bb-kpi-content">
              <span className="bb-card-label">{item.label}</span>
              <strong className="bb-card-value">{item.value}</strong>
              {item.label === "Efficiency" && (
                <ProgressBar
                  value={item.value || 0}
                  showValue={true}
                  className="bb-progressbar"
                />
              )}
            </div>
          </Card>
        )}
      />

      {/* Tabs for Details */}
      <TabView className="bb-tabs bb-tabs-xl">
        <TabPanel header="Basic Info">
          <div className="formgrid grid gap-0">
            {/* Battery Name */}
            <div className="field col-6">
              <label htmlFor="batteryName">Battery Name</label>
              <InputText
                id="batteryName"
                value={battery?.name}
                disabled
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Plant Name */}
            <div className="field col-6">
              <label htmlFor="plantName">Plant</label>
              <InputText
                id="plantName"
                value={battery?.plantName}
                disabled
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Status */}
            <div className="field col-6">
              <label>Status</label>
              <Tag
                value={battery?.status}
                severity="success"
                className="p-3 w-full text-center"
              />
            </div>

            {/* Health */}
            <div className="field col-6">
              <label>Health</label>
              <ProgressBar
                value={battery?.healthPct || 0}
                showValue={true}
                className="h-4 border-round surface-border"
              />
            </div>

            {/* Total Capacity */}
            <div className="field col-6">
              <label htmlFor="totalCapacity">Total Capacity (kWh)</label>
              <InputNumber
                id="totalCapacity"
                value={battery?.totalCapacity}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Usable Capacity */}
            <div className="field col-6">
              <label htmlFor="usableCapacity">Usable Capacity (kWh)</label>
              <InputNumber
                id="usableCapacity"
                value={battery?.usableCapacity}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Specifications">
          <div className="formgrid grid gap-0">
            {/* Total Capacity */}
            <div className="field col-6">
              <label htmlFor="totalCapacitySpec">Total Capacity (kWh)</label>
              <InputNumber
                id="totalCapacitySpec"
                value={battery?.totalCapacity}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Usable Capacity */}
            <div className="field col-6">
              <label htmlFor="usableCapacitySpec">Usable Capacity (kWh)</label>
              <InputNumber
                id="usableCapacitySpec"
                value={battery?.usableCapacity}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Max Charge Power */}
            <div className="field col-6">
              <label htmlFor="maxChargePower">Max Charge Power (kW)</label>
              <InputNumber
                id="maxChargePower"
                value={battery?.maxChargePower}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Max Discharge Power */}
            <div className="field col-6">
              <label htmlFor="maxDischargePower">
                Max Discharge Power (kW)
              </label>
              <InputNumber
                id="maxDischargePower"
                value={battery?.maxDischargePower}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Round Trip Efficiency */}
            <div className="field col-6">
              <label htmlFor="roundTripEfficiency">
                Round Trip Efficiency (%)
              </label>
              <InputNumber
                id="roundTripEfficiency"
                value={battery?.roundTripEfficiency}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Depth of Discharge */}
            <div className="field col-6">
              <label htmlFor="depthOfDischarge">Depth of Discharge (%)</label>
              <InputNumber
                id="depthOfDischarge"
                value={battery?.depthOfDischarge}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Financial Metrics">
          <div className="formgrid grid gap-0">
            {/* Arbitrage Savings */}
            <div className="field col-6">
              <label htmlFor="arbitrageSavings">Arbitrage Savings ($)</label>
              <InputNumber
                id="arbitrageSavings"
                value={battery?.arbitrageSavings}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Demand Charge Savings */}
            <div className="field col-6">
              <label htmlFor="demandChargeSavings">
                Demand Charge Savings ($)
              </label>
              <InputNumber
                id="demandChargeSavings"
                value={battery?.demandChargeSavings}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Degradation Cost */}
            <div className="field col-6">
              <label htmlFor="degradationCost">Degradation Cost ($)</label>
              <InputNumber
                id="degradationCost"
                value={battery?.degradationCost}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>

            {/* Adjusted Net Bill Impact */}
            <div className="field col-6">
              <label htmlFor="adjustedNetBillImpact">
                Adjusted Net Bill Impact ($)
              </label>
              <InputNumber
                id="adjustedNetBillImpact"
                value={battery?.adjustedNetBillImpact}
                disabled
                mode="decimal"
                className="text-base text-color surface-overlay p-3 border-1 border-solid surface-border border-round w-full"
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Maintenance Logs">
          <div className="p-2">
            {/* HEADER */}
            <div className="flex align-items-center justify-content-between mb-2">
              <div className="flex align-items-center gap-2 text-sm font-semibold">
                <i
                  className="pi pi-wrench text-primary"
                  style={{ fontSize: "0.9rem" }}
                ></i>
                <span>Maintenance History</span>
              </div>

              <div
                className="border-round px-2 py-1 text-xs"
                style={{ background: "#EEF2FF", fontWeight: 500 }}
              >
                {maintenance?.length || 0} Logs
              </div>
            </div>

            {/* TOOLBAR */}
            <div className="flex justify-content-end mb-2">
              <Button
                icon="pi pi-download"
                label="CSV"
                size="small"
                text
                onClick={() => dt.current.exportCSV()}
              />
            </div>

            {/* TABLE */}
            <div
              className="shadow-1 border-round"
              style={{ background: "#ffffff", padding: "0.75rem" }}
            >
              <DataTable
                value={maintenance}
                paginator
                rows={8}
                stripedRows
                showGridlines
                responsiveLayout="scroll"
                scrollable
                scrollHeight="360px"
                size="small"
                emptyMessage={
                  <div
                    className="flex justify-content-center align-items-center"
                    style={{ color: "red", width: "100%" }}
                  >
                    No maintenance records available
                  </div>
                }
                pt={{
                  headerCell: { style: { padding: "3px", fontSize: "12px" } },
                  bodyCell: { style: { padding: "3px", fontSize: "12px" } },
                  //       emptyMessage: {
                  //   style: {
                  //     textAlign: "center",
                  //     color: "red"
                  //   }
                  // }
                }}
              >
                {maintenanceColumns.map((col, idx) => (
                  <Column
                    key={idx}
                    field={col.field}
                    header={col.header}
                    sortable
                    filter
                    filterPlaceholder={`Search`}
                  />
                ))}

                {/* STATUS */}
                <Column
                  field="status"
                  header="Status"
                  body={(row) => (
                    <Tag
                      value={row.status}
                      severity={
                        row.status === "Completed"
                          ? "success"
                          : row.status === "Pending"
                            ? "warning"
                            : "danger"
                      }
                      style={{ fontSize: "11px", padding: "2px 6px" }}
                    />
                  )}
                />

                {/* ACTIONS */}
                <Column
                  header="Actions"
                  body={() => (
                    <div className="flex gap-1">
                      <Button
                        icon="pi pi-eye"
                        rounded
                        text
                        size="small"
                        severity="info"
                      />
                      <Button
                        icon="pi pi-pencil"
                        rounded
                        text
                        size="small"
                        severity="warning"
                      />
                    </div>
                  )}
                />
              </DataTable>
            </div>
          </div>
        </TabPanel>
        <TabPanel header="AI Metrics">
          <div className="p-2">
            {/* Header */}
            <div className="flex align-items-center justify-content-between mb-2">
              <div className="flex align-items-center gap-2 text-sm font-semibold">
                <i
                  className="pi pi-chart-line text-primary"
                  style={{ fontSize: "0.9rem" }}
                ></i>
                <span>AI Performance Metrics</span>
              </div>

              <div
                className="border-round px-2 py-1 text-xs"
                style={{ background: "#EEF2FF", fontWeight: 500 }}
              >
                Radar Overview
              </div>
            </div>

            {/* Chart Container */}
            <div
              className="shadow-1 border-round flex justify-content-center align-items-center"
              style={{
                background: "#ffffff",
                padding: "0.75rem",
                height: "320px",
              }}
            >
              <Chart
                type="radar"
                data={radarData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 10,
                        font: { size: 11 },
                      },
                    },
                  },
                  scales: {
                    r: {
                      ticks: {
                        font: { size: 10 },
                      },
                      pointLabels: {
                        font: { size: 11 },
                      },
                    },
                  },
                }}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel header="Alerts Timeline">
          <Timeline
            value={alerts || []}
            align="alternate"
            className="custom-timeline"
            content={(item) => (
              <Card>
                <Tag
                  value={item.severity}
                  severity={item.severity.toLowerCase()}
                />
                <p>{item.message}</p>
                <small>{item.triggeredAt}</small>
              </Card>
            )}
          />
        </TabPanel>
      </TabView>

      {/* Dialog Example */}
      <Dialog
        header="Battery Details"
        visible={dialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setDialogVisible(false)}
      >
        <p>Additional details can go here...</p>
      </Dialog>

      <style>{`
                .bb-page { padding:28px; background:#f8fafc; min-height:100vh; }

                /* HEADER */
                .bb-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; background:#fff; border-radius:12px; padding:16px; transition: all 0.3s ease; }
                .bb-header-sticky { position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
                .bb-title { font-size:28px; margin:0; font-weight:600; }
                .bb-breadcrumb { font-size:13px; color:#64748b; margin-bottom:6px; }
                .bb-header-meta { display:flex; gap:10px; align-items:center; margin-top:6px; }
                .bb-actions { display:flex; gap:10px; }

                /* CAROUSEL & KPI */
  /* CAROUSEL & KPI - LARGER THAN LIFE */
                .bb-carousel .p-carousel-item { padding: 12px; }

                .bb-card-xxl {
                    padding: 28px 24px;
                    border-radius: 20px;
                    background: linear-gradient(135deg, #ffffff, #cfe0fc);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    transition: transform 0.4s ease, box-shadow 0.4s ease, background 0.4s ease;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 220px;
                }

                .bb-card-xxl:hover {
                    transform: translateY(-6px) scale(1.02);
                    box-shadow: 0 16px 36px rgba(0,0,0,0.22);
                    background: linear-gradient(135deg, #ffffff, #a3c2f7);
                }

                .bb-kpi-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    width: 100%;
                }

                .bb-card-label {
                    font-size: 18px;
                    font-weight: 700;
                    color: #334155;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    text-align: center;
                }

                .bb-card-value {
                    font-size: 36px;
                    font-weight: 900;
                    color: #1e3a8a;
                    text-align: center;
                }

                .bb-progressbar {
                    width: 100%;
                    height: 12px;
                    border-radius: 10px;
                    margin-top: 8px;
                }

                /* GRID */
                .bb-grid-xl { display:grid; grid-template-columns:repeat(auto-fit,minmax(360px,1fr)); gap:20px; margin-bottom:30px; }
                .custom-timeline .p-timeline-event-opposite { font-weight:600; color:#1e3a8a; }

                /* TABVIEW  */
.bb-tabs-xl .p-tabview-panels {
    min-height: 500px; /* base larger height */
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.bb-tabs-xl .p-tabview-panel {
    min-height: 500px; /* ensures each tab is tall */
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.bb-tabs-xl .p-tabview-nav {
    margin-bottom: 20px;
    border-bottom: 2px solid #cfe0fc;
}

.bb-tabs-xl .p-tabview-nav li.p-highlight a {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 16px;
}



            `}</style>
    </div>
  );
};
