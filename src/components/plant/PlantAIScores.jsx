import "./plantExecutive.css";

export default function PlantAIScores({ data }) {
  const ai = data.plants[0].ai_scores;

  return (
    <div className="exec-card accent-ai">
      <div className="exec-title">AI Intelligence Scores</div>

      <div className="exec-grid-4">
        <Metric label="Efficiency" value={ai.energy_efficiency_score} />
        <Metric label="Reliability" value={ai.reliability_score} />
        <Metric label="Battery Health" value={ai.battery_health_score} />
        <Metric label="Anomaly Index" value={ai.anomaly_score} />
      </div>

      <div className="exec-divider" />

      <div className="exec-sub">
        Model Version: {ai.ai_model_version}
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