import { useState, useEffect, useMemo } from "react";
import { useClock } from "../hooks/useClock";
import { useConsumptionData } from "../hooks/useConsumptionData";
import { useSolarData } from "../hooks/useSolarData";
import { PLANT_ID } from "../constants/solarConstants";
import EnergyFlowChart from "../components/EnergyFlowChart";
function generateRealtimeDummyData(date) {
  const data = [];
  const start = new Date(`${date}T00:00:00`).getTime();
  const interval = 15 * 60 * 1000;

  for (let i = 0; i < 96; i++) {
    const time = start + i * interval;

    const hour = new Date(time).getHours();

    // 🌞 Solar curve (bell shape from 6AM–6PM)
    let generation = 0;
    if (hour >= 6 && hour <= 18) {
      const peak = 500; // kW peak
      const x = (hour - 6) / 12; // normalize 0–1
      generation = peak * Math.sin(Math.PI * x);
    }

    // 🏭 Load curve (random industrial variation)
    const baseLoad = 300;
    const demand =
      baseLoad +
      100 * Math.sin((hour / 24) * Math.PI * 2) +
      Math.random() * 40;

    // ⚡ Grid logic (physics-style)
    const gridImport = demand > generation ? demand - generation : 0;
    const gridExport = generation > demand ? generation - demand : 0;

    data.push({
      time,
      generation: Number(generation.toFixed(2)),
      demand: Number(demand.toFixed(2)),
      gridImport: Number(gridImport.toFixed(2)),
      gridExport: Number(gridExport.toFixed(2))
    });
  }

  return data;
}
function getLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
}

export default function ConsumptionDashboard() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [date, setDate] = useState(getLocalISODate());
  const now = useClock();

  const solar = useSolarData(PLANT_ID, date, timezone);
  const consumption = useConsumptionData(PLANT_ID, date, timezone);

  const isToday = date === getLocalISODate();

  useEffect(() => {
    if (!isToday) return;

    const interval = setInterval(() => {
      solar.refresh();
      consumption.refresh();
    }, 60000);

    return () => clearInterval(interval);
  }, [isToday, solar, consumption]);

  /* ============================
     SAFE TIMESTAMP-BASED MERGE
     ============================ */

  const mergedData = useMemo(() => {
    if (!solar?.data?.length) return [];

    const consumptionMap = new Map(
      (consumption?.timeSeries || []).map(d => [
        new Date(d.timestamp).getTime(),
        d
      ])
    );

    return solar.data.map(s => {
      const ts = new Date(s.time).getTime();
      const load = consumptionMap.get(ts) || {};

      return {
        time: ts,
        generation: s.power || 0,
        demand: load.load_kw || 0,
        gridImport: load.grid_import_kw || 0,
        gridExport: load.grid_export_kw || 0
      };
    });
  }, [solar.data, consumption.timeSeries]);

  /* ============================
     RENDER
     ============================ */

     const dummyData = useMemo(
  () => generateRealtimeDummyData(date),
  [date]
);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      <h2>Consumption Overview</h2>

      {/* ================= ELECTRICAL KPIs ================= */}
      <SectionTitle title="Electrical KPIs" />

      <div style={grid5}>
        <KpiCard
          label="Total Consumption"
          value={`${consumption?.electrical?.totalConsumption?.toFixed?.(2) || 0} kWh`}
        />
        <KpiCard
          label="Peak Load"
          value={`${consumption?.electrical?.peakLoad?.toFixed?.(2) || 0} kW`}
        />
        <KpiCard
          label="Load Factor"
          value={`${consumption?.electrical?.loadFactor?.toFixed?.(2) || 0} %`}
        />
        <KpiCard
          label="Avg Power Factor"
          value={`${consumption?.electrical?.avgPowerFactor?.toFixed?.(2) || 0}`}
        />
        <KpiCard
          label="Voltage Range"
          value={`${consumption?.electrical?.voltageMin?.toFixed?.(1) || 0}
                 - ${consumption?.electrical?.voltageMax?.toFixed?.(1) || 0} V`}
        />
      </div>

      {/* ================= FINANCIAL KPIs ================= */}
      <SectionTitle title="Financial KPIs" />

      <div style={grid4}>
        <KpiCard
          label="Energy Cost"
          value={`₹ ${consumption?.financial?.energyCost?.toFixed?.(2) || 0}`}
        />
        <KpiCard
          label="Demand Charges"
          value={`₹ ${consumption?.financial?.demandCharges?.toFixed?.(2) || 0}`}
        />
        <KpiCard
          label="PF Penalty"
          value={`₹ ${consumption?.financial?.pfPenalty?.toFixed?.(2) || 0}`}
        />
        <KpiCard
          label="Estimated Bill"
          value={`₹ ${consumption?.financial?.estimatedBill?.toFixed?.(2) || 0}`}
        />
      </div>

      {/* ================= RISK INDICATORS ================= */}
      <SectionTitle title="Risk Indicators" />

      <div style={{ display: "flex", gap: 12 }}>
        <RiskBadge
          active={consumption?.risk?.lowPf}
          label="Low Power Factor"
        />
        <RiskBadge
          active={consumption?.risk?.voltageDeviation}
          label="Voltage Deviation"
        />
        <RiskBadge
          active={consumption?.risk?.peakDemandRisk}
          label="Peak Demand Risk"
        />
      </div>

      {/* ================= ENERGY FLOW CHART ================= */}
      <EnergyFlowChart
        data={consumption.timeSeries}
        date={date}
        now={now}
        isToday={isToday}
      />

    </div>
  );
}

/* ============================
   UI HELPERS
   ============================ */

function SectionTitle({ title }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>
      {title}
    </div>
  );
}

function KpiCard({ label, value }) {
  return (
    <div style={{
      background: "#fff",
      padding: 15,
      borderRadius: 8,
      border: "1px solid #e5e7eb"
    }}>
      <div style={{ fontSize: 12, color: "#6b7280" }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

function RiskBadge({ active, label }) {
  return (
    <div style={{
      padding: "8px 14px",
      borderRadius: 6,
      background: active ? "#fee2e2" : "#dcfce7",
      color: active ? "#991b1b" : "#065f46",
      fontWeight: 500,
      border: active ? "1px solid #fecaca" : "1px solid #bbf7d0"
    }}>
      {active ? "⚠ " : "✓ "} {label}
    </div>
  );
}

const grid5 = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
  gap: 15
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 15
};