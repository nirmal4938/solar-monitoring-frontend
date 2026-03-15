import React from "react";
import { Card } from "primereact/card";

const FormSectionCard = ({ title, subtitle, children }) => {
  return (
    <Card
      title={title}
      subTitle={subtitle}
      className="mb-4 shadow-1 border-round-xl"
    >
      <div className="p-fluid">{children}</div>
    </Card>
  );
};

export default FormSectionCard;