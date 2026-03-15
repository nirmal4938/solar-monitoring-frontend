import "./BatteryTrendChart.css";
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

export default function BatteryTrendChart({ data }) {
  if (!data || !data.batteries?.length) {
    return (
      <div className="trend-container">
        <div className="card empty-state">
          No trend data available
        </div>
      </div>
    );
  }

  const trend = data.batteries[0].trend;

  const chartData = trend.soc.map((soc, index) => ({
    hour: `H${index + 1}`,
    soc,
    charge: trend.charge_kw[index],
    discharge: trend.discharge_kw[index]
  }));

  return (
    <div className="trend-container">

      {/* HEADER */}
      <div className="card trend-header">
        <div>
          <h2 className="trend-title">
            Battery Trend Analysis
          </h2>
          <p className="trend-subtitle">
            Charge, discharge & state-of-charge monitoring
          </p>
        </div>

        <div className="trend-range">
          {trend.range}
        </div>
      </div>

      {/* CHART CARD */}
      <div className="card chart-card">
        <ResponsiveContainer width="100%" height={380}>
          <LineChart data={chartData}>
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 4" />
            <XAxis
              dataKey="hour"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="soc"
              stroke="#1f2937"
              strokeWidth={2}
              dot={false}
              name="State of Charge"
            />

            <Line
              type="monotone"
              dataKey="charge"
              stroke="#059669"
              strokeWidth={2}
              dot={false}
              name="Charge (kW)"
            />

            <Line
              type="monotone"
              dataKey="discharge"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              name="Discharge (kW)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}