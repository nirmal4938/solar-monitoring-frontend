import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Card } from "primereact/card";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulate token validation (replace with API call)
  useEffect(() => {
    if (!token || token.length < 10) {
      setTokenValid(false);
    }
  }, [token]);

  const calculateStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[A-Z]/.test(pwd)) strength += 25;
    if (/[0-9]/.test(pwd)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 25;
    return strength;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (strength < 75) {
      return setError("Password does not meet enterprise security standards.");
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await new Promise((res) => setTimeout(res, 1500));

      setSuccess("Password successfully updated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError("Reset request failed. Token may be expired.");
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div
        className="flex align-items-center justify-content-center min-h-screen px-3"
        style={{
          background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        }}
      >
        <Card
          className="w-full md:w-6 lg:w-4"
          style={{
            borderRadius: "10px",
            border: "1px solid #e6e9ef",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Message
            severity="error"
            text="Invalid or expired reset token."
          />
          <Divider />
          <Button
            label="Return to Login"
            className="w-full"
            style={{
              backgroundColor: "#1e3a8a",
              border: "none",
              height: "42px",
            }}
            onClick={() => navigate("/login")}
          />
        </Card>
      </div>
    );
  }

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
              style={{ color: "#111827" }}
            >
              Set New Password
            </div>
            <div className="text-sm text-600">
              Secure enterprise credential update
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-column gap-4">

            {/* New Password */}
            <div className="flex flex-column gap-2">
              <label className="text-sm font-medium text-700">
                New Password
              </label>
              <Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                toggleMask
                feedback={false}
                inputStyle={{
                  height: "42px",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* Strength Indicator */}
            {password && (
              <div>
                <ProgressBar
                  value={strength}
                  style={{ height: "6px" }}
                />
                <div className="text-xs text-600 mt-1">
                  {strength < 50 && "Weak"}
                  {strength >= 50 && strength < 75 && "Moderate"}
                  {strength >= 75 && "Strong"}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="flex flex-column gap-2">
              <label className="text-sm font-medium text-700">
                Confirm Password
              </label>
              <Password
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                toggleMask
                feedback={false}
                inputStyle={{
                  height: "42px",
                  fontSize: "14px",
                }}
              />
            </div>

            {error && <Message severity="error" text={error} />}
            {success && <Message severity="success" text={success} />}

            <Button
              type="submit"
              label={loading ? "Updating..." : "Update Password"}
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
              Back to{" "}
              <span
                className="cursor-pointer"
                style={{ color: "#1e3a8a", fontWeight: 600 }}
                onClick={() => navigate("/login")}
              >
                Login
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