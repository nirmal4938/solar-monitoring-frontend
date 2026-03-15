import "./plantExecutive.css";

export default function PlantOverview({ data }) {
  const plant = data.plants[0];
  const s = plant.summary;

  return (
    <div className="exec-card accent-energy">
      <div className="exec-header">
        <div>
          <div className="exec-title">{plant.identity.plant_name}</div>
          <div className="exec-sub">
            {plant.identity.location} • {plant.identity.capacity_kw} kW
          </div>
        </div>
        <div className="exec-value">
          {s.overall_intelligence_score}
        </div>
      </div>

      <div className="exec-grid-3">
        <Metric label="Generation" value={`${s.today_generation_kwh} kWh`} />
        <Metric label="Consumption" value={`${s.today_consumption_kwh} kWh`} />
        <Metric label="Availability" value={`${s.availability_pct}%`} />
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