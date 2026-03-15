import React from "react";

const AppLabel = ({ label, required, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className="font-medium text-900">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export default AppLabel;