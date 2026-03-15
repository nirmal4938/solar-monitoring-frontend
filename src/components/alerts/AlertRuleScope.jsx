// /components/alerts/AlertRuleScope.jsx
import { Dropdown, InputText } from "primereact";
import { Tooltip } from "primereact/tooltip";

export default function AlertRuleScope({ rule, onChange }) {
  return (
    <div className="scope-section p-3 surface-card border-round shadow-1">
      <div className="font-bold mb-2 text-gray-900">Scope & Metadata</div>

      <div className="flex flex-column gap-3">

        <InputText
          value={rule.rule_name || ""}
          placeholder="Rule Name"
          onChange={(e) => onChange("rule_name", e.target.value)}
        />

        <Dropdown
          value={rule.rule_type}
          options={["OPERATIONAL","PERFORMANCE","FINANCIAL","ESG"]}
          onChange={(e) => onChange("rule_type", e.value)}
          placeholder="Rule Type"
          className="w-full"
        >
        </Dropdown>
        <small className="text-gray-500">Choose what type of alert this is</small>

        <Dropdown
          value={rule.scope_level}
          options={["ORGANIZATION","PLANT","INVERTER","BATTERY"]}
          onChange={(e) => onChange("scope_level", e.value)}
          placeholder="Scope Level"
          className="w-full"
        />
        <small className="text-gray-500">Select the scope affected by this alert</small>
      </div>
    </div>
  );
}