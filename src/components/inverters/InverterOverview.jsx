import "./InverterOverview.css";

export function InverterOverview({ data }) {
  if (!data) return null;

  const summary = data.summary;

  return (
    <div className="inverter-container">

      {/* HEADER */}
      <div className="card header-card">
        <div>
          <h2 className="title">Inverter Energy Overview</h2>
          <p className="subtitle">
            Real-time inverter fleet monitoring
          </p>
        </div>

        <div className="badge success">
          {summary.online_count} Online
        </div>
      </div>

      {/* SUMMARY GRID */}
      <div className="grid">
        <StatCard label="Total Inverters" value={summary.inverter_count} />
        <StatCard label="Fault Count" value={summary.fault_count} />
        <StatCard label="Total Capacity (kW)" value={summary.total_capacity_kw} />
        <StatCard label="Active Alerts" value={summary.active_alerts} />
        <StatCard label="Plant PR (%)" value={summary.plant_performance_ratio} />
        <StatCard label="Availability (%)" value={summary.availability_pct} />
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card stat-card">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
    </div>
  );
}