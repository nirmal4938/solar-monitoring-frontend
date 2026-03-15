import React from "react";
import { InputNumber } from "primereact/inputnumber";
import FormField from "./FormField";

const NumberField = ({
  label,
  value,
  onChange,
  required,
  error,
  name,
  mode = "decimal",
  min,
  max,
  suffix,
  disabled,
}) => {
  return (
    <FormField label={label} required={required} error={error} htmlFor={name}>
      <InputNumber
        id={name}
        value={value}
        onValueChange={(e) => onChange(e.value)}
        mode={mode}
        min={min}
        max={max}
        suffix={suffix}
        disabled={disabled}
        className="w-full"
      />
    </FormField>
  );
};

export default NumberField;
