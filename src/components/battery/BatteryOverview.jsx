import "./BatteryOverview.css";

export default function BatteryOverview({ data }) {
  if (!data || !data.summary || !data.batteries?.length) {
    return (
      <div className="battery-container">
        <div className="card empty-state">
          No battery data available
        </div>
      </div>
    );
  }

  const summary = data.summary;
  const battery = data.batteries[0];

  const getStatusClass = (status) => {
    switch (status) {
      case "CHARGING":
        return "status charging";
      case "DISCHARGING":
        return "status discharging";
      case "FAULT":
        return "status fault";
      default:
        return "status idle";
    }
  };

  const alertClass =
    summary.active_alerts > 0 ? "badge danger" : "badge success";

  return (
    <div className="battery-container">

      {/* HEADER */}
      <div className="card header-card">
        <div>
          <h2 className="title">Battery Energy Overview</h2>
          <p className="subtitle">
            Real-time storage monitoring dashboard
          </p>
        </div>

        <div className={getStatusClass(battery.realtime.status)}>
          {battery.realtime.status}
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid">
        <StatCard label="Total Capacity (kWh)" value={summary.total_capacity_kwh} />
        <StatCard label="Battery Count" value={summary.battery_count} />
        <StatCard
          label="Active Alerts"
          value={summary.active_alerts}
          badgeClass={alertClass}
        />
        <StatCard
          label="Average Health (%)"
          value={summary.overall_battery_health_avg}
        />
      </div>

      {/* REALTIME SECTION */}
      <div className="card">
        <h3 className="section-title">Real-Time Metrics</h3>

        <div className="grid">
          <MetricCard
            label="State of Charge (%)"
            value={battery.realtime.soc_percent}
            progress={battery.realtime.soc_percent}
          />

          <MetricCard
            label="Temperature (°C)"
            value={battery.realtime.battery_temperature_c}
          />

          <MetricCard
            label="Cycle Count"
            value={battery.realtime.cycle_count}
          />

          <MetricCard
            label="Health (%)"
            value={battery.realtime.health_pct}
            progress={battery.realtime.health_pct}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, badgeClass }) {
  return (
    <div className="card stat-card">
      <p className="label">{label}</p>
      <div className="stat-row">
        <span className="value">{value}</span>
        {badgeClass && <span className={badgeClass}>{value}</span>}
      </div>
    </div>
  );
}

function MetricCard({ label, value, progress }) {
  return (
    <div className="card metric-card">
      <p className="label">{label}</p>
      <p className="value">{value}</p>

      {progress !== undefined && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}