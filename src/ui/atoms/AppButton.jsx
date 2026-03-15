import React from "react";
import { Button } from "primereact/button";

const AppButton = ({
  label,
  icon,
  severity = "primary",
  loading,
  disabled,
  onClick,
  type = "button",
}) => {
  return (
    <Button
      type={type}
      label={label}
      icon={icon}
      severity={severity}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      className="p-button-sm"
    />
  );
};

export default AppButton;