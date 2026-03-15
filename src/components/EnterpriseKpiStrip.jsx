function KpiCard({ label, value, accent, subValue }) {
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      padding: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      borderLeft: `4px solid ${accent || "#e5e7eb"}`
    }}>
      <span style={{
        fontSize: 12,
        color: "#6b7280",
        fontWeight: 500,
        letterSpacing: 0.3
      }}>
        {label}
      </span>

      <span style={{
        fontSize: 20,
        fontWeight: 700,
        color: "#111827"
      }}>
        {value}
      </span>

      {subValue && (
        <span style={{
          fontSize: 12,
          color: "#9ca3af"
        }}>
          {subValue}
        </span>
      )}
    </div>
  );
}

export default function EnterpriseKpiStrip({
  data
}) {
  const {
    totalGeneration,
    totalConsumption,
    gridImport,
    gridExport,
    selfConsumptionRatio,
    revenue,
    savings,
    netBalance,
    systemHealth,
    alertsCount
  } = data;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 18
    }}>

      <KpiCard
        label="Total Generation"
        value={`${totalGeneration.toFixed(2)} kWh`}
        accent="#f59e0b"
      />

      <KpiCard
        label="Total Consumption"
        value={`${totalConsumption.toFixed(2)} kWh`}
        accent="#3b82f6"
      />

      <KpiCard
        label="Grid Import"
        value={`${gridImport.toFixed(2)} kWh`}
        accent="#ef4444"
      />

      <KpiCard
        label="Grid Export"
        value={`${gridExport.toFixed(2)} kWh`}
        accent="#10b981"
      />

      <KpiCard
        label="Self Consumption"
        value={`${selfConsumptionRatio.toFixed(1)} %`}
        accent="#8b5cf6"
      />

      <KpiCard
        label="Revenue"
        value={`₹ ${revenue.toFixed(2)}`}
        accent="#16a34a"
      />

      <KpiCard
        label="Savings"
        value={`₹ ${savings.toFixed(2)}`}
        accent="#059669"
      />

      <KpiCard
        label="Net Balance"
        value={`₹ ${netBalance.toFixed(2)}`}
        accent={netBalance >= 0 ? "#16a34a" : "#dc2626"}
      />

      <KpiCard
        label="System Health"
        value={systemHealth}
        subValue={`Active Alerts: ${alertsCount}`}
        accent={systemHealth === "HEALTHY" ? "#16a34a" : "#dc2626"}
      />

    </div>
  );
}