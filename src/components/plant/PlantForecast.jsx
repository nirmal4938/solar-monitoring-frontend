import "./plantExecutive.css";

export default function PlantForecast({ data }) {
  const f = data.plants[0].forecast;

  return (
    <div className="exec-card accent-energy">
      <div className="exec-title">Forecast vs Actual</div>

      <div className="exec-grid-3">
        <Metric label="Expected" value={`${f.expected_generation_kwh} kWh`} />
        <Metric label="Actual" value={`${f.actual_generation_kwh} kWh`} />
        <Metric label="Deviation" value={`${f.deviation_pct}%`} />
      </div>

      <div className="exec-divider" />

      <div className="exec-sub">
        Confidence: {f.confidence_pct}%
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