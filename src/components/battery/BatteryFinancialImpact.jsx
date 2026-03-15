import "./BatteryFinancialImpact.css";

export default function BatteryFinancialImpact({ data }) {
  if (!data || !data.batteries?.length) {
    return (
      <div className="financial-container">
        <div className="card empty-state">
          No financial data available
        </div>
      </div>
    );
  }

  const financial = data.batteries[0].financial_impact;
  const currency = financial.currency;

  return (
    <div className="financial-container">

      {/* HEADER */}
      <div className="card financial-header">
        <div>
          <h2 className="financial-title">Battery Financial Impact</h2>
          <p className="financial-subtitle">
            Revenue optimization & cost impact analysis
          </p>
        </div>

        <div className="finance-badge">
          FINANCE
        </div>
      </div>

      {/* GRID */}
      <div className="financial-grid">
        <Stat
          label="Arbitrage Savings"
          value={`${currency} ${financial.battery_arbitrage_savings}`}
          type="positive"
        />

        <Stat
          label="Demand Charge Savings"
          value={`${currency} ${financial.demand_charge_savings}`}
          type="positive"
        />

        <Stat
          label="Battery Degradation Cost"
          value={`${currency} ${financial.battery_degradation_cost}`}
          type="negative"
        />

        <Stat
          label="Adjusted Net Bill"
          value={`${currency} ${financial.adjusted_net_bill_amount}`}
        />
      </div>
    </div>
  );
}

function Stat({ label, value, type }) {
  return (
    <div className={`card stat-card ${type || ""}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}