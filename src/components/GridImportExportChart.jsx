import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

const VISUAL_INTERVAL_MIN = 15;

function generateFixedTicks(date) {
  const ticks = [];
  const start = new Date(`${date}T00:00:00`).getTime();
  const end = new Date(`${date}T23:59:59`).getTime();
  const interval = VISUAL_INTERVAL_MIN * 60 * 1000;

  for (let t = start; t <= end; t += interval) {
    ticks.push(t);
  }
  return ticks;
}

export default function GridImportExportChart({ data = [], date }) {

  const startOfDay = new Date(`${date}T00:00:00`).getTime();
  const endOfDay = new Date(`${date}T23:59:59`).getTime();
  const ticks = generateFixedTicks(date);

  // ✅ FIXED FIELD MAPPING
  const formatted = data.map(d => ({
    time: new Date(d.timestamp).getTime(), // convert timestamp to numeric
    gridImport: -(d.import_kw || 0),       // negative for visual
    gridExport: d.export_kw || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={formatted}>

        <CartesianGrid
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="time"
          type="number"
          scale="time"
          domain={[startOfDay, endOfDay]}
          ticks={ticks}
          tickFormatter={(t) =>
            new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          }
        />

        <YAxis
          unit=" kW"
          tickFormatter={(v) => Math.abs(v).toFixed(1)}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            borderRadius: 8,
            border: "none",
            color: "#fff"
          }}
          formatter={(v, name) => [
            `${Math.abs(v).toFixed(2)} kW`,
            name === "gridExport" ? "Export" : "Import"
          ]}
        />

        <ReferenceLine y={0} stroke="#9ca3af" />

        <Bar
          dataKey="gridExport"
          fill="#10b981"
          name="gridExport"
          radius={[4, 4, 0, 0]}
        />

        <Bar
          dataKey="gridImport"
          fill="#ef4444"
          name="gridImport"
          radius={[4, 4, 0, 0]}
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
}