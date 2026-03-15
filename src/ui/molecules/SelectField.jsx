import React from "react";
import { Dropdown } from "primereact/dropdown";
import FormField from "./FormField";

const SelectField = ({
  label,
  value,
  onChange,
  required,
  error,
  name,
  options = [],
  optionLabel = "label",
  optionValue = "value",
  placeholder = "Select",
  disabled,
}) => {
  return (
    <FormField label={label} required={required} error={error} htmlFor={name}>
      <Dropdown
        id={name}
        value={value}
        options={options}
        onChange={(e) => onChange(e.value)}
        optionLabel={optionLabel}
        optionValue={optionValue}
        placeholder={placeholder}
        className="w-full"
        disabled={disabled}
      />
    </FormField>
  );
};

export default SelectField;