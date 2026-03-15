import "./plantExecutive.css";

export default function PlantCarbonImpact({ data }) {
  const c = data.plants[0].carbon_impact;

  return (
    <div className="exec-card accent-carbon">
      <div className="exec-title">Carbon Impact</div>

      <div className="exec-grid-3">
        <Metric label="Avoided Emissions" value={`${c.avoided_emissions_tonnes} t`} />
        <Metric label="Trees Equivalent" value={c.trees_equivalent} />
        <Metric label="Carbon Intensity" value={`${c.carbon_intensity_kg_per_kwh} kg/kWh`} />
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