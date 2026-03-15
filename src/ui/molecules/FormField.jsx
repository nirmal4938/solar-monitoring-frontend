import React from "react";
import AppLabel from "../atoms/AppLabel";
import AppError from "../atoms/AppError";

const FormField = ({
  label,
  required,
  error,
  htmlFor,
  children,
}) => {
  return (
    <div className="field mb-4">
      {label && (
        <div className="mb-2">
          <AppLabel label={label} required={required} htmlFor={htmlFor} />
        </div>
      )}
      {children}
      <AppError message={error} />
    </div>
  );
};

export default FormField;