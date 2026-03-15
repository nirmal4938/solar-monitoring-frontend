// src/hooks/useEditAlertRule.js
import { useState, useEffect, useCallback } from "react";
import { alertRuleService } from "../services/alertRuleService";

export function useEditAlertRule(plantId) {

  /* =====================================================
     STATE
  ===================================================== */

  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState(null);

  /* =====================================================
     FETCH RULES (REFRESH)
  ===================================================== */

  const refresh = useCallback(async () => {
    if (!plantId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await alertRuleService.getPlantRules(plantId);
      setRules(data || []);

    } catch (err) {
      setError(err.message || "Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  /* =====================================================
     LOAD SINGLE RULE
  ===================================================== */

  const loadRule = async (ruleId) => {
    if (!ruleId) return;

    try {
      setLoading(true);
      setError(null);

      const rule = await alertRuleService.getRule(ruleId);
      setSelectedRule(rule);

    } catch (err) {
      setError(err.message || "Failed to load rule");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORM CHANGE HANDLER (ENTERPRISE SAFE)
  ===================================================== */

  const onChange = (field, value) => {
    setSelectedRule(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /*
    Usage in form:

    <InputText
      value={selectedRule?.rule_name || ""}
      onChange={(e) => onChange("rule_name", e.target.value)}
    />
  */

  /* =====================================================
     SAVE RULE (CREATE / UPDATE)
  ===================================================== */

  const saveRule = async () => {
    if (!selectedRule) return;

    try {
      setSaving(true);
      setError(null);

      let saved;

      if (selectedRule._id) {
        saved = await alertRuleService.updateRule(
          selectedRule._id,
          selectedRule
        );
      } else {
        saved = await alertRuleService.createRule({
          ...selectedRule,
          plant_id: plantId
        });
      }

      await refresh();
      setSelectedRule(saved);

      return saved;

    } catch (err) {
      setError(err.message || "Failed to save rule");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE RULE
  ===================================================== */

  const deleteRule = async (ruleId) => {
    if (!ruleId) return;

    try {
      setLoading(true);
      setError(null);

      await alertRuleService.deleteRule(ruleId);
      await refresh();

      if (selectedRule?._id === ruleId) {
        setSelectedRule(null);
      }

    } catch (err) {
      setError(err.message || "Failed to delete rule");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     TOGGLE ACTIVE
  ===================================================== */

  const toggleRule = async (ruleId) => {
    try {
      await alertRuleService.toggleRule(ruleId);
      await refresh();
    } catch (err) {
      setError(err.message || "Failed to toggle rule");
    }
  };

  /* =====================================================
     CLONE RULE
  ===================================================== */

  const cloneRule = async (ruleId) => {
    try {
      const cloned = await alertRuleService.cloneRule(ruleId);
      await refresh();
      setSelectedRule(cloned);
    } catch (err) {
      setError(err.message || "Failed to clone rule");
    }
  };

  /* =====================================================
     BULK STATUS UPDATE
  ===================================================== */

  const bulkUpdateStatus = async (ids, is_active) => {
    if (!ids?.length) return;

    try {
      setLoading(true);
      await alertRuleService.bulkStatus(ids, is_active);
      await refresh();
    } catch (err) {
      setError(err.message || "Bulk update failed");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     TEST RULE EXECUTION
  ===================================================== */

  const testRule = async (payload) => {
    if (!selectedRule?._id) return null;

    try {
      setTesting(true);
      setError(null);

      const result = await alertRuleService.testRule(
        selectedRule._id,
        payload
      );

      return result;

    } catch (err) {
      setError(err.message || "Rule test failed");
      throw err;
    } finally {
      setTesting(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    refresh();
  }, [refresh]);

  /* =====================================================
     RETURN COMPLETE MODULE API
  ===================================================== */

  return {
    // Data
    rules,
    selectedRule,

    // State
    loading,
    saving,
    testing,
    error,

    // Selection
    setSelectedRule,
    loadRule,

    // Form
    onChange,

    // CRUD
    saveRule,
    deleteRule,
    toggleRule,
    cloneRule,

    // Bulk
    bulkUpdateStatus,

    // Rule Engine
    testRule,

    // Manual refresh
    refresh
  };
}