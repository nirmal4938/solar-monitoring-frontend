import "./BatteryAIScores.css";

export default function BatteryAIScores({ data }) {
  if (!data || !data.batteries?.length) {
    return (
      <div className="ai-container">
        <div className="card empty-state">
          No AI score data available
        </div>
      </div>
    );
  }

  const ai = data.batteries[0].ai_scores;

  return (
    <div className="ai-container">

      {/* HEADER */}
      <div className="card ai-header">
        <div>
          <h2 className="ai-title">AI Intelligence Scores</h2>
          <p className="ai-subtitle">
            Predictive optimization & performance scoring engine
          </p>
        </div>

        <div className="ai-badge">
          AI MODEL
        </div>
      </div>

      {/* GRID */}
      <div className="ai-grid">
        <Stat label="Efficiency Score" value={ai.battery_efficiency_score} />
        <Stat label="Arbitrage Score" value={ai.arbitrage_optimization_score} />
        <Stat label="Peak Shaving Score" value={ai.peak_shaving_score} />
        <Stat label="Health Score" value={ai.battery_health_score} />
      </div>

      {/* MODEL VERSION */}
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

      <div className="score-bar">
        <div
          className="score-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}