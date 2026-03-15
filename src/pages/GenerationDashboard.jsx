import { useState, useEffect, useMemo } from "react";
import { useClock } from "../hooks/useClock";
import { useSolarData } from "../hooks/useSolarData";
// import { PLANT_ID } from "../constants/solarConstants";
import SolarChart from "../components/SolarChart";
import EnergyChart from "../components/EnergyChart";
import { useEditAlerts } from "../hooks/useEditAlerts";
import GridImportExportChart from "../components/GridImportExportChart";
import IrradiancePowerChart from "../components/IrradiancePowerChart";
import InverterContributionChart from "../components/InverterContributionChart";

function getTodayInTimezone(tz) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz
  }).format(new Date());
}

function getLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().split("T")[0];
}

const safe = (v) =>
  typeof v === "number" && !isNaN(v) ? v : 0;

export default function GenerationDashboard() {
  const PLANT_ID = localStorage.getItem('selectedPlantId');
  const defaultTz =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [timezone] = useState(defaultTz);
  const [date, setDate] = useState(getLocalISODate());

  const now = useClock();

  const {
    data,
    totalEnergy,
    peakPower,
    currentPower,
    availability,
    performanceRatio,
    specificYield,
    cuf,
    co2Saved,
    selfConsumptionPct,
    gridImport,
    gridExport,
    revenueToday,
    savingsToday,
    netBillProjection,
    gridImportExportData,
    IrradiancePowerData,
    inverterContributionData,
    loading,
    error,
    refresh
  } = useSolarData(PLANT_ID, date, timezone);

  const {
    activeAlerts,
    activeCount,
    acknowledge,
    resolve
  } = useEditAlerts(PLANT_ID);

  /* ================= SECTION C – CARBON & ESG ================= */

const ESG_CARBON_FACTOR_GRID = 0.82; // kg CO2 per kWh (India avg)
const TREE_CO2_PER_YEAR = 21; // kg CO2 absorbed per tree annually
const CARBON_CREDIT_PRICE = 1200; // ₹ per ton

const esgData = useMemo(() => {
  if (!Array.isArray(data) || data.length === 0) return null;

  const totalEnergyKwh = safe(totalEnergy);
  const co2Kg = totalEnergyKwh * ESG_CARBON_FACTOR_GRID;

  const co2Ton = co2Kg / 1000;

  const treesEquivalent = co2Kg / TREE_CO2_PER_YEAR;

  const carbonRevenue = co2Ton * CARBON_CREDIT_PRICE;

  // Emission intensity comparison
  const plantIntensity = totalEnergyKwh > 0
    ? (co2Kg / totalEnergyKwh)
    : 0;

  const gridIntensity = ESG_CARBON_FACTOR_GRID;

  const improvementPct = gridIntensity > 0
    ? ((gridIntensity - plantIntensity) / gridIntensity) * 100
    : 0;

  // Annualized projection
  const annualEnergy = totalEnergyKwh * 365;
  const annualCO2 = co2Ton * 365;
  const annualRevenue = carbonRevenue * 365;

  // ESG Score logic (0–100)
  let esgScore = 50;

  if (improvementPct > 80) esgScore += 20;
  if (annualCO2 > 1000) esgScore += 10;
  if (safe(performanceRatio) > 70) esgScore += 10;
  if (safe(availability) > 95) esgScore += 10;

  if (esgScore > 100) esgScore = 100;

  const grade =
    esgScore >= 85 ? "AAA" :
    esgScore >= 75 ? "AA" :
    esgScore >= 65 ? "A" :
    esgScore >= 50 ? "BBB" : "BB";

  // CO2 trend for chart
  const co2Trend = data.map(d => ({
    time: new Date(d.timestamp).getTime(),
    co2: safe(d.energy_kwh) * ESG_CARBON_FACTOR_GRID
  }));

  return {
    co2Kg,
    co2Ton,
    treesEquivalent,
    carbonRevenue,
    improvementPct,
    annualEnergy,
    annualCO2,
    annualRevenue,
    esgScore,
    grade,
    co2Trend
  };

}, [
  data,
  totalEnergy,
  performanceRatio,
  availability
]);
  const isToday = date === getTodayInTimezone(timezone);
  const dataPoints = Array.isArray(data) ? data.length : 0;

  useEffect(() => {
    if (!isToday) return;
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [isToday, refresh]);

  const chartData = useMemo(() => {
    return Array.isArray(data)
      ? data.map((d) => ({
          time: new Date(d.timestamp).getTime(),
          power: d.power_kw,
          energy_kwh: d.energy_kwh
        }))
      : [];
  }, [data]);

  /* ================= ENERGY INTELLIGENCE ================= */

const TARIFF_PER_KWH = 8; // configurable

const intelligence = useMemo(() => {
  if (!Array.isArray(data) || data.length === 0) return null;

  // Forecast model (irradiance based linear model)
  const forecastData = data.map(d => {
    const expectedPower = d.irradiance_wm2 > 0
      ? (d.irradiance_wm2 / 1000) * peakPower
      : 0;

    return {
      time: new Date(d.timestamp).getTime(),
      actual: d.power_kw,
      forecast: expectedPower
    };
  });

  const totalActual = data.reduce((sum, d) => sum + safe(d.energy_kwh), 0);

  const totalForecast = forecastData.reduce(
    (sum, d) => sum + safe(d.forecast) * (2/60), // 2-min approx interval to kWh
    0
  );

  const deviationPct = totalForecast > 0
    ? ((totalActual - totalForecast) / totalForecast) * 100
    : 0;

  const lossEnergy = Math.max(0, totalForecast - totalActual);
  const lossRs = lossEnergy * TARIFF_PER_KWH;

  // Simple anomaly detection
  const anomalies = forecastData.filter(d => {
    if (d.forecast === 0) return false;
    const diff = Math.abs(d.actual - d.forecast) / d.forecast;
    return diff > 0.30; // 30% deviation threshold
  });

  let riskLevel = "LOW";
  if (Math.abs(deviationPct) > 20) riskLevel = "HIGH";
  else if (Math.abs(deviationPct) > 10) riskLevel = "MEDIUM";

  return {
    forecastData,
    deviationPct,
    lossRs,
    anomalies,
    riskLevel
  };
}, [data, peakPower]);



  const netEnergyBalance =
    safe(gridExport) - safe(gridImport);
  return (
    <div style={styles.pageWrapper}>
      {/* ================= HEADER ================= */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.title}>
            Enterprise SCADA Dashboard
          </h2>
          <div style={styles.subInfo}>
            15-min Resolution • {dataPoints} points •
            Last updated: {now.toLocaleTimeString()}
          </div>
        </div>

        <input
          style={styles.dateInput}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {error && (
        <div style={styles.error}>
          Failed to load data.
        </div>
      )}

      {/* ================= ROW 1 – ENERGY KPIs ================= */}
      {!loading && (
        <>
          <SectionTitle title="Energy KPIs" />
          <div style={styles.kpiGrid}>
            <KpiCard label="Total Energy" value={`${safe(totalEnergy).toFixed(2)} kWh`} />
            <KpiCard label="Peak Power" value={`${safe(peakPower).toFixed(2)} kW`} />
            <KpiCard label="Current Power" value={`${safe(currentPower).toFixed(2)} kW`} />
            <KpiCard label="Availability" value={`${safe(availability).toFixed(2)}%`} />
            <KpiCard
              label="Net Energy Balance"
              value={`${safe(netEnergyBalance).toFixed(2)} kWh`}
              highlight={netEnergyBalance < 0}
            />
          </div>

          {/* ================= ROW 2 – PERFORMANCE KPIs ================= */}
          <SectionTitle title="Performance KPIs" />
          <div style={styles.kpiGrid}>
            <KpiCard label="Performance Ratio" value={`${safe(performanceRatio).toFixed(2)}%`} />
            <KpiCard label="Specific Yield" value={`${safe(specificYield).toFixed(2)} kWh/kWp`} />
            <KpiCard label="CUF" value={`${safe(cuf).toFixed(2)}%`} />
            <KpiCard label="Self Consumption" value={`${safe(selfConsumptionPct).toFixed(2)}%`} />
            <KpiCard label="CO₂ Saved" value={`${safe(co2Saved).toFixed(2)} t`} />
          </div>

          {/* ================= ROW 3 – FINANCIAL KPIs ================= */}
          <SectionTitle title="Financial KPIs" />
          <div style={styles.kpiGrid}>
            <KpiCard label="Today's Revenue" value={`₹ ${safe(revenueToday).toFixed(2)}`} />
            <KpiCard label="Today's Savings" value={`₹ ${safe(savingsToday).toFixed(2)}`} />
            <KpiCard label="Net Bill Projection" value={`₹ ${safe(netBillProjection).toFixed(2)}`} />
            <KpiCard label="Grid Import" value={`${safe(gridImport).toFixed(2)} kWh`} />
            <KpiCard label="Grid Export" value={`${safe(gridExport).toFixed(2)} kWh`} />
          </div>

{/* ================= SECTION C – CARBON & ESG ================= */}
{esgData && (
  <>
    <SectionTitle title="Carbon & ESG Intelligence" />

    <div style={styles.kpiGrid}>
      <KpiCard
        label="CO₂ Saved Today"
        value={`${esgData.co2Ton.toFixed(2)} t`}
      />

      <KpiCard
        label="Trees Equivalent"
        value={`${esgData.treesEquivalent.toFixed(0)} Trees`}
      />

      <KpiCard
        label="Carbon Credit Revenue"
        value={`₹ ${esgData.carbonRevenue.toFixed(2)}`}
      />

      <KpiCard
        label="Emission Reduction"
        value={`${esgData.improvementPct.toFixed(2)}%`}
      />

      <ESGBadge
        score={esgData.esgScore}
        grade={esgData.grade}
      />
    </div>

    <div style={styles.card}>
      <h4 style={styles.cardTitle}>
        CO₂ Trend
      </h4>
      <CO2TrendChart data={esgData.co2Trend} />
    </div>

    <div style={styles.kpiGrid}>
      <KpiCard
        label="Projected Annual Energy"
        value={`${esgData.annualEnergy.toFixed(0)} kWh`}
      />

      <KpiCard
        label="Projected Annual CO₂ Offset"
        value={`${esgData.annualCO2.toFixed(0)} t`}
      />

      <KpiCard
        label="Projected Annual Carbon Revenue"
        value={`₹ ${esgData.annualRevenue.toFixed(0)}`}
      />
    </div>
  </>
)}
          {/* ================= SECTION B – ENERGY INTELLIGENCE ================= */}
{intelligence && (
  <>
    <SectionTitle title="Energy Intelligence" />

    <div style={styles.kpiGrid}>
      <KpiCard
        label="Deviation %"
        value={`${intelligence.deviationPct.toFixed(2)} %`}
        highlight={Math.abs(intelligence.deviationPct) > 15}
      />

      <KpiCard
        label="Estimated Loss"
        value={`₹ ${intelligence.lossRs.toFixed(2)}`}
        highlight={intelligence.lossRs > 1000}
      />

      <KpiCard
        label="Anomaly Points"
        value={`${intelligence.anomalies.length}`}
        highlight={intelligence.anomalies.length > 5}
      />

      <RiskBadge level={intelligence.riskLevel} />
    </div>

    <div style={styles.card}>
      <h4 style={styles.cardTitle}>Forecast vs Actual</h4>
      <ForecastChart data={intelligence.forecastData} />
    </div>
  </>
)}

        </>
      )}

      {/* ================= MAIN GRID ================= */}
      {!loading && dataPoints > 0 && (
        <div style={styles.grid}>
          {/* LEFT */}
          <div style={styles.left}>
            <Card title="Power vs Time">
              <SolarChart
                data={chartData}
                date={date}
                now={now}
                isToday={isToday}
              />
            </Card>

            <Card title="Cumulative Energy">
              <EnergyChart
                data={chartData}
                date={date}
              />
            </Card>

   <Card title="Grid Import / Export">
  <GridImportExportChart
    data={gridImportExportData}
    date={date}
  />
</Card>

<Card title="Irradiance vs Power">
  <IrradiancePowerChart
    data={IrradiancePowerData}
    date={date}
  />
</Card>

<Card title="Inverter Contribution">
  <InverterContributionChart
    data={inverterContributionData}
  />
</Card>
          </div>

          {/* RIGHT */}
          <div style={styles.right}>
            <Card title="System Health">
              <StatusBadge
                status={
                  activeCount > 0
                    ? "FAULT"
                    : "HEALTHY"
                }
              />
            </Card>

            <Card title="Active Alerts">
              {activeCount === 0 ? (
                <p style={styles.muted}>
                  No active alerts
                </p>
              ) : (
                activeAlerts.map((alert) => (
                  <div
                    key={alert._id}
                    style={styles.alertBox}
                  >
                    <div style={styles.alertHeader}>
                      <span>
                        {alert.alert_type}
                      </span>
                      <StatusBadge status="FAULT" />
                    </div>
                    <div style={styles.alertMessage}>
                      {alert.message}
                    </div>
                    <div style={styles.alertActions}>
                      {alert.status ===
                        "ACTIVE" && (
                        <button
                          style={styles.btnWarn}
                          onClick={() =>
                            acknowledge(
                              alert._id
                            )
                          }
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        style={styles.btnDanger}
                        onClick={() =>
                          resolve(alert._id)
                        }
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}



/* ================= COMPONENTS ================= */

function ForecastChart({ data }) {
  return (
    <SolarChart
      data={data.map(d => ({
        time: d.time,
        power: d.actual,
        forecast: d.forecast
      }))}
    />
  );
}

function RiskBadge({ level }) {
  const colors = {
    LOW: "#16a34a",
    MEDIUM: "#f59e0b",
    HIGH: "#dc2626"
  };

  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>Deviation Risk</div>
      <div
        style={{
          padding: "6px 12px",
          borderRadius: 20,
          color: "#fff",
          background: colors[level],
          width: "fit-content",
          marginTop: 6
        }}
      >
        {level}
      </div>
    </div>
  );
}

function ESGBadge({ score, grade }) {
  const color =
    score >= 85 ? "#065f46" :
    score >= 75 ? "#047857" :
    score >= 65 ? "#065f46" :
    "#b45309";

  return (
    <div style={styles.kpiCard}>
      <div style={styles.kpiLabel}>ESG Grade</div>
      <div style={{
        fontSize: 22,
        fontWeight: 700,
        color,
        marginTop: 6
      }}>
        {grade} ({score})
      </div>
    </div>
  );
}

function CO2TrendChart({ data }) {
  return (
    <EnergyChart
      data={data.map(d => ({
        time: d.time,
        energy_kwh: d.co2
      }))}
    />
  );
}

function SectionTitle({ title }) {
  return (
    <h3 style={styles.sectionTitle}>
      {title}
    </h3>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.card}>
      <h4 style={styles.cardTitle}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function KpiCard({ label, value, highlight }) {
  return (
    <div
      style={{
        ...styles.kpiCard,
        borderColor: highlight
          ? "#dc2626"
          : "#e5e7eb"
      }}
    >
      <div style={styles.kpiLabel}>
        {label}
      </div>
      <div style={styles.kpiValue}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    HEALTHY: "#16a34a",
    FAULT: "#dc2626"
  };
  return (
    <span
      style={{
        ...styles.badge,
        backgroundColor:
          colors[status]
      }}
    >
      {status}
    </span>
  );
}

/* ================= STYLES ================= */

const styles = {
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: { margin: 0 },
  subInfo: {
    fontSize: 13,
    color: "#6b7280"
  },
  sectionTitle: {
    marginTop: 25,
    marginBottom: 10
  },
  dateInput: {
    padding: 6,
    borderRadius: 6,
    border: "1px solid #e5e7eb"
  },
  kpiGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 15
  },
  kpiCard: {
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    border: "1px solid #e5e7eb"
  },
  kpiLabel: {
    fontSize: 12,
    color: "#6b7280"
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: 600,
    marginTop: 5
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 20
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  right: {
    display: "flex",
    flexDirection: "column",
    gap: 20
  },
  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    border: "1px solid #e5e7eb"
  },
  cardTitle: {
    marginBottom: 10
  },
  muted: {
    fontSize: 13,
    color: "#6b7280"
  },
  badge: {
    padding: "4px 10px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 12
  },
  alertBox: {
    border: "1px solid #fecaca",
    background: "#fff5f5",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10
  },
  alertHeader: {
    display: "flex",
    justifyContent: "space-between"
  },
  alertMessage: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 8
  },
  alertActions: {
    display: "flex",
    gap: 8
  },
  btnWarn: {
    background: "#f59e0b",
    border: "none",
    padding: "5px 10px",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  },
  btnDanger: {
    background: "#dc2626",
    border: "none",
    padding: "5px 10px",
    color: "#fff",
    borderRadius: 5,
    cursor: "pointer"
  },
  error: {
    padding: 15,
    background: "#fee2e2",
    borderRadius: 8,
    color: "#b91c1c"
  }
};