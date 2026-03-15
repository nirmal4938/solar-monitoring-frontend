import "./InverterTrendChart.css";
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

export default function InverterTrendChart({ data }) {
  if (!data || !data.inverters?.length) {
    return (
      <div className="trend-container">
        <div className="card empty-state">
          No inverter trend data available
        </div>
      </div>
    );
  }

  const trend = data.inverters[0].trend;

  const chartData = trend.power_kw.map((power, index) => ({
    hour: `H${index + 1}`,
    power,
    voltage: trend.voltage_v[index],
    temperature: trend.temperature_c[index]
  }));

  return (
    <div className="trend-container">

      {/* HEADER */}
      <div className="card trend-header">
        <div>
          <h2 className="trend-title">
            Inverter Power Trend
          </h2>
          <p className="trend-subtitle">
            Power output, voltage & thermal behavior (24H)
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
              dataKey="power"
              stroke="#1f2937"
              strokeWidth={2}
              dot={false}
              name="Power (kW)"
            />

            <Line
              type="monotone"
              dataKey="voltage"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="Voltage (V)"
            />

            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#dc2626"
              strokeWidth={2}
              dot={false}
              name="Temperature (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}