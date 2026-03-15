// /components/alerts/AlertRuleEditor.jsx

import { useMemo } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Message } from "primereact/message";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import ConditionBuilder from "./ConditionBuilder";

export default function AlertRuleEditor({
  rule,
  onSave,
  onDelete,
  saving
}) {

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!rule) {
    return (
      <div className="flex flex-column justify-content-center align-items-center h-full text-500">
        <i className="pi pi-file-edit text-3xl mb-3" />
        <span>Select or create a rule to begin editing</span>
      </div>
    );
  }

  /* =====================================================
     SEVERITY OPTIONS
  ===================================================== */

  const severityOptions = useMemo(() => ([
    { label: "LOW", value: "LOW" },
    { label: "MEDIUM", value: "MEDIUM" },
    { label: "HIGH", value: "HIGH" },
    { label: "CRITICAL", value: "CRITICAL" }
  ]), []);

  const getSeverityTag = (level) => {
    switch (level) {
      case "CRITICAL":
        return "danger";
      case "HIGH":
        return "warning";
      case "MEDIUM":
        return "info";
      default:
        return "secondary";
    }
  };

  /* =====================================================
     FIELD CHANGE HANDLER
  ===================================================== */

  const updateField = (field, value) => {
    if (!rule) return;
    rule[field] = value;
  };

  const handleSave = async () => {
    if (!rule.rule_name?.trim()) return;
    await onSave?.();
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex flex-column h-full p-3">

      {/* HEADER */}
      <div className="flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="m-0 text-900 text-base font-semibold">
            {rule._id ? "Edit Rule" : "Create Rule"}
          </h3>
          {rule._id && (
            <Tag
              value={rule.severity}
              severity={getSeverityTag(rule.severity)}
              className="mt-2"
            />
          )}
        </div>

        {rule._id && (
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger p-button-sm"
            onClick={onDelete}
            tooltip="Delete Rule"
          />
        )}
      </div>

      {/* VALIDATION */}
      {!rule.rule_name?.trim() && (
        <Message
          severity="warn"
          text="Rule name is required"
          className="mb-3"
        />
      )}

      {/* RULE NAME */}
      <div className="field mb-3">
        <label className="text-700 text-sm font-medium">
          Rule Name
        </label>
        <InputText
          value={rule.rule_name || ""}
          className="w-full"
          onChange={(e) =>
            updateField("rule_name", e.target.value)
          }
        />
      </div>

      {/* GRID SECTION */}
      <div className="grid mb-3">

        <div className="col-12 md:col-6 field">
          <label className="text-700 text-sm font-medium">
            Severity
          </label>
          <Dropdown
            value={rule.severity}
            options={severityOptions}
            className="w-full"
            onChange={(e) =>
              updateField("severity", e.value)
            }
          />
        </div>

        <div className="col-12 md:col-6 field">
          <label className="text-700 text-sm font-medium">
            Priority
          </label>
          <InputNumber
            value={rule.priority || 1}
            min={1}
            max={10}
            className="w-full"
            onValueChange={(e) =>
              updateField("priority", e.value)
            }
          />
        </div>

      </div>

      <Divider />

      {/* CONDITION BUILDER */}
      <div className="mb-3">
        <ConditionBuilder
          value={rule.condition_expression}
          onChange={(expression) =>
            updateField("condition_expression", expression)
          }
        />
      </div>

      <Divider />

      {/* FOOTER */}
      <div className="flex justify-content-between align-items-center mt-auto">

        <div className="flex align-items-center gap-2">
          <span className="text-sm text-700">Active</span>
          <InputSwitch
            checked={rule.is_active}
            onChange={(e) =>
              updateField("is_active", e.value)
            }
          />
        </div>

        <Button
          label={rule._id ? "Update Rule" : "Create Rule"}
          icon="pi pi-check"
          loading={saving}
          disabled={!rule.rule_name?.trim()}
          onClick={handleSave}
        />
      </div>

    </div>
  );
}