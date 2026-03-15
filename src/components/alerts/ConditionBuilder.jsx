// /components/alerts/ConditionBuilder.jsx

import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import ConditionRow from "./ConditionRow";

export default function ConditionBuilder({
  value = "",
  onExpressionChange
}) {
  const [conditions, setConditions] = useState([]);
  const [logic, setLogic] = useState("AND");

  /* =====================================================
     PARSE EXISTING EXPRESSION (EDIT MODE SAFE)
  ===================================================== */

  useEffect(() => {
    if (!value) {
      setConditions([]);
      return;
    }

    const detectedLogic = value.includes(" OR ") ? "OR" : "AND";
    setLogic(detectedLogic);

    const parts = value.split(` ${detectedLogic} `);

    const parsed = parts.map((exp) => {
      const match = exp.match(/(.+?)(<=|>=|=|<|>)(.+)/);
      if (!match) return {};
      return {
        field: match[1]?.trim(),
        operator: match[2]?.trim(),
        value: match[3]?.trim()
      };
    });

    setConditions(parsed);
  }, [value]);

  /* =====================================================
     BUILD EXPRESSION
  ===================================================== */

  const buildExpression = (list) => {
    const valid = list.filter(
      (c) => c.field && c.operator && c.value !== undefined
    );

    if (!valid.length) {
      onExpressionChange("");
      return;
    }

    const expression = valid
      .map((c) => `${c.field} ${c.operator} ${c.value}`)
      .join(` ${logic} `);

    onExpressionChange(expression);
  };

  /* =====================================================
     ACTIONS
  ===================================================== */

  const addCondition = () => {
    const updated = [...conditions, {}];
    setConditions(updated);
  };

  const updateCondition = (index, data) => {
    const updated = [...conditions];
    updated[index] = data;
    setConditions(updated);
    buildExpression(updated);
  };

  const removeCondition = (index) => {
    const updated = conditions.filter((_, i) => i !== index);
    setConditions(updated);
    buildExpression(updated);
  };

  const logicOptions = [
    { label: "AND (All must match)", value: "AND" },
    { label: "OR (Any can match)", value: "OR" }
  ];

  return (
    <div className="mt-3">
      <h4 className="text-900 mb-3">Condition Builder</h4>

      {conditions.map((cond, index) => (
        <ConditionRow
          key={index}
          condition={cond}
          onChange={(data) => updateCondition(index, data)}
          onRemove={() => removeCondition(index)}
        />
      ))}

      <div className="flex align-items-center gap-3 mt-3">
        <Button
          label="Add Condition"
          icon="pi pi-plus"
          className="p-button-text"
          onClick={addCondition}
        />

        {conditions.length > 1 && (
          <Dropdown
            value={logic}
            options={logicOptions}
            onChange={(e) => {
              setLogic(e.value);
              buildExpression(conditions);
            }}
            className="w-14rem"
          />
        )}
      </div>
    </div>
  );
}