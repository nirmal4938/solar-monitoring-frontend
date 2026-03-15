import React from "react";
import { InputText } from "primereact/inputtext";
import FormField from "./FormField";

const TextField = ({
  label,
  value,
  onChange,
  required,
  error,
  name,
  placeholder,
  disabled,
}) => {
  return (
    <FormField label={label} required={required} error={error} htmlFor={name}>
      <InputText
        id={name}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full"
      />
    </FormField>
  );
};

export default TextField;