// /components/alerts/AlertRulesList.jsx

import { useMemo } from "react";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";

export default function AlertRulesList({
  rules = [],
  selectedRule,
  selectedIds = [],
  onMultiSelect,
  onSelect,
  onToggle,
  onClone,
  onDelete
}) {

  /* =====================================================
     SEVERITY COLOR MAPPER
  ===================================================== */

  const getSeverity = (level) => {
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
     CHECKBOX HANDLER
  ===================================================== */

  const toggleCheckbox = (id) => {
    if (!onMultiSelect) return;

    if (selectedIds.includes(id)) {
      onMultiSelect(selectedIds.filter(x => x !== id));
    } else {
      onMultiSelect([...selectedIds, id]);
    }
  };

  /* =====================================================
     EMPTY STATE
  ===================================================== */

  if (!rules.length) {
    return (
      <div className="flex flex-column justify-content-center align-items-center h-full text-500">
        <i className="pi pi-bell text-2xl mb-2" />
        <span>No alert rules configured</span>
      </div>
    );
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="flex flex-column h-full">

      {/* HEADER */}
      <div className="flex justify-content-between align-items-center mb-3">
        <h3 className="m-0 text-900 text-base font-semibold">
          Alert Rules
        </h3>
      </div>

      <Divider className="my-2" />

      {/* RULE LIST */}
      <div className="flex-1 overflow-auto">

        {rules.map(rule => {

          const isSelected = selectedRule?._id === rule._id;
          const isChecked = selectedIds.includes(rule._id);

          return (
            <div
              key={rule._id}
              className={classNames(
                "rule-row flex align-items-center justify-content-between p-2 border-round mb-2 cursor-pointer",
                {
                  "rule-row-active": isSelected
                }
              )}
              onClick={() => onSelect?.(rule)}
            >

              {/* LEFT SECTION */}
              <div className="flex align-items-center gap-2 flex-1">

                {/* Multi Select */}
                {onMultiSelect && (
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleCheckbox(rule._id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                )}

                <div className="flex flex-column">
                  <span className="text-900 font-medium text-sm">
                    {rule.rule_name}
                  </span>

                  <span className="text-500 text-xs">
                    Priority {rule.priority}
                  </span>
                </div>
              </div>

              {/* RIGHT SECTION */}
              <div className="flex align-items-center gap-2">

                {/* Active Indicator */}
                <Tag
                  value={rule.is_active ? "ACTIVE" : "INACTIVE"}
                  severity={rule.is_active ? "success" : "secondary"}
                  className="text-xs"
                />

                {/* Severity */}
                <Tag
                  value={rule.severity}
                  severity={getSeverity(rule.severity)}
                  className="text-xs"
                />

                {/* Actions */}
                <Button
                  icon="pi pi-copy"
                  className="p-button-text p-button-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClone?.(rule._id);
                  }}
                  tooltip="Clone"
                />

                <Button
                  icon={rule.is_active ? "pi pi-eye-slash" : "pi pi-eye"}
                  className="p-button-text p-button-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggle?.(rule._id);
                  }}
                  tooltip="Toggle Active"
                />

                <Button
                  icon="pi pi-trash"
                  className="p-button-text p-button-sm p-button-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(rule._id);
                  }}
                  tooltip="Delete"
                />
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}