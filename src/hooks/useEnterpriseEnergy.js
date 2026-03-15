import { useMemo } from "react";
import { useSolarData } from "./useSolarData";
import { useConsumptionData } from "./useConsumptionData";
import { useEditAlerts } from "./useEditAlerts";

const safe = (v) =>
  typeof v === "number" && !isNaN(v) ? v : 0;

export const useEnterpriseEnergy = (plantId, date, timezone) => {
  const solar = useSolarData(plantId, date, timezone);
  const consumption = useConsumptionData(plantId, date, timezone);
  const alerts = useEditAlerts(plantId);

  const merged = useMemo(() => {
    const totalGeneration = safe(solar.totalEnergy);
    const totalConsumption = safe(consumption.totalConsumption);
    const gridImport = safe(solar.gridImport);
    const gridExport = safe(solar.gridExport);

    const selfConsumptionRatio =
      totalGeneration > 0
        ? ((totalGeneration - gridExport) / totalGeneration) * 100
        : 0;

    const revenue = safe(solar.revenueToday);
    const savings = safe(solar.savingsToday);

    const netBalance = revenue + savings;

    const systemHealth =
      alerts.activeCount > 0 ? "FAULT" : "HEALTHY";

    return {
      scada_data: solar?.scadaData,
      totalGeneration,
      totalConsumption,
      gridImport,
      gridExport,
      selfConsumptionRatio,
      revenue,
      savings,
      netBalance,
      systemHealth,
      alertsCount: alerts.activeCount,
      loading: solar.loading || consumption.loading,
      error: solar.error || consumption.error
    };
  }, [solar, consumption, alerts]);

  return merged;
}