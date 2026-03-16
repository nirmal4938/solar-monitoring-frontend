import React from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";

import PageLayout from "../layouts/PageLayout";

/* ICONS */

import {
  Sun,
  Zap,
  ArrowDownCircle,
  ArrowUpCircle,
  Battery,
  Activity,
  LineChart,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  IndianRupee,
  AlertTriangle,
} from "lucide-react";

export const Dashboard = () => {
  const plants = [
    { name: "Plant 1", code: "P1" },
    { name: "Plant 2", code: "P2" },
  ];

  /* KPI DATA */

  const kpis = [
    {
      label: "Generation",
      value: "1,240",
      unit: "kWh",
      trend: "+8%",
      icon: Sun,
    },
    {
      label: "Consumption",
      value: "1,020",
      unit: "kWh",
      trend: "-2%",
      icon: Zap,
    },
    {
      label: "Grid Import",
      value: "220",
      unit: "kWh",
      trend: "-4%",
      icon: ArrowDownCircle,
    },
    {
      label: "Net Balance",
      value: "+120",
      unit: "kWh",
      trend: "+6%",
      icon: ArrowUpCircle,
    },
    {
      label: "Self Consumption",
      value: "68",
      unit: "%",
      trend: "+3%",
      icon: Battery,
    },
    {
      label: "Grid Dependency",
      value: "22",
      unit: "%",
      trend: "-5%",
      icon: Activity,
    },
    {
      label: "Performance Ratio",
      value: "82",
      unit: "%",
      trend: "+1%",
      icon: LineChart,
    },
    {
      label: "Plant Availability",
      value: "99.3",
      unit: "%",
      trend: "0%",
      icon: ShieldCheck,
    },
  ];

  /* CHART DATA */

  const generationVsLoad = {
    labels: ["6AM", "8AM", "10AM", "12PM", "2PM", "4PM", "6PM"],
    datasets: [
      {
        label: "Generation kW",
        data: [10, 25, 50, 70, 65, 45, 15],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.15)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Consumption kW",
        data: [20, 30, 40, 50, 55, 45, 30],
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const gridInteraction = {
    labels: ["Import", "Export"],
    datasets: [
      {
        data: [300, 180],
        backgroundColor: ["#ef4444", "#3b82f6"],
        borderWidth: 0,
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#eef2f7" } },
    },
  };

  return (
    <PageLayout title="Energy Overview" showBack={false}>
      <div className="grid gap-0">
        {/* HEADER FILTERS */}

        <div className="col-12 flex justify-content-end gap-3 mb-3">
          <Dropdown
            options={plants}
            optionLabel="name"
            placeholder="Select Plant"
            className="w-12rem"
          />

          <Calendar
            selectionMode="range"
            readOnlyInput
            placeholder="Date Range"
          />
        </div>

        {/* KPI GRID */}

        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;

          return (
            <div key={i} className="col-12 md:col-3 p-2">
              <Card className="border-round-xl border-1 surface-border shadow-1">
                <div className="flex justify-content-between align-items-start mb-3">
                  <div className="flex align-items-center gap-2">
                    <Icon size={18} className="text-500" />

                    <span className="text-xs text-500 uppercase">
                      {kpi.label}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      kpi.trend.includes("-")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {kpi.trend}
                  </span>
                </div>

                <div className="flex align-items-end gap-2">
                  <span className="font-semibold text-3xl">{kpi.value}</span>

                  <span className="text-500 text-sm">{kpi.unit}</span>
                </div>
              </Card>
            </div>
          );
        })}

        {/* ENERGY FLOW */}

        <div className="col-12 p-2">
          <Card className="border-round-xl border-1 surface-border shadow-1">
            <div className="flex justify-content-between align-items-center mb-4">
              <div className="flex flex-column gap-1">
                <div className="flex align-items-center gap-2">
                  <TrendingUp size={18} className="text-500" />

                  <span className="font-semibold text-900">Energy Flow</span>
                </div>

                <span className="text-sm text-500">
                  Generation vs Consumption
                </span>
              </div>

              <div className="flex gap-2">
                <Tag value="Day" severity="info" rounded />
                <Tag value="Week" rounded />
                <Tag value="Month" rounded />
              </div>
            </div>

            {/* ENERGY SYSTEM */}

            <div className="grid text-center mb-4 gap-0">
              <div className="col-12 md:col-3">
                <Sun size={28} className="text-yellow-500 mb-2" />

                <div className="text-sm text-500">Solar Generation</div>

                <div className="text-xl font-semibold">1,240 kWh</div>
              </div>

              <div className="col-12 md:col-3">
                <Battery size={28} className="text-green-500 mb-2" />

                <div className="text-sm text-500">Battery Storage</div>

                <div className="text-xl font-semibold">420 kWh</div>

                <Tag value="SOC 72%" severity="success" rounded />
              </div>

              <div className="col-12 md:col-3">
                <Zap size={28} className="text-orange-500 mb-2" />

                <div className="text-sm text-500">Load Consumption</div>

                <div className="text-xl font-semibold">1,020 kWh</div>
              </div>

              <div className="col-12 md:col-3">
                <Activity size={28} className="text-blue-500 mb-2" />

                <div className="text-sm text-500">Grid Interaction</div>

                <div className="flex justify-content-center gap-3 mt-1">
                  <Tag value="Import 300" severity="danger" />
                  <Tag value="Export 180" severity="success" />
                </div>
              </div>
            </div>

            {/* LINE CHART */}

            <div style={{ height: "360px" }}>
              <Chart
                type="line"
                data={generationVsLoad}
                options={lineOptions}
                height="360px"
              />
            </div>
          </Card>
        </div>

        {/* GRID INTERACTION */}

        <div className="col-12 md:col-6 p-2">
          <Card className="border-round-xl border-1 surface-border shadow-1">
            <div className="flex flex-column gap-1 mb-3">
              <div className="flex align-items-center gap-2">
                <Activity size={18} className="text-500" />

                <span className="font-semibold">Grid Interaction</span>
              </div>

              <span className="text-sm text-500">Import vs Export</span>
            </div>

            <div
              className="flex justify-content-center align-items-center"
              style={{ height: "260px" }}
            >
              <Chart
                type="doughnut"
                data={gridInteraction}
                style={{ width: "220px", height: "220px" }}
              />
            </div>
          </Card>
        </div>

        {/* FINANCIAL */}

        <div className="col-12 md:col-6 p-2">
          <Card className="border-round-xl border-1 surface-border shadow-1">
            <div className="flex align-items-center gap-2 mb-4">
              <IndianRupee size={18} className="text-500" />

              <span className="font-semibold">Financial Snapshot</span>
            </div>

            <div className="flex flex-column gap-4">
              <div className="flex justify-content-between">
                <span className="text-600">Import Cost</span>

                <b>₹12,450</b>
              </div>

              <div className="flex justify-content-between">
                <span className="text-600">Export Credit</span>

                <b>₹3,120</b>
              </div>

              <div className="flex justify-content-between">
                <span className="text-600">Net Energy Bill</span>

                <b>₹9,330</b>
              </div>
            </div>
          </Card>
        </div>

        {/* ALERTS */}

        <div className="col-12 md:col-6 p-2">
          <Card className="border-round-xl border-1 surface-border shadow-1">
            <div className="flex align-items-center gap-2 mb-3">
              <AlertTriangle size={18} className="text-500" />

              <span className="font-semibold">Recent Alerts</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Tag
                icon="pi pi-exclamation-circle"
                severity="danger"
                value="Inverter Offline"
              />
              <Tag
                icon="pi pi-exclamation-triangle"
                severity="warning"
                value="Low Generation"
              />
              <Tag icon="pi pi-bolt" severity="info" value="Battery Charging" />
            </div>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};
