import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
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

const SUNRISE_TIME = "05:30:00";
const SUNSET_TIME = "18:30:00";

export default function SolarChart({ data, date, now, isToday }) {

  const startOfDay = new Date(`${date}T00:00:00`).getTime();
  const endOfDay = new Date(`${date}T23:59:59`).getTime();

  const ticks = generateFixedTicks(date);

  const peak = data?.length
    ? Math.max(...data.map((d) => d.power))
    : 0;

  return (
    <ResponsiveContainer width="100%" height={440}>
      <ComposedChart data={data}>

        {/* 🌈 Gradient Definition */}
        <defs>
          <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.05}/>
          </linearGradient>
        </defs>

        <CartesianGrid 
          stroke="#e5e7eb"
          strokeDasharray="4 4"
          vertical={false}
        />

        {/* X Axis */}
        <XAxis
          dataKey="time"
          type="number"
          scale="time"
          domain={[startOfDay, endOfDay]}
          ticks={ticks}
          tick={{ fontSize: 12 }}
          tickFormatter={(t) =>
            new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            })
          }
        />

        {/* Y Axis */}
        <YAxis
          domain={[0, peak ? peak + peak * 0.15 : 100]}
          unit=" kW"
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => Math.round(v)}
        />

        {/* 🌤 Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            borderRadius: 8,
            border: "none",
            color: "#fff"
          }}
          formatter={(v) => [`${v.toFixed(2)} kW`, "Power"]}
          labelFormatter={(t) =>
            new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          }
        />

        {/* 🌅 Sunrise */}
        <ReferenceLine
          x={new Date(`${date}T${SUNRISE_TIME}`).getTime()}
          stroke="#f59e0b"
          strokeDasharray="5 5"
          label={{ value: "Sunrise", position: "top", fill: "#f59e0b" }}
        />

        {/* 🌇 Sunset */}
        <ReferenceLine
          x={new Date(`${date}T${SUNSET_TIME}`).getTime()}
          stroke="#ef4444"
          strokeDasharray="5 5"
          label={{ value: "Sunset", position: "top", fill: "#ef4444" }}
        />

        {/* 🟡 Current Time Line */}
        {isToday && (
          <ReferenceLine
            x={now.getTime()}
            stroke="#10b981"
            strokeWidth={2}
            label={{
              value: "Now",
              position: "top",
              fill: "#10b981"
            }}
          />
        )}

        {/* 🌄 Area Under Curve */}
        <Area
          type="monotone"
          dataKey="power"
          stroke="none"
          fill="url(#solarGradient)"
        />

        {/* 🔆 Main Line */}
        <Line
          type="monotone"
          dataKey="power"
          stroke="#f59e0b"
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#f59e0b",
            stroke: "#fff",
            strokeWidth: 2
          }}
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
}