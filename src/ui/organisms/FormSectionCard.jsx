import React from "react";
import { Card } from "primereact/card";

const FormSectionCard = ({ title, subtitle, children }) => {
  return (
    <Card
      title={title}
      subTitle={subtitle}
      className="mb-4 shadow-1 border-round-xl"
      pt={{
        header: {
          className: "px-1 border-round-top-lg flex align-items-center",
        },
        title: {
          className:
            "bg-blue-100 text-sm font-semibold text-blue-900 py-2 px-4",
        },
        subTitle: {
          className: "text-xs text-blue-700",
        },
        body: {
          className: "p-0",
        },
        content: {
          className: "px-4",
        },
      }}
    >
      <div className="p-fluid">{children}</div>
    </Card>
  );
};

export default FormSectionCard;
