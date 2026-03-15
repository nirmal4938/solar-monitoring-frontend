import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
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

export default function IrradiancePowerChart({ data = [], date }) {

  const startOfDay = new Date(`${date}T00:00:00`).getTime();
  const endOfDay = new Date(`${date}T23:59:59`).getTime();
  const ticks = generateFixedTicks(date);

  // ✅ FIXED FIELD MAPPING
  const formatted = data.map(d => ({
    time: new Date(d.timestamp).getTime(),  // numeric time
    power: d.power_kw ?? 0,
    irradiance: d.irradiance_wm2 ?? 0
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
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
          yAxisId="left"
          unit=" kW"
        />

        <YAxis
          yAxisId="right"
          orientation="right"
          unit=" W/m²"
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            borderRadius: 8,
            border: "none",
            color: "#fff"
          }}
        />

        <Bar
          yAxisId="right"
          dataKey="irradiance"
          fill="#facc15"
          name="Irradiance"
        />

        <Line
          yAxisId="left"
          type="monotone"
          dataKey="power"
          stroke="#f97316"
          strokeWidth={3}
          dot={false}
          name="Power"
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
}