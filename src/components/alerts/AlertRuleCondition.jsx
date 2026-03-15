// /components/alerts/AlertRuleCondition.jsx
import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ALERT_RULE_FIELDS } from "../../config/alertRuleFields";

export default function AlertRuleCondition({ rule, onChange }) {
  const [conditions, setConditions] = useState([]);
  const [logic, setLogic] = useState("AND");
  const [error, setError] = useState(null);

  const SENSOR_OPTIONS = ALERT_RULE_FIELDS[rule.scope_level]?.map(f => ({
    label: f.unit ? `${f.label} (${f.unit})` : f.label,
    value: f.field,
    type: f.type
  })) || [];

  useEffect(() => {
    if (rule.condition_expression?.conditions) {
      setConditions(rule.condition_expression.conditions);
      setLogic(rule.condition_expression.logic || "AND");
    } else {
      setConditions([]);
      setLogic("AND");
    }
  }, [rule.condition_expression]);

  const getOperatorOptions = (field) => {
    const fieldType = SENSOR_OPTIONS.find(f => f.value === field)?.type;
    if (fieldType === "string") {
      return [
        { label: "=", value: "=" },
        { label: "!=", value: "!=" }
      ];
    }
    // default numeric operators
    return [
      { label: "=", value: "=" },
      { label: "<", value: "<" },
      { label: "<=", value: "<=" },
      { label: ">", value: ">" },
      { label: ">=", value: ">=" }
    ];
  };

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    setConditions(newConditions);
    setError(validateConditions(newConditions) ? null : "All rows must be filled");
    onChange("condition_expression", { conditions: newConditions, logic });
  };

  const addCondition = () => {
    setConditions([...conditions, { sensor: null, operator: "=", value: "" }]);
  };

  const removeCondition = (index) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    setConditions(newConditions);
    onChange("condition_expression", { conditions: newConditions, logic });
  };

  const validateConditions = (conds) => {
    return conds.every(c => c.sensor && c.operator && c.value !== "");
  };

  const handleLogicChange = (e) => {
    setLogic(e.value);
    onChange("condition_expression", { conditions, logic: e.value });
  };

  return (
    <div className="condition-section p-4 surface-card border-round shadow-1">
      <div className="font-bold mb-3 text-gray-900 text-lg">Condition Builder</div>

      {/* Logic selector */}
      <div className="flex align-items-center gap-2 mb-3">
        <span className="text-gray-700 text-sm font-medium">Combine conditions with:</span>
        <Dropdown
          value={logic}
          options={["AND", "OR"]}
          onChange={handleLogicChange}
          className="w-24"
        />
      </div>

      {/* Condition rows */}
      {conditions.map((cond, index) => (
        <div key={index} className="flex align-items-center gap-2 mb-2">
          <Dropdown
            value={cond.sensor}
            options={SENSOR_OPTIONS}
            placeholder="Sensor"
            className="w-48"
            onChange={(e) => updateCondition(index, "sensor", e.value)}
          />
          <Dropdown
            value={cond.operator}
            options={getOperatorOptions(cond.sensor)}
            className="w-24"
            onChange={(e) => updateCondition(index, "operator", e.value)}
          />
          <InputText
            value={cond.value}
            placeholder="Value"
            className="flex-1"
            onChange={(e) => updateCondition(index, "value", e.target.value)}
          />
          <Button
            icon="pi pi-trash"
            className="p-button-text p-button-danger"
            onClick={() => removeCondition(index)}
          />
        </div>
      ))}

      <Button
        label="Add Condition"
        icon="pi pi-plus"
        className="p-button-sm p-button-outlined mt-2"
        onClick={addCondition}
      />

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}

      <div className="mt-3 p-3 border-round surface-100">
        <div className="text-gray-600 text-xs font-medium mb-1">Advanced JSON Preview:</div>
        <pre className="text-xs text-gray-800">{JSON.stringify({ conditions, logic }, null, 2)}</pre>
      </div>

      <div className="text-gray-500 text-xs mt-2">
        Use the fields above to define alert conditions. Each row represents a single condition.
      </div>
    </div>
  );
}