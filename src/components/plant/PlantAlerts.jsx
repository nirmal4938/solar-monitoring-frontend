import "./plantExecutive.css";

export default function PlantAlerts({ data }) {
  const a = data.plants[0].alerts_summary;

  return (
    <div className="exec-card accent-danger">
      <div className="exec-title">Active Alerts</div>

      <div className="exec-grid-4">
        <Metric label="Total" value={a.total_active} />
        <Metric label="High" value={a.high} />
        <Metric label="Medium" value={a.medium} />
        <Metric label="Low" value={a.low} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="exec-sub">{label}</div>
      <div className="exec-value">{value}</div>
    </div>
  );
}