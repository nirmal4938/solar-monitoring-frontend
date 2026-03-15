import { useState } from "react";
import { useClock } from "../hooks/useClock";
import { useEnterpriseEnergy } from "../hooks/useEnterpriseEnergy";
import EnterpriseKpiStrip from "../components/EnterpriseKpiStrip";
import { PLANT_ID } from "../constants/solarConstants";
import EnterpriseScadaCanvas from "../components/EnterpriseScadaCanvas";
import { RealtimeScadaChart } from "../components/RealtimeScadaChart";

function getLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
}

export default function EnterpriseEnergyCenter() {
  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [date, setDate] = useState(getLocalISODate());
  const now = useClock();

  const enterprise = useEnterpriseEnergy(
    PLANT_ID,
    date,
    timezone
  );

  const netEnergy =
    (enterprise.totalGeneration || 0) -
    (enterprise.totalConsumption || 0);

  const performanceRatio =
    enterprise.totalConsumption > 0
      ? (
          (enterprise.totalGeneration /
            enterprise.totalConsumption) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 25,
        padding: 25,
        background: "#f3f4f6",
        minHeight: "100vh"
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>
            Enterprise Energy Command Center
          </h2>
          <span
            style={{
              fontSize: 13,
              color: "#6b7280"
            }}
          >
            Last updated: {now.toLocaleTimeString()}
          </span>
        </div>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: 6,
            borderRadius: 6,
            border: "1px solid #e5e7eb"
          }}
        />
      </div>

      {/* KPI STRIP */}
      {!enterprise.loading && (
        <EnterpriseKpiStrip data={enterprise} />
      )}

{/* ================= MAIN ENTERPRISE GRID ================= */}
<div
  style={{
    display: "grid",
    gap: 20,
    width: "100%",
    minHeight: "650px",

    // Responsive behavior
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    alignItems: "stretch"
  }}
>
  {/* ================= LEFT — SCADA VISUALIZATION ================= */}
  <div
    style={{
      background: "#ffffff",
      borderRadius: 14,
      padding: 18,
      boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column"
    }}
  >
    <h3 style={{ marginTop: 0, marginBottom: 15 }}>
      Real-Time SCADA Monitoring
    </h3>

    <div style={{ flex: 1, minHeight: 450 }}>
      <EnterpriseScadaCanvas
        data={enterprise?.scada_data}
      />
    </div>
  </div>

  {/* ================= RIGHT — ANALYTICS ================= */}
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 20
    }}
  >
    {/* SMART ANALYTICS PANEL */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        Smart Analytics Intelligence
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 15,
          marginTop: 15
        }}
      >
        <AnalyticsCard
          title="System Health"
          value={enterprise.systemHealth || "Healthy"}
          color={
            enterprise.systemHealth === "Critical"
              ? "#ef4444"
              : enterprise.systemHealth === "Warning"
              ? "#f59e0b"
              : "#10b981"
          }
        />

        <AnalyticsCard
          title="Net Energy"
          value={`${netEnergy.toFixed(0)} kWh`}
          color={netEnergy >= 0 ? "#22c55e" : "#ef4444"}
        />

        <AnalyticsCard
          title="Performance Ratio"
          value={`${performanceRatio} %`}
          color={
            performanceRatio < 70
              ? "#ef4444"
              : performanceRatio < 85
              ? "#f59e0b"
              : "#3b82f6"
          }
        />

        <AnalyticsCard
          title="Peak Load"
          value={
            enterprise.totalConsumption > 650
              ? "High ⚠"
              : "Normal"
          }
          color={
            enterprise.totalConsumption > 650
              ? "#f59e0b"
              : "#6366f1"
          }
        />

        <AnalyticsCard
          title="Efficiency"
          value={`${(
            (enterprise.totalGeneration /
              (enterprise.totalConsumption || 1)) *
            100
          ).toFixed(1)} %`}
          color="#0ea5e9"
        />

        <AnalyticsCard
          title="Anomaly"
          value={
            Math.abs(netEnergy) > 300
              ? "Deviation ⚠"
              : "Stable"
          }
          color={
            Math.abs(netEnergy) > 300
              ? "#ef4444"
              : "#22c55e"
          }
        />
      </div>
    </div>

    {/* AI FORECAST */}
    <div
      style={{
        background: "#ffffff",
        borderRadius: 14,
        padding: 20,
        boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
      }}
    >
      <h4 style={{ marginTop: 0 }}>
        AI Forecast & Action Engine
      </h4>

      <p
        style={{
          fontSize: 14,
          color: "#6b7280",
          lineHeight: 1.6
        }}
      >
        Based on real-time generation and load trend,
        the system is projected to{" "}
        <strong>
          {netEnergy > 0
            ? "maintain surplus output"
            : "require grid support"}
        </strong>{" "}
        within the next 2 hours.
      </p>

      <div
        style={{
          marginTop: 15,
          padding: 15,
          borderRadius: 10,
          background:
            netEnergy < 0
              ? "#fff7ed"
              : "#f0fdf4"
        }}
      >
        <strong>Recommended Action:</strong>
        <br />
        {netEnergy < 0
          ? "• Shift non-critical loads.\n• Optimize inverter output.\n• Check panel variance."
          : "• Store excess energy.\n• Enable grid export.\n• Maintain calibration."}
      </div>
    </div>
  </div>
</div>
      {/* ===============================
           TIME-SERIES SECTION (NEW)
      ================================ */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: 25,
          boxShadow:
            "0 6px 18px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <h3 style={{ margin: 0 }}>
            Energy Time-Series Analytics
          </h3>

          <span
            style={{
              fontSize: 13,
              color: "#6b7280"
            }}
          >
            Daily trend • 15-min resolution
          </span>
        </div>

        {/* CHART CONTAINER */}
        <div
          style={{
            width: "100%",
            height: 350,
            borderRadius: 10,
            background:
              "linear-gradient(180deg,#f9fafb,#f3f4f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: 14
          }}
        >
         <RealtimeScadaChart scadaStream={enterprise?.scada_data} />
        </div>
      </div>
            {/* ===============================
           INTEGRATED ALERTS SECTION
      ================================ */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: 25,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 20
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0 }}>
            🚨 Integrated Alert Center
          </h3>

          <span style={{
            fontSize: 13,
            color: "#6b7280"
          }}>
            Real-time system monitoring
          </span>
        </div>

        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 12
        }}>
          <AlertItem
            level="warning"
            message="Battery SOC dropped below 20% threshold."
            time="2 mins ago"
          />

          <AlertItem
            level="info"
            message="PV generation increased by 8% vs yesterday."
            time="10 mins ago"
          />

          <AlertItem
            level="critical"
            message="Grid frequency deviation detected."
            time="18 mins ago"
          />
        </div>
      </div>


      {/* ===============================
           SYSTEM HEALTH SECTION
      ================================ */}

      <div
        style={{
          background: "#ffffff",
          borderRadius: 14,
          padding: 25,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          gap: 25
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0 }}>
            🛠 System Health Overview
          </h3>

          <span style={{
            fontSize: 13,
            color: "#6b7280"
          }}>
            Live diagnostics snapshot
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
          gap: 20
        }}>
          <HealthCard
            title="Inverter Efficiency"
            value="96.4 %"
            status="good"
          />

          <HealthCard
            title="Transformer Loss"
            value="1.5 %"
            status="good"
          />

          <HealthCard
            title="Battery Health Index"
            value="87 %"
            status="warning"
          />

          <HealthCard
            title="Grid Stability"
            value="49.98 Hz"
            status="good"
          />
        </div>
      </div>
    </div>
  );
}

/* =========================
   REUSABLE CARD
========================= */

function AnalyticsCard({
  title,
  value,
  color
}) {
  return (
    <div
      style={{
        marginBottom: 15,
        padding: 15,
        borderRadius: 10,
        background: "#f9fafb",
        borderLeft: `5px solid ${color}`
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: "#6b7280"
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: color
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* =========================
   ALERT COMPONENT
========================= */

function AlertItem({ level, message, time }) {
  const colors = {
    info: "#3b82f6",
    warning: "#f59e0b",
    critical: "#ef4444"
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 14,
        borderRadius: 10,
        background: "#f9fafb",
        borderLeft: `5px solid ${colors[level]}`
      }}
    >
      <div>
        <div style={{
          fontSize: 14,
          fontWeight: 500
        }}>
          {message}
        </div>
        <div style={{
          fontSize: 12,
          color: "#6b7280"
        }}>
          {time}
        </div>
      </div>

      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: colors[level],
        textTransform: "uppercase"
      }}>
        {level}
      </div>
    </div>
  );
}


/* =========================
   SYSTEM HEALTH CARD
========================= */

function HealthCard({ title, value, status }) {
  const colors = {
    good: "#10b981",
    warning: "#f59e0b",
    critical: "#ef4444"
  };

  return (
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        background: "#f9fafb",
        borderTop: `5px solid ${colors[status]}`,
        display: "flex",
        flexDirection: "column",
        gap: 8
      }}
    >
      <div style={{
        fontSize: 13,
        color: "#6b7280"
      }}>
        {title}
      </div>

      <div style={{
        fontSize: 20,
        fontWeight: 600,
        color: colors[status]
      }}>
        {value}
      </div>

      <div style={{
        fontSize: 12,
        color: colors[status],
        textTransform: "uppercase",
        fontWeight: 600
      }}>
        {status}
      </div>
    </div>
  );
}