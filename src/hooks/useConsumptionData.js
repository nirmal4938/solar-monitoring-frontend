import { useState, useEffect, useCallback } from "react";
import { fetchConsumptionData } from "../api/solarApi";

export function useConsumptionData(plantId, date, timezone) {
  const [state, setState] = useState({
    timeSeries: [],
    electrical: {},
    financial: {},
    risk: {},
    loading: true,
    error: null
  });

  const loadData = useCallback(async () => {
    if (!plantId || !date) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const res = await fetchConsumptionData(
        plantId,
        date,
        timezone
      );

      if (!res?.success) {
        throw new Error(res?.message || "Failed to fetch consumption data");
      }

      const payload = res.data || {};

      setState({
        timeSeries: payload.timeSeries || [],
        electrical: payload.electrical || {},
        financial: payload.financial || {},
        risk: payload.risk || {},
        loading: false,
        error: null
      });

    } catch (err) {
      console.error("Consumption data error:", err);

      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message || "Unknown error"
      }));
    }
  }, [plantId, date, timezone]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ...state,
    refresh: loadData
  };
}