// src/pages/InverterDetails.jsx
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

import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";

export const InverterDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [headerSticky, setHeaderSticky] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const toast = useRef(null);

  /* ===============================
     MOCK DATA (Replace with API)
  =============================== */

  const inverter = {
    name: "SMA Sunny Tripower",
    plantName: "Solar Plant Alpha",
    serialNumber: "INV-839393",
    manufacturer: "SMA",
    model: "STP 50-40",
    capacity: 50,
    mpptCount: 4,
    stringCount: 16,
    maxDcVoltage: 1100,
    nominalAcVoltage: 400,
    efficiency: 98.4,
    firmwareVersion: "v2.3.1",
    communicationProtocol: "Modbus TCP",
    operatingMode: "Grid-Tied",
    installationDate: "2023-01-20",
    warrantyExpiry: "2028-01-20",
    status: "ONLINE",
    temperature: 42,
  };

  const maintenance = [];

  const alerts = [
    {
      severity: "HIGH",
      message: "Inverter temperature exceeded safe threshold",
      triggeredAt: "2024-05-01 13:22",
    },
  ];

  const aiMetrics = {
    efficiencyScore: 90,
    reliabilityScore: 84,
    anomalyScore: 12,
    gridRiskScore: 30,
    overallScore: 86,
  };

  /* ===============================
     Sticky Header
  =============================== */

  useEffect(() => {
    const handleScroll = () => setHeaderSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===============================
     KPI CAROUSEL
  =============================== */

  const kpis = [
    { label: "Capacity", value: `${inverter.capacity} kW` },
    { label: "MPPT Channels", value: inverter.mpptCount },
    { label: "Strings", value: inverter.stringCount },
    { label: "Efficiency", value: inverter.efficiency },
    { label: "Temperature", value: `${inverter.temperature}°C` },
    {
      label: "Status",
      value: <Tag value={inverter.status} severity="success" />,
    },
  ];

  /* ===============================
     AI Radar Chart
  =============================== */

  const radarData = {
    labels: [
      "Efficiency",
      "Reliability",
      "Anomaly Detection",
      "Grid Risk",
      "Overall",
    ],
    datasets: [
      {
        label: "AI Scores",
        data: [
          aiMetrics.efficiencyScore,
          aiMetrics.reliabilityScore,
          aiMetrics.anomalyScore,
          aiMetrics.gridRiskScore,
          aiMetrics.overallScore,
        ],
        backgroundColor: "rgba(30,58,175,0.3)",
        borderColor: "#1e3a8a",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bb-page">
      <Toast ref={toast} />

      {/* HEADER */}

      <div className={`bb-header ${headerSticky ? "bb-header-sticky" : ""}`}>
        <div className="bb-header-left">
          <div className="bb-breadcrumb">
            <i className="pi pi-home"></i>
            <span>Inverters</span>
            <i className="pi pi-angle-right"></i>
            <span className="current">Inverter Details</span>
          </div>

          <div className="bb-title-row">
            <h1 className="bb-title">Inverter Insights</h1>
            <span className="bb-status-dot healthy"></span>
          </div>

          <div className="bb-header-meta">
            <Tag value={inverter.model} icon="pi pi-bolt" severity="info" />

            <span className="bb-meta-item">
              <i className="pi pi-map-marker"></i>
              {inverter.plantName}
            </span>

            <Tag value={inverter.status} severity="success" />

            <span className="bb-meta-item">
              <i className="pi pi-chart-line"></i>
              {inverter.capacity} kW
            </span>
          </div>
        </div>

        <div className="bb-actions">
          <Button
            icon="pi pi-arrow-left"
            label="Back"
            className="p-button-text"
            onClick={() => navigate("/inverters")}
          />

          <Button
            icon="pi pi-pencil"
            label="Edit"
            className="CTA-Button"
            onClick={() => navigate(`/inverters/edit/${id}`)}
          />

          <Button
            icon="pi pi-bell"
            className="p-button-text"
            onClick={() =>
              toast.current.show({
                severity: "info",
                summary: "Alerts",
                detail: "You have new inverter alerts",
                life: 3000,
              })
            }
          />
        </div>
      </div>

      {/* KPI CAROUSEL */}

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
                <ProgressBar value={item.value} showValue />
              )}
            </div>
          </Card>
        )}
      />

      {/* TAB VIEW */}

      <TabView className="bb-tabs bb-tabs-xl">
        {/* BASIC INFO */}

        <TabPanel header="Basic Info">
          <div className="formgrid grid gap-0">
            <div className="field col-6">
              <label>Inverter Name</label>
              <InputText value={inverter.name} disabled />
            </div>

            <div className="field col-6">
              <label>Serial Number</label>
              <InputText value={inverter.serialNumber} disabled />
            </div>

            <div className="field col-6">
              <label>Manufacturer</label>
              <InputText value={inverter.manufacturer} disabled />
            </div>

            <div className="field col-6">
              <label>Model</label>
              <InputText value={inverter.model} disabled />
            </div>

            <div className="field col-6">
              <label>Status</label>
              <Tag value={inverter.status} severity="success" />
            </div>

            <div className="field col-6">
              <label>Efficiency</label>
              <ProgressBar value={inverter.efficiency} showValue />
            </div>
          </div>
        </TabPanel>

        {/* SPECIFICATIONS */}

        <TabPanel header="Specifications">
          <div className="formgrid grid gap-0">
            <div className="field col-6">
              <label>Capacity (kW)</label>
              <InputNumber value={inverter.capacity} disabled />
            </div>

            <div className="field col-6">
              <label>MPPT Count</label>
              <InputNumber value={inverter.mpptCount} disabled />
            </div>

            <div className="field col-6">
              <label>String Count</label>
              <InputNumber value={inverter.stringCount} disabled />
            </div>

            <div className="field col-6">
              <label>Max DC Voltage (V)</label>
              <InputNumber value={inverter.maxDcVoltage} disabled />
            </div>

            <div className="field col-6">
              <label>Nominal AC Voltage (V)</label>
              <InputNumber value={inverter.nominalAcVoltage} disabled />
            </div>

            <div className="field col-6">
              <label>Operating Mode</label>
              <InputText value={inverter.operatingMode} disabled />
            </div>
          </div>
        </TabPanel>

        {/* AI METRICS */}

        <TabPanel header="AI Metrics">
          <Chart
            type="radar"
            data={radarData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
            style={{ height: "300px" }}
          />
        </TabPanel>

        {/* MAINTENANCE */}

        <TabPanel header="Maintenance Logs">
          <DataTable value={maintenance} emptyMessage="No maintenance logs">
            <Column field="issue" header="Issue" />
            <Column field="actionTaken" header="Action Taken" />
            <Column field="cost" header="Cost" />
            <Column field="performedAt" header="Performed At" />
          </DataTable>
        </TabPanel>

        {/* ALERTS */}

        <TabPanel header="Alerts Timeline">
          <Timeline
            value={alerts}
            align="alternate"
            content={(item) => (
              <Card>
                <Tag value={item.severity} severity="danger" />
                <p>{item.message}</p>
                <small>{item.triggeredAt}</small>
              </Card>
            )}
          />
        </TabPanel>
      </TabView>

      {/* Dialog */}

      <Dialog
        header="Inverter Details"
        visible={dialogVisible}
        style={{ width: "50vw" }}
        onHide={() => setDialogVisible(false)}
      >
        <p>Additional inverter information...</p>
      </Dialog>
    </div>
  );
};
