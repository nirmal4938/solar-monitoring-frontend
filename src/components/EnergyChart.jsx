// src/components/EnergyChart.jsx

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

export default function EnergyChart({ data, date }) {

  const startOfDay = new Date(`${date}T00:00:00`).getTime();
  const endOfDay = new Date(`${date}T23:59:59`).getTime();

  const ticks = generateFixedTicks(date);

  // 🔹 Convert interval energy → cumulative energy curve
  let cumulative = 0;
  const cumulativeData = data.map((d) => {
    cumulative += d.energy_kwh || 0;
    return {
      ...d,
      cumulativeEnergy: Number(cumulative.toFixed(3))
    };
  });

  const totalEnergy = cumulativeData.length
    ? cumulativeData[cumulativeData.length - 1].cumulativeEnergy
    : 0;

  return (
    <ResponsiveContainer width="100%" height={380}>
      <ComposedChart data={cumulativeData}>

        {/* 🌈 Gradient Fill */}
        <defs>
          <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.05}/>
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
          unit=" kWh"
          domain={[0, totalEnergy ? totalEnergy * 1.15 : 100]}
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => v.toFixed(0)}
        />

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            backgroundColor: "#111827",
            borderRadius: 8,
            border: "none",
            color: "#fff"
          }}
          formatter={(v) => [`${v.toFixed(2)} kWh`, "Cumulative Energy"]}
          labelFormatter={(t) =>
            new Date(t).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit"
            })
          }
        />

        {/* 📍 End of Day Total Marker */}
        {totalEnergy > 0 && (
          <ReferenceLine
            y={totalEnergy}
            stroke="#16a34a"
            strokeDasharray="5 5"
            label={{
              value: `Total: ${totalEnergy.toFixed(2)} kWh`,
              position: "right",
              fill: "#16a34a"
            }}
          />
        )}

        {/* 🌿 Area Fill */}
        <Area
          type="monotone"
          dataKey="cumulativeEnergy"
          stroke="none"
          fill="url(#energyGradient)"
        />

        {/* 🔋 Main Line */}
        <Line
          type="monotone"
          dataKey="cumulativeEnergy"
          stroke="#16a34a"
          strokeWidth={3}
          dot={false}
          activeDot={{
            r: 6,
            fill: "#16a34a",
            stroke: "#fff",
            strokeWidth: 2
          }}
        />

      </ComposedChart>
    </ResponsiveContainer>
  );
}