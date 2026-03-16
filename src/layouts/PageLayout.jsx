import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const PageLayout = ({ title, children, showBack = true }) => {
  const navigate = useNavigate();

  return (
    <div className="page-layout-container">
      {/* Sticky Header */}
      <div className="page-header">
        <div className="flex align-items-center gap-4">
          {showBack && (
            <Button
              icon="pi pi-arrow-left"
              className="p-button-text p-button-sm"
              style={{ padding: "4px 6px", marginLeft: "2px" }}
              onClick={() => navigate(-1)}
            />
          )}
          {title && (
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                letterSpacing: "0.2px",
              }}
            >
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Page content */}
      <div className="page-content">{children}</div>

      <style>{`
        .page-layout-container {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #ffffff;
        }

        /* Sticky Header */
        .page-header {
          position: sticky;
          top: -30px;
          left: 0;
          right: 0;
          background: #ffffff;
          padding: 12px 16px;
          z-index: 1000;
          border-bottom: 1px solid #d1d5db;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }

        /* Page content should scroll under sticky header */
        .page-content {
          padding: 16px;
          flex: 1 0 auto;
        }
      `}</style>
    </div>
  );
};

export default PageLayout;
