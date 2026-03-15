import { useState, useEffect, useCallback } from "react";
import alertService from "../services/alertService";

/**
 * useEditAlerts hook
 * - Fetch ACTIVE alerts
 * - Fetch ALERT HISTORY
 * - Acknowledge / Resolve alerts
 * - Auto refresh active alerts
 */

export const useEditAlerts = (plantId) => {

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [historyAlerts, setHistoryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Normalize alert object for frontend tables
   */
  const normalizeAlerts = (list = []) =>
    list.map((a) => ({
      id: a._id,
      ...a
    }));

  /**
   * Fetch ACTIVE alerts
   */
  const fetchActive = useCallback(async () => {
    if (!plantId) return;

    try {
      const res = await alertService.getActiveAlerts(plantId);

      const list = Array.isArray(res?.data) ? res.data : [];

      setActiveAlerts(normalizeAlerts(list));
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [plantId]);

  /**
   * Fetch ALERT HISTORY
   */
  const fetchHistory = useCallback(async () => {
    if (!plantId) return;

    try {
      const res = await alertService.getAlertHistory(plantId);

      const list = Array.isArray(res?.data) ? res.data : [];

      setHistoryAlerts(normalizeAlerts(list));
    } catch (err) {
      console.error(err);
      setError(err);
    }
  }, [plantId]);

  /**
   * Acknowledge alert
   */
  const acknowledge = async (alertId) => {
    try {
      await alertService.acknowledgeAlert(alertId);

      // refresh active alerts
      await fetchActive();

    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    }
  };

  /**
   * Resolve alert
   */
  const resolve = async (alertId) => {
    try {
      await alertService.resolveAlert(alertId);

      // refresh active alerts
      await fetchActive();

    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {

    const load = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchActive(),
          fetchHistory()
        ]);

      } finally {
        setLoading(false);
      }
    };

    load();

  }, [fetchActive, fetchHistory]);

  /**
   * Realtime refresh ACTIVE alerts
   */
  useEffect(() => {

    if (!plantId) return;

    const interval = setInterval(() => {
      fetchActive();
    }, 60000);

    return () => clearInterval(interval);

  }, [plantId, fetchActive]);

  return {
    plantId,

    activeAlerts,
    historyAlerts,

    activeCount: activeAlerts.length,

    loading,
    error,

    fetchActive,
    fetchHistory,

    acknowledge,
    resolve,

    setActiveAlerts,
    setHistoryAlerts
  };
};