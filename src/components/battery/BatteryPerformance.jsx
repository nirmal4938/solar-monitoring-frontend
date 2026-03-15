import "./BatteryPerformance.css";

export default function BatteryPerformance({ data }) {
  if (!data || !data.batteries?.length) {
    return (
      <div className="performance-container">
        <div className="card empty-state">
          No performance data available
        </div>
      </div>
    );
  }

  const perf = data.batteries[0].today_performance;

  return (
    <div className="performance-container">

      <div className="card performance-header">
        <div>
          <h2 className="performance-title">Today's Battery Performance</h2>
          <p className="performance-subtitle">
            Operational efficiency & energy throughput metrics
          </p>
        </div>

        <div className="date-badge">
          LIVE
        </div>
      </div>

      <div className="performance-grid">
        <Stat label="Charge Energy (kWh)" value={perf.battery_charge_kwh} />
        <Stat label="Discharge Energy (kWh)" value={perf.battery_discharge_kwh} />
        <Stat label="Round Trip Loss (kWh)" value={perf.battery_round_trip_loss_kwh} />
        <Stat label="Utilization (%)" value={perf.battery_utilization_pct} />
        <Stat label="Peak Discharge (kW)" value={perf.peak_battery_discharge_kw} />
        <Stat label="Demand Reduction (kW)" value={perf.demand_charge_reduction_kw} />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}