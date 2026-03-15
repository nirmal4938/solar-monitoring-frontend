import { useState, useEffect, useCallback } from "react";
import plantService from "../services/plantService";

/**
 * useEditPlant hook
 * - Fetches single plant if plantId provided
 * - Fetches full plant list if plantId undefined
 * - Supports plant configuration (get, save, update)
 */
export const useEditPlant = (plantId) => {
  const [plant, setPlant] = useState(plantId ? null : null);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [configuration, setConfiguration] = useState(null);

  // -----------------------------
  // Fetch single plant
  // -----------------------------
  const fetchPlant = useCallback(async () => {
    if (!plantId) return;
    try {
      setLoading(true);
      const res = await plantService.getPlantById(plantId);
      const data = res?.data || null;

      if (data) {
        setPlant({ id: data._id, ...data });
      } else {
        setPlant(null);
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  // -----------------------------
  // Fetch all plants
  // -----------------------------
  const fetchPlants = useCallback(async () => {
    if (plantId) return;
    try {
      setLoading(true);
      const res = await plantService.getAllPlants();
      const list = Array.isArray(res?.data) ? res.data : [];
      const normalized = list.map((p) => ({ id: p._id, ...p }));
      setPlants(normalized);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  // -----------------------------
  // Fetch plant configuration
  // -----------------------------
  const fetchPlantConfiguration = useCallback(async () => {
    if (!plantId) return;
    try {
      setLoading(true);
      const res = await plantService.getPlantConfiguration(plantId);
      setConfiguration(res.data);
      return res;
    } catch (err) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  // -----------------------------
  // Save or update plant configuration
  // -----------------------------
  const saveOrUpdateConfiguration = useCallback(
    async (mapping) => {
      if (!plantId) throw new Error("No plant ID provided for configuration");

      try {
        setLoading(true);

        let res;
        if (configuration) {
          // update existing config
          res = await plantService.updatePlantConfiguration(plantId, mapping);
        } else {
          // create new config
          res = await plantService.createPlantConfiguration(plantId, mapping);
        }

        setConfiguration(res);
        return res;
      } catch (err) {
        console.error(err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [plantId, configuration]
  );

  // -----------------------------
  // Update plant
  // -----------------------------
  const updatePlant = async (updates, id = null) => {
    try {
      setLoading(true);
      const plantToUpdate = id || plantId;
      if (!plantToUpdate) throw new Error("No plant ID provided for update");

      const res = await plantService.updatePlant(plantToUpdate, updates);
      const updated = res?.data ? { id: res.data._id, ...res.data } : null;

      if (!updated) return null;

      if (plantId) setPlant(updated);
      if (!plantId) {
        setPlants((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      }

      return updated;
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Delete plant
  // -----------------------------
  const deletePlant = async (id) => {
    try {
      setLoading(true);
      await plantService.deletePlant(id);

      if (plantId && id === plantId) setPlant(null);
      if (!plantId) setPlants((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Initial fetch
  // -----------------------------
  useEffect(() => {
    if (plantId) {
      console.log("fetching plant configuration")
      fetchPlant();
      fetchPlantConfiguration();
    } else {
      fetchPlants();
    }
  }, [plantId, fetchPlant, fetchPlants, fetchPlantConfiguration]);

  return {
    plantId,
    plant,
    plants,
    configuration,
    loading,
    error,
    fetchPlant,
    fetchPlants,
    fetchPlantConfiguration,
    saveOrUpdateConfiguration,
    updatePlant,
    deletePlant,
    setPlant,
    setPlants,
    setConfiguration,
  };
};