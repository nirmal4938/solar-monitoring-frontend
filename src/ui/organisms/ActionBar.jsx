import React from "react";
import AppButton from "../atoms/AppButton";

/**
 * Props:
 * - onCancel: () => void
 * - onSubmit: () => void
 * - submitLabel?: string
 * - loading?: boolean
 */
const ActionBar = ({ onCancel, onSubmit, submitLabel = "Save", loading }) => {
  return (
    <div className="bb-action-bar">
      <AppButton
        label="Cancel"
        severity="secondary"
        onClick={onCancel}
        className="bb-btn-secondary"
      />
      <AppButton
        label={submitLabel}
        icon="pi pi-check"
        severity="primary"
        loading={loading}
        onClick={onSubmit}
        className="bb-btn-primary"
      />
      <style>{`
        .bb-action-bar {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          padding: 1.25rem 2rem;
          background: #ffffff;
          border-top: 1px solid #e5e7eb;
          border-radius: 0 0 8px 8px;
          margin-top: 2rem;
        }
        .bb-btn-primary {
          background-color: #111827 !important;
          border-color: #111827 !important;
        }
        .bb-btn-primary:hover {
          background-color: #000000 !important;
        }
        .bb-btn-secondary {
          background-color: #ffffff !important;
          border-color: #d1d5db !important;
          color: #374151 !important;
        }
      `}</style>
    </div>
  );
};

export default ActionBar;