import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // TODO: connect to real API
      await new Promise((res) => setTimeout(res, 1200));

      setSuccess(
        "If this email exists in our system, a password reset link has been sent."
      );
      setEmail("");
    } catch (err) {
      setError("Unable to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex align-items-center justify-content-center min-h-screen px-3"
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
      }}
    >
      <div className="w-full md:w-6 lg:w-4">
        <Card
          style={{
            borderRadius: "10px",
            border: "1px solid #e6e9ef",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
            background: "#ffffff",
          }}
        >
          {/* Header */}
          <div className="mb-4">
            <div
              className="text-2xl font-semibold mb-2"
              style={{ color: "#111827", letterSpacing: "0.3px" }}
            >
              Reset Access Credentials
            </div>
            <div className="text-sm text-600">
              Secure enterprise password recovery
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-column gap-4">

            <div className="flex flex-column gap-2">
              <label className="text-sm font-medium text-700">
                Corporate Email
              </label>
              <InputText
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                placeholder="name@company.com"
                required
                style={{
                  height: "42px",
                  fontSize: "14px",
                }}
              />
            </div>

            {error && <Message severity="error" text={error} />}
            {success && <Message severity="success" text={success} />}

            <Button
              type="submit"
              label={loading ? "Processing..." : "Send Reset Link"}
              loading={loading}
              className="w-full"
              style={{
                backgroundColor: "#1e3a8a",
                border: "none",
                height: "42px",
                fontWeight: 500,
                letterSpacing: "0.4px",
              }}
            />

            <Divider />

            <div className="text-center text-sm text-600">
              Remember your credentials?{" "}
              <span
                className="cursor-pointer"
                style={{ color: "#1e3a8a", fontWeight: 600 }}
                onClick={() => navigate("/login")}
              >
                Return to Login
              </span>
            </div>
          </form>

          <div className="text-xs text-500 text-center mt-4">
            Secure • Encrypted • Enterprise identity management
          </div>
        </Card>
      </div>
    </div>
  );
}