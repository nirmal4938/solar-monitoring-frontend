// src/components/InverterContributionChart.jsx

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";

export default function InverterContributionChart({ data = [] }) {

  /* ===============================
     1️⃣ Sort Highest First
  ================================ */
  const sorted = [...data].sort(
    (a, b) => b.energy_kwh - a.energy_kwh
  );

  /* ===============================
     2️⃣ Format for Chart
  ================================ */
  const formatted = sorted.map((d, index) => ({
    inverterName: `INV-${index + 1}`,
    energy: d.energy_kwh ?? 0,
    percent: d.contribution_pct ?? 0
  }));

  /* ===============================
     3️⃣ Dynamic Gradient Color
  ================================ */
  const getColor = (percent) => {
    if (percent >= 25) return "#16a34a"; // green (top performer)
    if (percent >= 20) return "#6366f1"; // blue
    if (percent >= 15) return "#f59e0b"; // amber
    return "#ef4444"; // red (low performer)
  };

  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart
        data={formatted}
        margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
      >

        <CartesianGrid
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="inverterName"
          tick={{ fontSize: 12 }}
        />

        {/* Left Axis — Energy */}
        <YAxis
          yAxisId="left"
          unit=" kWh"
        />

        {/* Right Axis — % Contribution */}
        <YAxis
          yAxisId="right"
          orientation="right"
          unit=" %"
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            borderRadius: 8,
            border: "none",
            color: "#fff"
          }}
          formatter={(value, name) => {
            if (name === "Energy")
              return [`${value.toFixed(2)} kWh`, "Energy"];
            return [`${value.toFixed(2)} %`, "Contribution"];
          }}
        />

        {/* ENERGY BAR */}
        <Bar
          yAxisId="left"
          dataKey="energy"
          name="Energy"
          radius={[6, 6, 0, 0]}
        >
          {formatted.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.percent)}
            />
          ))}

          {/* % Label On Top */}
          <LabelList
            dataKey="percent"
            position="top"
            formatter={(v) => `${v.toFixed(1)}%`}
            style={{
              fill: "#111827",
              fontSize: 12,
              fontWeight: 600
            }}
          />
        </Bar>

        {/* CONTRIBUTION % BAR (Thin Overlay) */}
        <Bar
          yAxisId="right"
          dataKey="percent"
          name="Contribution"
          fill="#94a3b8"
          barSize={8}
        />

      </BarChart>
    </ResponsiveContainer>
  );
}