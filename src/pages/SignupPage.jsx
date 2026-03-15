import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    organization_name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="min-h-screen flex align-items-center justify-content-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <Card
        className="w-full md:w-5"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-soft)",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <div className="text-2xl font-semibold mb-3">
          Organization Onboarding
        </div>

        <Divider />

        <form onSubmit={handleSignup} className="grid gap-3">
          <div className="col-12 md:col-6">
            <label className="text-sm block mb-1">Executive Name</label>
            <InputText
              name="name"
              className="w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-12 md:col-6">
            <label className="text-sm block mb-1">Organization</label>
            <InputText
              name="organization_name"
              className="w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="text-sm block mb-1">Corporate Email</label>
            <InputText
              name="email"
              className="w-full"
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label className="text-sm block mb-1">Password</label>
            <Password
              name="password"
              className="w-full"
              feedback={false}
              toggleMask
              onChange={handleChange}
            />
          </div>

          {error && (
            <div className="col-12">
              <small style={{ color: "#b91c1c" }}>{error}</small>
            </div>
          )}

          <div className="col-12">
            <Button
              label="Create Organization"
              style={{
                background: "var(--accent-primary)",
                border: "none",
              }}
            />
          </div>
        </form>
      </Card>
    </div>
  );
}