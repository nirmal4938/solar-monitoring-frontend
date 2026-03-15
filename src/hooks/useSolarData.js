import { useState, useEffect, useCallback } from "react";
import { fetchGenerationData } from "../api/solarApi";

export function useSolarData(plantId, date, timezone) {
  /* ===============================
     Time Series
  ================================ */
  const [data, setData] = useState([]);

  /* ===============================
     Core KPIs
  ================================ */
  const [totalEnergy, setTotalEnergy] = useState(0);
  const [peakPower, setPeakPower] = useState(0);
  const [currentPower, setCurrentPower] = useState(0);
  const [availability, setAvailability] = useState(0);

  /* ===============================
     Performance KPIs
  ================================ */
  const [performanceRatio, setPerformanceRatio] = useState(0);
  const [specificYield, setSpecificYield] = useState(0);
  const [cuf, setCuf] = useState(0);

  /* ===============================
     Sustainability KPIs
  ================================ */
  const [co2Saved, setCo2Saved] = useState(0);

  /* ===============================
     Grid KPIs
  ================================ */
  const [selfConsumptionPct, setSelfConsumptionPct] = useState(0);
  const [gridImport, setGridImport] = useState(0);
  const [gridExport, setGridExport] = useState(0);

  /* ===============================
     Financial KPIs
  ================================ */
  const [revenueToday, setRevenueToday] = useState(0);
  const [savingsToday, setSavingsToday] = useState(0);
  const [netBillProjection, setNetBillProjection] = useState(0);

  /* ===============================
     Graph Data
  ================================ */
  const [gridImportExportData, setGridImportExportData] = useState([]);
  const [IrradiancePowerData, setIrradiancePowerData] = useState([]);
  const [inverterContributionData, setInverterContributionData] = useState([]);
  const [scadaData,setScadaData] = useState([])
  /* ===============================
     UI State
  ================================ */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);

      const res = await fetchGenerationData(plantId, date, timezone);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch generation data");
      }

      const payload = res.data || {};
      const ts = payload.timeSeries || [];

      /* ===============================
         Raw Time Series
      ================================ */
      setData(ts);
      setScadaData(payload.scada_data);
      /* ===============================
         Core KPIs
      ================================ */
      setTotalEnergy(payload.totalEnergy ?? 0);
      setPeakPower(payload.peakPower ?? 0);
      setCurrentPower(payload.currentPower ?? 0);
      setAvailability(payload.availability ?? 0);

      /* ===============================
         Performance
      ================================ */
      setPerformanceRatio(payload.performanceRatio ?? 0);
      setSpecificYield(payload.specificYield ?? 0);
      setCuf(payload.cuf ?? 0);

      /* ===============================
         Sustainability
      ================================ */
      setCo2Saved(payload.co2Saved ?? 0);

      /* ===============================
         Grid
      ================================ */
      setSelfConsumptionPct(payload.selfConsumptionPct ?? 0);
      setGridImport(payload.gridImport ?? 0);
      setGridExport(payload.gridExport ?? 0);

      /* ===============================
         Financial
      ================================ */
      setRevenueToday(payload.revenueToday ?? 0);
      setSavingsToday(payload.savingsToday ?? 0);
      setNetBillProjection(payload.netBillProjection ?? 0);

      /* ===============================
         Graph 1 — Grid Import/Export
      ================================ */
      const gridIE = ts.map(d => ({
        timestamp: d.timestamp,
        import_kw: d.import_kw ?? 0,
        export_kw: d.export_kw ?? 0
      }));

      setGridImportExportData(gridIE);

      /* ===============================
         Graph 2 — Irradiance vs Power
      ================================ */
      const irradiancePower = ts.map(d => ({
        timestamp: d.timestamp,
        power_kw: d.power_kw ?? 0,
        irradiance_wm2: d.irradiance_wm2 ?? 0
      }));

      setIrradiancePowerData(irradiancePower);

      /* ===============================
         Graph 3 — Inverter Contribution
      ================================ */
      setInverterContributionData(payload.inverterContribution || []);

    } catch (err) {
      console.error("Solar data error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [plantId, date, timezone]);

  useEffect(() => {
    if (!plantId || !date) return;
    setLoading(true);
    loadData();
  }, [loadData]);

  return {
    /* Time Series */
    data,
    scadaData,
    /* KPIs */
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

    /* Graph Data */
    gridImportExportData,
    IrradiancePowerData,
    inverterContributionData,

    /* UI */
    loading,
    error,
    refresh: loadData
  };
}