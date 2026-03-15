import "./plantExecutive.css";

export default function PlantMaintenance({ data }) {
  const plant = data.plants[0];
  const m = plant.maintenance_summary;
  const summary = plant.summary;

  const nextServiceDate = new Date(m.predicted_next_service_date);
  const today = new Date();
  const daysToService = Math.ceil(
    (nextServiceDate - today) / (1000 * 60 * 60 * 24)
  );

  const urgencyClass =
    daysToService <= 15 ? "accent-danger" : "accent-energy";

  return (
    <div className={`exec-card ${urgencyClass}`}>
      <div className="exec-header">
        <div>
          <div className="exec-title">Maintenance Intelligence</div>
          <div className="exec-sub">
            {plant.identity.plant_name} • O&M Status
          </div>
        </div>

        <div className="exec-value">
          {summary.open_maintenance_items}
        </div>
      </div>

      <div className="exec-grid-3">
        <Metric
          label="Open Items"
          value={m.open_items}
        />

        <Metric
          label="Monthly Cost"
          value={`₹${m.total_cost_this_month.toLocaleString()}`}
        />

        <Metric
          label="Next Service"
          value={m.predicted_next_service_date}
        />
      </div>

      <div className="exec-divider" />

      <div className="exec-grid-3">
        <Metric
          label="Days to Service"
          value={daysToService}
        />

        <Metric
          label="Plant Availability"
          value={`${summary.availability_pct}%`}
        />

        <Metric
          label="Active Alerts"
          value={summary.active_alerts}
        />
      </div>

      <div className="exec-divider" />

      <div className="exec-sub">
        Commissioned: {plant.identity.commissioning_date} •
        Status: {plant.identity.status}
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