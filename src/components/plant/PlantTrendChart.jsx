import "./PlantTrendChart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function PlantTrendChart({ data }) {
  const plant = data?.plants?.[0];
  const trend = plant?.trend;

  if (!trend?.generation_kw?.length) {
    return (
      <div className="pi-trend-container">
        <div className="pi-trend-card empty-state">
          No plant trend data available
        </div>
      </div>
    );
  }

  const chartData = trend.generation_kw.map((_, index) => ({
    hour: `${index}:00`,
    generation: trend.generation_kw[index],
    consumption: trend.consumption_kw[index],
    grid_import: trend.grid_import_kw[index],
    battery_discharge: trend.battery_discharge_kw[index]
  }));

  const totalGeneration = trend.generation_kw
    .reduce((a, b) => a + b, 0)
    .toFixed(0);

  const totalConsumption = trend.consumption_kw
    .reduce((a, b) => a + b, 0)
    .toFixed(0);

  return (
    <div className="pi-trend-container">

      {/* ================= HEADER ================= */}
      <div className="pi-trend-header">
        <div>
          <h2 className="pi-trend-title">
            Energy Trend Intelligence
          </h2>
          <p className="pi-trend-subtitle">
            Generation, demand & storage behavior ({trend.range})
          </p>
        </div>

        <div className="pi-trend-range">
          {trend.interval} Interval
        </div>
      </div>

      {/* ================= KPI STRIP ================= */}
      <div className="pi-trend-kpis">
        <KPI label="Total Generation" value={`${totalGeneration} kWh`} />
        <KPI label="Total Consumption" value={`${totalConsumption} kWh`} />
        <KPI label="Data Points" value={trend.data_points} />
      </div>

      {/* ================= CHART ================= */}
      <div className="pi-trend-card chart-card">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="hour"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#111827",
                border: "none",
                borderRadius: "10px",
                color: "#ffffff"
              }}
              labelStyle={{ color: "#9ca3af" }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "13px",
                color: "#374151"
              }}
            />

            <Line
              type="monotone"
              dataKey="generation"
              stroke="#16a34a"
              strokeWidth={2.5}
              dot={false}
              name="Solar Generation (kW)"
            />

            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={false}
              name="Load Consumption (kW)"
            />

            <Line
              type="monotone"
              dataKey="grid_import"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Grid Import (kW)"
            />

            <Line
              type="monotone"
              dataKey="battery_discharge"
              stroke="#7c3aed"
              strokeWidth={2}
              dot={false}
              name="Battery Discharge (kW)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="pi-trend-kpi">
      <div className="pi-trend-kpi-label">{label}</div>
      <div className="pi-trend-kpi-value">{value}</div>
    </div>
  );
}