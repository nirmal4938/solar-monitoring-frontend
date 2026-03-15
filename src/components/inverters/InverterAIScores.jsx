import "./InverterAIScores.css";

export function InverterAIScores({ data }) {
  if (!data?.inverters?.length) return null;

  const inv = data.inverters[0];
  const ai = inv.ai_scores;

  return (
    <div className="inverter-container">

      <div className="card ai-header">
        <div>
          <h2 className="ai-title">AI Intelligence Scores</h2>
          <p className="ai-subtitle">
            Predictive inverter performance engine
          </p>
        </div>

        <div className="ai-badge">
          AI MODEL
        </div>
      </div>

      <div className="ai-grid">
        <Stat label="Efficiency Score" value={ai.energy_efficiency_score} />
        <Stat label="Reliability Score" value={ai.reliability_score} />
        <Stat label="Anomaly Score" value={ai.anomaly_score} />
        <Stat label="Overall Score" value={ai.overall_intelligence_score} />
      </div>

      <div className="model-version">
        Model Version: <strong>{ai.ai_model_version}</strong>
      </div>

    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}