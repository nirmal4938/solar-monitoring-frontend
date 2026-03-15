import React from "react";
import { Message } from "primereact/message";

const AppError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-2">
      <Message severity="error" text={message} />
    </div>
  );
};

export default AppError;