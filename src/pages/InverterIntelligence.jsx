import { useEffect, useState } from "react";
import { inverterIntelligenceMock } from "../mocks/inverterIntelligenceMock";

import { InverterOverview } from "../components/inverters/InverterOverview";
import InverterPerformance from "../components/inverters/InverterPerformance";
import { InverterFinancialImpact } from "../components/inverters/InverterFinancialImpact";
import { InverterAIScores } from "../components/inverters/InverterAIScores";
import InverterTrendChart from "../components/inverters/InverterTrendChart";

export default function InverterIntelligence() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setData(inverterIntelligenceMock);
    }, 500);
  }, []);

  if (!data) return <div className="p-6">Loading Battery Intelligence...</div>;

  return (
    <div className="space-y-6 p-6">
      <InverterOverview data={data} />
      <InverterPerformance data={data} />
      {data.permissions.can_view_financials && (
        <InverterFinancialImpact data={data} />
      )}
      {data.permissions.can_view_ai_scores && (
        <InverterAIScores data={data} />
      )}
      <InverterTrendChart data={data} />
    </div>
  );
}