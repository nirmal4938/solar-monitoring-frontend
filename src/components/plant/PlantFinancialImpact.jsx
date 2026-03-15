import "./plantExecutive.css";

export default function PlantFinancialImpact({ data }) {
  const f = data.plants[0].financial_impact;

  return (
    <div className="exec-card accent-finance">
      <div className="exec-title">Financial Impact (Today)</div>

      <div className="exec-grid-4">
        <Metric label="Revenue" value={`₹${f.revenue_today}`} />
        <Metric label="Export Credit" value={`₹${f.export_credit_today}`} />
        <Metric label="Import Cost" value={`₹${f.grid_import_cost_today}`} />
        <Metric label="Net Savings" value={`₹${f.adjusted_net_savings_today}`} />
      </div>

      <div className="exec-divider" />

      <div className="exec-sub">
        Projected Monthly Savings: ₹{f.projected_monthly_savings}
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