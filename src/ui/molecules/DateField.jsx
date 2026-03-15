import React from "react";
import { Calendar } from "primereact/calendar";
import FormField from "./FormField";

const DateField = ({
  label,
  value,
  onChange,
  required,
  error,
  name,
  showTime = false,
  disabled,
}) => {
  return (
    <FormField label={label} required={required} error={error} htmlFor={name}>
      <Calendar
        id={name}
        value={value}
        onChange={(e) => onChange(e.value)}
        showTime={showTime}
        dateFormat="yy-mm-dd"
        className="w-full"
        disabled={disabled}
      />
    </FormField>
  );
};

export default DateField;