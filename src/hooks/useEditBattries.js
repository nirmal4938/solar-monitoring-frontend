// hooks/useEditBatteries.js
import { useState, useEffect, useCallback } from "react";
import { batteriesService } from "../services/BatteryService";

export const useEditBatteries = (batteryId) => {
  const [batteries, setBatteries] = useState([]);
  const [battery, setBatteryDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiMetrics, setAiMetrics] = useState(null);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatteries = async () => {
    setLoading(true);
    try {
      const res = await batteriesService.getAll();
      setBatteries(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBattery = async (id) => {
    try {
      await batteriesService.delete(id);
      setBatteries((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err);
    }
  };
  
  useEffect(() => {
    if (!batteryId) return; // exit if no batteryId

    const fetchBattery = async () => {
      setLoading(true);
      try {
        const res = await batteriesService.getById(batteryId);
        // Assuming API returns: { battery, maintenance, aiMetrics }
        setBatteryDetails(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBattery();
  }, [batteryId]);

useEffect(() => {
  fetchBatteries();
}, []);
const saveOrUpdateBattery = useCallback(async (batteryId, payload) => {

  try {

    const requestPayload = {
      ...payload.battery
    };

    if (batteryId) {
      await batteriesService.update(batteryId, requestPayload);
    } else {
      await batteriesService.create(requestPayload);
    }

    await fetchBatteries();

  } catch (err) {
    setError(err);
    throw err;
  }

}, []);

  return { batteries, batteryDetails: battery, logs, alerts, aiMetrics, maintenance, deleteBattery, saveOrUpdateBattery, loading, error };
};