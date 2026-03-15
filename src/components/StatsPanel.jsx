export default function StatsPanel({
  totalEnergy,
  peakPower,
  trend,
  now,
  isToday,
}) {
  return (
    <div style={{ marginBottom: 15 }}>
      🔋 <strong>Total Energy:</strong>{" "}
      {totalEnergy.toFixed(2)} kWh <br />
      ⚡ <strong>Peak Power:</strong>{" "}
      {peakPower.toFixed(2)} kW <br />
      {isToday && (
        <>
          🧭 <strong>Trend:</strong> {trend} <br />
          ⏱ <strong>Now:</strong>{" "}
          {now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </>
      )}
    </div>
  );
}