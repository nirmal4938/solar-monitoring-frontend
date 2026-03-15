import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Badge } from "primereact/badge";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

import { useEditAlertRule } from "../../hooks/useEditAlertRule";
import { useEditPlant } from "../../hooks/useEditPlant";

import AlertRulesList from "../../components/alerts/AlertRulesList";
import AlertRuleScope from "../../components/alerts/AlertRuleScope";
import AlertRuleCondition from "../../components/alerts/AlertRuleCondition";
import AlertRuleExecution from "../../components/alerts/AlertRuleExecution";
import AlertRuleSeverity from "../../components/alerts/AlertRuleSeverity";

import "./AlertRulesPage.css";

export default function AlertRulesPage({ plantId: externalPlantId }) {
  const [internalPlantId, setInternalPlantId] = useState(null);

  const plantId = externalPlantId || internalPlantId;

  /* ==============================
     PLANTS
  ============================== */
  const { plants, loading: plantLoading } = useEditPlant(
    externalPlantId ? externalPlantId : undefined
  );

  /* ==============================
     ALERT RULES
  ============================== */
  const {
    rules,
    selectedRule,
    loading,
    saving,
    error,
    setSelectedRule,
    saveRule,
    deleteRule,
    toggleRule,
    cloneRule,
    refresh,
    onChange
  } = useEditAlertRule(plantId);

  const [selectedIds, setSelectedIds] = useState([]);

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter(r => r.is_active).length,
    critical: rules.filter(r => r.severity === "HIGH").length
  }), [rules]);

  const handleCreate = () => {
    if (!plantId) return;

    setSelectedRule({
      rule_name: "",
      rule_type: "OPERATIONAL",
      scope_level: "PLANT",
      condition_expression: {},
      evaluation_frequency: "REALTIME",
      cooldown_minutes: 0,
      auto_resolve: false,
      notification_channels: [],
      severity: "LOW",
      priority: 1,
      is_active: true
    });
  };

  /* =====================================================
     NO PLANT SELECTED (ENTERPRISE EMPTY STATE)
  ===================================================== */
  if (!plantId) {
    return (
      <div className="alert-page">

        <div className="alert-header">
          <div>
            <div className="alert-title">Alert Rules</div>
            <div className="alert-subtitle">
              Configure automated plant monitoring logic
            </div>
          </div>
        </div>

        <div className="centered" style={{ flexDirection: "column", gap: "1rem" }}>
          <div style={{ fontSize: "16px", fontWeight: 500 }}>
            Select a Plant
          </div>

          {plantLoading ? (
            <ProgressSpinner style={{ width: 40, height: 40 }} />
          ) : (
            <Dropdown
              value={internalPlantId}
              options={plants}
              optionLabel="name"
              optionValue="id"
              placeholder="Choose Plant"
              style={{ width: "280px" }}
              onChange={(e) => setInternalPlantId(e.value)}
            />
          )}

          <div style={{ fontSize: "13px", color: "#6b7280" }}>
            Alert rules are configured per plant.
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     NORMAL PAGE
  ===================================================== */
  return (
    <div className="alert-page">

      {/* HEADER */}
      <div className="alert-header">
        <div>
          <div className="alert-title">Alert Rules</div>
          <div className="alert-subtitle">
            Configure automated plant monitoring logic
          </div>
        </div>

        <div className="alert-header-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>

          {/* Show dropdown only if plant not locked from parent */}
          {!externalPlantId && (
            <Dropdown
              value={plantId}
              options={plants}
              optionLabel="name"
              optionValue="id"
              placeholder="Select Plant"
              style={{ width: "200px" }}
              onChange={(e) => setInternalPlantId(e.value)}
            />
          )}

          <Button
            label="New Rule"
            icon="pi pi-plus"
            className="p-button-sm"
            onClick={handleCreate}
          />

          {/* <Button
            icon="pi pi-refresh"
            className="p-button-text p-button-sm"
            onClick={refresh}
          /> */}
        </div>
      </div>

      {/* STATS */}
      <div className="alert-stats">
        <div className="stat-item">
          Total <Badge value={stats.total} />
        </div>
        <div className="stat-item">
          Active <Badge value={stats.active} severity="success" />
        </div>
        <div className="stat-item">
          High Severity <Badge value={stats.critical} severity="danger" />
        </div>
      </div>

      {error && <Message severity="error" text={error} className="mb-3" />}

      {/* MAIN LAYOUT */}
      <div className="alert-layout">

        {/* RULE LIST */}
        <div className="alert-panel">
          {loading ? (
            <div className="centered">
              <ProgressSpinner style={{ width: 50, height: 50 }} />
            </div>
          ) : (
            <AlertRulesList
              rules={rules}
              selectedRule={selectedRule}
              selectedIds={selectedIds}
              onMultiSelect={setSelectedIds}
              onSelect={setSelectedRule}
              onToggle={toggleRule}
              onClone={cloneRule}
              onDelete={deleteRule}
            />
          )}
        </div>

        {/* EDITOR */}
        <div className={classNames("alert-panel", { "panel-disabled": saving })}>
          {selectedRule ? (
            <>
              <AlertRuleScope rule={selectedRule} onChange={onChange} />
              <AlertRuleCondition rule={selectedRule} onChange={onChange} />
              <AlertRuleExecution rule={selectedRule} onChange={onChange} />
              <AlertRuleSeverity rule={selectedRule} onChange={onChange} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1rem" }}>
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  className="p-button-danger p-button-sm"
                  onClick={() =>
                    selectedRule._id && deleteRule(selectedRule._id)
                  }
                />
                <Button
                  label="Save"
                  icon="pi pi-check"
                  className="p-button-sm"
                  onClick={saveRule}
                  disabled={saving}
                />
              </div>
            </>
          ) : (
            <div className="centered">
              Select or create a rule to edit
            </div>
          )}
        </div>

      </div>
    </div>
  );
}