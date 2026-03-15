import { useState, useEffect, useCallback } from "react";
import { invertersService } from "../services/invertersService";

export const useEditInverters = (inverterId = null) => {

  const [inverters, setInverters] = useState([]);
  const [inverter, setInverter] = useState(null);

  const [logs, setLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [aiMetrics, setAiMetrics] = useState(null);
  const [maintenance, setMaintenance] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ============================
     Fetch All Inverters
  ============================ */

  const fetchInverters = useCallback(async () => {

    setLoading(true);

    try {

      const res = await invertersService.getAll();
      setInverters(res.data || []);

    } catch (err) {

      setError(err);

    } finally {

      setLoading(false);

    }

  }, []);

  /* ============================
     Fetch Single Inverter
  ============================ */

  const fetchInverter = useCallback(async () => {

    if (!inverterId) return;

    setLoading(true);

    try {

      const res = await invertersService.getById(inverterId);
      setInverter(res.data);

    } catch (err) {

      setError(err);

    } finally {

      setLoading(false);

    }

  }, [inverterId]);

  /* ============================
     Logs / Alerts / AI / Maint
  ============================ */

  const fetchLogs = useCallback(async () => {

    if (!inverterId) return;

    const res = await invertersService.getLogs(inverterId);
    setLogs(res.data || []);

  }, [inverterId]);

  const fetchAlerts = useCallback(async () => {

    if (!inverterId) return;

    const res = await invertersService.getAlerts(inverterId);
    setAlerts(res.data || []);

  }, [inverterId]);

  const fetchAI = useCallback(async () => {

    if (!inverterId) return;

    const res = await invertersService.getAI(inverterId);
    setAiMetrics(res.data || null);

  }, [inverterId]);

  const fetchMaintenance = useCallback(async () => {

    if (!inverterId) return;

    const res = await invertersService.getMaintenance(inverterId);
    setMaintenance(res.data || []);

  }, [inverterId]);

  /* ============================
     Create / Update / Delete
  ============================ */

  const createInverter = async (data) => {

    const res = await invertersService.create(data);
    await fetchInverters();
    return res.data;

  };

  const updateInverter = async (id, data) => {

    const res = await invertersService.update(id, data);
    await fetchInverter();
    return res.data;

  };

  const deleteInverter = async (id) => {

    await invertersService.delete(id);

    setInverters(prev =>
      prev.filter(i => i.id !== id)
    );

  };

  /* ============================
     Initial Load
  ============================ */

  useEffect(() => {

    fetchInverters();

  }, [fetchInverters]);

  useEffect(() => {

    if (!inverterId) return;

    fetchInverter();
    fetchLogs();
    fetchAlerts();
    fetchAI();
    fetchMaintenance();

  }, [inverterId]);

  return {

    inverters,
    inverter,

    logs,
    alerts,
    aiMetrics,
    maintenance,

    loading,
    error,

    fetchInverters,
    fetchInverter,

    createInverter,
    updateInverter,
    deleteInverter

  };

};