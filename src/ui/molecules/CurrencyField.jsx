import React from "react";
import { InputNumber } from "primereact/inputnumber";
import FormField from "./FormField";

const CurrencyField = ({
  label,
  value,
  onChange,
  currency = "INR",
  required,
  error,
  name,
  disabled,
}) => {
  return (
    <FormField label={label} required={required} error={error} htmlFor={name}>
      <InputNumber
        id={name}
        value={value}
        onValueChange={(e) => onChange(e.value)}
        mode="currency"
        currency={currency}
        locale="en-IN"
        className="w-full"
        disabled={disabled}
      />
    </FormField>
  );
};

export default CurrencyField;