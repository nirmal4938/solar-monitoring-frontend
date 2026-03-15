import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex align-items-center justify-content-center p-4"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="grid w-full max-w-6xl">
        {/* Left Executive Intro */}
        <div className="col-12 md:col-6 flex flex-column justify-content-center p-5">
          <h1
            className="text-5xl font-semibold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Carbon Intelligence Platform
          </h1>

          <p
            className="text-lg line-height-3 mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Enterprise Solar Monitoring, Battery Intelligence,
            ESG Analytics & Energy Finance — unified in one
            Bloomberg-grade operational console.
          </p>

          <div className="flex gap-3">
            <Link to="/login">
              <Button
                label="Login"
                className="p-button-sm"
                style={{ background: "var(--accent-primary)", border: "none" }}
              />
            </Link>

            <Link to="/signup">
              <Button
                label="Request Access"
                className="p-button-outlined p-button-sm"
              />
            </Link>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="col-12 md:col-6 p-5">
          <Card
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-soft)",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <div className="grid text-sm">
              <div className="col-6 mb-3">
                <div className="font-semibold">Multi-Tenant SaaS</div>
                <div className="text-color-secondary">
                  Org-isolated architecture
                </div>
              </div>

              <div className="col-6 mb-3">
                <div className="font-semibold">RBAC Engine</div>
                <div className="text-color-secondary">
                  Enterprise permission model
                </div>
              </div>

              <div className="col-6 mb-3">
                <div className="font-semibold">Carbon Accounting</div>
                <div className="text-color-secondary">
                  Grid emission + REC modeling
                </div>
              </div>

              <div className="col-6 mb-3">
                <div className="font-semibold">Energy Intelligence</div>
                <div className="text-color-secondary">
                  Generation + Storage analytics
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}