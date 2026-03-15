import { useEffect, useState } from "react";
import { plantIntelligenceMock } from "../mocks/plantIntelligenceMock";

import PlantOverview from "../components/plant/PlantOverview";
import PlantEnergyFlow from "../components/plant/PlantEnergyFlow";
import PlantFinancialImpact from "../components/plant/PlantFinancialImpact";
import PlantAIScores from "../components/plant/PlantAIScores";
import PlantCarbonImpact from "../components/plant/PlantCarbonImpact";
import PlantForecast from "../components/plant/PlantForecast";
import PlantAlerts from "../components/plant/PlantAlerts";
import PlantMaintenance from "../components/plant/PlantMaintenance";
import PlantTrendChart from "../components/plant/PlantTrendChart";
import PlantLocationMap from "../components/plant/PlantlocationMap";

import "./PlantIntelligence.css";

export default function PlantIntelligence() {
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData(plantIntelligenceMock);
    }, 500);
  }, []);

  if (!data) {
    return (
      <div className="plant-intelligence-container">
        <div className="loading-card">
          Loading Plant Intelligence...
        </div>
      </div>
    );
  }

  return (
    <div className="plant-intelligence-container">

      {/* ================= EXECUTIVE OVERVIEW ================= */}
      <section className="pi-section">
        <PlantOverview data={data} />
        <PlantLocationMap data={data} />
      </section>

      {/* ================= ENERGY ================= */}
      <section className="pi-section">
        <SectionHeader title="Energy Intelligence" />
        <PlantEnergyFlow data={data} />
        <PlantTrendChart data={data} />
      </section>

      {/* ================= FINANCIAL ================= */}
      {data.permissions.can_view_financials && (
        <section className="pi-section">
          <SectionHeader title="Financial Intelligence" accent="finance" />
          <PlantFinancialImpact data={data} />
        </section>
      )}

      {/* ================= AI ================= */}
      {data.permissions.can_view_ai_scores && (
        <section className="pi-section">
          <SectionHeader title="AI Intelligence" accent="ai" />
          <PlantAIScores data={data} />
        </section>
      )}

      {/* ================= CARBON ================= */}
      {data.permissions.can_view_carbon && (
        <section className="pi-section">
          <SectionHeader title="Carbon Intelligence" accent="carbon" />
          <PlantCarbonImpact data={data} />
        </section>
      )}

      {/* ================= OPERATIONS ================= */}
      <section className="pi-section">
        <SectionHeader title="Operations & Forecast" />

        <PlantForecast data={data} />
        <PlantAlerts data={data} />

        {data.permissions.can_schedule_maintenance && (
          <PlantMaintenance data={data} />
        )}
      </section>

    </div>
  );
}

/* ================= SECTION HEADER ================= */

function SectionHeader({ title, accent }) {
  return (
    <div className={`pi-section-header ${accent || ""}`}>
      <h3>{title}</h3>
    </div>
  );
}