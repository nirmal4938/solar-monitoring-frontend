import "./InverterFinancialImpact.css";

export function InverterFinancialImpact({ data }) {
  if (!data?.inverters?.length) return null;

  return (
    <div className="inverter-container">

      <div className="card financial-header">
        <div>
          <h2 className="financial-title">Inverter Financial Impact</h2>
          <p className="financial-subtitle">
            Revenue & export performance analysis
          </p>
        </div>

        <div className="finance-badge">
          FINANCE
        </div>
      </div>

      <div className="financial-grid">
        {data.inverters.map(inv => (
          <Stat
            key={inv.identity.inverter_id}
            label={inv.identity.name}
            value={`₹ ${inv.financial_impact.revenue_today}`}
            type="positive"
          />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, type }) {
  return (
    <div className={`card stat-card ${type}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}