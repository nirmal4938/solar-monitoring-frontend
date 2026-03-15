import "./InverterPerformance.css";

export default function InverterPerformance({ data }) {
  if (!data?.inverters?.length) {
    return (
      <div className="performance-container">
        <div className="card empty-state">
          No performance analytics available
        </div>
      </div>
    );
  }

  return (
    <div className="performance-container">

      {/* HEADER */}
      <div className="card performance-header">
        <div>
          <h2 className="performance-title">
            Inverter Performance Analytics
          </h2>
          <p className="performance-subtitle">
            Generation, efficiency & forecast intelligence
          </p>
        </div>

        <div className="performance-badge">
          DAILY METRICS
        </div>
      </div>

      {/* GRID */}
      <div className="performance-grid">
        {data.inverters.map((inv) => (
          <div
            key={inv.identity.inverter_id}
            className={`card performance-card ${
              inv.realtime.status === "FAULT" ? "fault" : ""
            }`}
          >
            <div className="inv-name">
              {inv.identity.name}
            </div>

            <Metric
              label="Total Generation"
              value={`${inv.today_performance.total_generation_kwh} kWh`}
            />

            <Metric
              label="Performance Ratio"
              value={`${inv.today_performance.performance_ratio}%`}
              highlight={
                inv.today_performance.performance_ratio >= 80
              }
            />

            <Metric
              label="Efficiency"
              value={`${inv.today_performance.efficiency_pct}%`}
              highlight={
                inv.today_performance.efficiency_pct >= 95
              }
            />

            <Metric
              label="Forecast Deviation"
              value={`${inv.today_performance.forecast_deviation_pct}%`}
              negative={
                inv.today_performance.forecast_deviation_pct < 0
              }
            />
          </div>
        ))}
      </div>

    </div>
  );
}

function Metric({ label, value, highlight, negative }) {
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      <span
        className={`metric-value ${
          highlight ? "positive" : ""
        } ${negative ? "negative" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}