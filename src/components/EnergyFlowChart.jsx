import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

const VISUAL_INTERVAL_MIN = 15;

function generateTicks(date) {
  const ticks = [];
  const start = new Date(`${date}T00:00:00`).getTime();
  const end = new Date(`${date}T23:59:59`).getTime();
  const interval = VISUAL_INTERVAL_MIN * 60 * 1000;

  for (let t = start; t <= end; t += interval) {
    ticks.push(t);
  }

  return ticks;
}

export default function EnergyFlowChart({ data = [], date, now, isToday }) {

  /* ==============================
     🔥 NORMALIZE BACKEND DATA
  ============================== */

  const normalizedData = data.map(d => ({
    time: new Date(d.timestamp).getTime(),
    demand: d.load_kw ?? 0,
    generation: d.generation_kw ?? 0,
    gridImport: d.grid_import_kw ?? 0,
    gridExport: d.grid_export_kw ?? 0
  }));

  const ticks = generateTicks(date);

  return (
    <ResponsiveContainer width="100%" height={450}>
      <ComposedChart data={normalizedData}>

        <CartesianGrid
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          vertical={false}
        />

        <XAxis
          dataKey="time"
          type="number"
          domain={["dataMin", "dataMax"]}
          scale="time"
          ticks={ticks}
          tickFormatter={(t) =>
            new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          }
        />

        <YAxis unit=" kW" />

        <Tooltip
          labelFormatter={(label) =>
            new Date(label).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          }
        />

        {isToday && now && (
          <ReferenceLine
            x={now.getTime()}
            stroke="#10b981"
            strokeWidth={2}
          />
        )}

        {/* Solar Generation */}
        <Area
          type="monotone"
          dataKey="generation"
          fill="#fbbf24"
          stroke="#f59e0b"
          fillOpacity={0.3}
        />

        {/* Load */}
        <Line
          type="monotone"
          dataKey="demand"
          stroke="#3b82f6"
          strokeWidth={3}
          dot={false}
        />

        {/* Grid Import */}
        <Line
          type="monotone"
          dataKey="gridImport"
          stroke="#dc2626"
          strokeWidth={2}
          dot={false}
        />

        {/* Grid Export */}
        <Line
          type="monotone"
          dataKey="gridExport"
          stroke="#16a34a"
          strokeWidth={2}
          dot={false}
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
}