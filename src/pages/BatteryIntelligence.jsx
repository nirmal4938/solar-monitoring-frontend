import { useEffect, useState } from "react";
import { batteryIntelligenceMock } from "../mocks/batteryIntelligenceMock";

import BatteryOverview from "../components/battery/BatteryOverview";
import BatteryPerformance from "../components/battery/BatteryPerformance";
import BatteryFinancialImpact from "../components/battery/BatteryFinancialImpact";
import BatteryAIScores from "../components/battery/BatteryAIScores";
import BatteryTrendChart from "../components/battery/BatteryTrendChart";

export default function BatteryIntelligence() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Simulate API delay
    setTimeout(() => {
      setData(batteryIntelligenceMock);
    }, 500);
  }, []);

  if (!data) return <div className="p-6">Loading Battery Intelligence...</div>;

  return (
    <div className="space-y-6 p-6">
      <BatteryOverview data={data} />
      <BatteryPerformance data={data} />
      {data.permissions.can_view_financials && (
        <BatteryFinancialImpact data={data} />
      )}
      {data.permissions.can_view_ai_scores && (
        <BatteryAIScores data={data} />
      )}
      <BatteryTrendChart data={data} />
    </div>
  );
}