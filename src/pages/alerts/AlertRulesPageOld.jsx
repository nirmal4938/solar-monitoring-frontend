// /pages/alerts/AlertRulesPage.jsx

import { useMemo, useState } from "react";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Badge } from "primereact/badge";
import { Message } from "primereact/message";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";

import { useEditAlertRule } from "../../hooks/useEditAlertRule";
import AlertRulesList from "../../components/alerts/AlertRulesList";
import AlertRuleEditor from "../../components/alerts/AlertRuleEditor";

import "./AlertRulesPage.css";

export default function AlertRulesPage({ plantId }) {

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
    bulkUpdateStatus,
    refresh
  } = useEditAlertRule(plantId);

  const [selectedIds, setSelectedIds] = useState([]);

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter(r => r.is_active).length,
    critical: rules.filter(r => r.severity === "HIGH").length
  }), [rules]);

  const handleCreate = () => {
    setSelectedRule({
      rule_name: "",
      condition_expression: "",
      severity: "LOW",
      is_active: true
    });
  };

  return (
    <div className="alert-page">

      {/* PAGE HEADER */}
      <div className="alert-header">
        <div>
          <div className="alert-title">Alert Rules</div>
          <div className="alert-subtitle">
            Configure automated plant monitoring logic
          </div>
        </div>

        <div className="alert-header-actions">
          <Button
            label="New Rule"
            icon="pi pi-plus"
            className="p-button-sm"
            onClick={handleCreate}
          />

          <Button
            icon="pi pi-refresh"
            className="p-button-text p-button-sm"
            onClick={refresh}
          />
        </div>
      </div>

      {/* STATS BAR */}
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

      {error && (
        <Message severity="error" text={error} className="mb-3" />
      )}

      {/* MAIN LAYOUT */}
      <div className="alert-layout">

        {/* RULE LIST */}
        <div className="alert-panel">
          {loading ? (
            <div className="centered">
              <ProgressSpinner style={{ width: 40, height: 40 }} />
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
        <div
          className={classNames("alert-panel", {
            "panel-disabled": saving
          })}
        >
          <AlertRuleEditor
            rule={selectedRule}
            onSave={saveRule}
            onDelete={() => selectedRule?.id && deleteRule(selectedRule.id)}
            saving={saving}
          />
        </div>

      </div>
    </div>
  );
}