import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { useLoader } from "../context/LoadingContext";
import { useEffect, useRef } from "react";

/* ======================================================
   ⚡ 3D ENERGY GRID LOADER
====================================================== */

function EnergyGridLoader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const lines = [];
    const count = 40;

    for (let i = 0; i < count; i++) {
      lines.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.5,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(30,58,138,0.15)";
      ctx.lineWidth = 1;

      lines.forEach((l) => {
        ctx.beginPath();
        ctx.moveTo(l.x, 0);
        ctx.lineTo(l.x, height);
        ctx.stroke();

        l.x += l.speed;

        if (l.x > width) l.x = 0;
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#f8fafc",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas ref={canvasRef} />

      <div
        style={{
          position: "absolute",
          textAlign: "center",
          fontWeight: 600,
          color: "#1e3a8a",
          fontSize: 16,
        }}
      >
        Authenticating Secure Session...
      </div>
    </div>
  );
}

/* ======================================================
   🔐 LOGIN PAGE
====================================================== */

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showLoader, hideLoader } = useLoader();

  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid corporate email")
      .required("Corporate email required"),

    password: Yup.string()
      .min(6, "Minimum 6 characters")
      .required("Password required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,

    onSubmit: async (values) => {
      setServerError("");
      showLoader();
      try {
        await login(values.email, values.password);
        navigate("/app");
      } catch (error) {
        setServerError(
          error?.response?.data?.message ||
            "Authentication failed. Verify your credentials.",
        );
      } finally {
        hideLoader();
      }
    },
  });

  return (
    <>
      {/* {loading && <EnergyGridLoader />} */}

      <div
        className="flex min-h-screen"
        style={{
          background: "linear-gradient(180deg,#f8fafc 0%,#eef2f7 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* LEFT ENTERPRISE PANEL */}

        <div
          className="hidden lg:flex flex-column justify-content-center px-8"
          style={{
            width: "50%",
            background: "#0f172a",
            color: "#fff",
          }}
        >
          <div style={{ maxWidth: 440 }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{
                fontSize: 38,
                fontWeight: 700,
                marginBottom: 16,
                letterSpacing: "-0.5px",
              }}
            >
              Energy Intelligence Cloud
            </motion.div>

            <div
              style={{
                fontSize: 16,
                lineHeight: 1.7,
                opacity: 0.85,
              }}
            >
              Real-time solar monitoring, predictive analytics, carbon
              intelligence and enterprise-grade plant operations management.
            </div>

            <Divider />

            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                opacity: 0.7,
              }}
            >
              Multi-tenant secure platform with role-based access control,
              operational alerts and ESG reporting infrastructure.
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN */}

        <div className="flex align-items-center justify-content-center w-full lg:w-6 px-4">
          <div style={{ maxWidth: 420, width: "100%" }}>
            {/* CARD MICRO ANIMATION */}

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                style={{
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                }}
              >
                {/* HEADER */}

                <div className="mb-4">
                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    Secure Platform Login
                  </div>

                  <div className="text-sm text-600">
                    Authenticate to access your energy infrastructure data
                  </div>
                </div>

                <form
                  onSubmit={formik.handleSubmit}
                  className="flex flex-column gap-4"
                >
                  {/* EMAIL */}

                  <div className="flex flex-column gap-2">
                    <label className="text-sm font-medium">
                      Corporate Email
                    </label>

                    <InputText
                      name="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full ${
                        formik.touched.email && formik.errors.email
                          ? "p-invalid"
                          : ""
                      }`}
                      style={{ height: 44 }}
                    />

                    {formik.touched.email && formik.errors.email && (
                      <small className="p-error">{formik.errors.email}</small>
                    )}
                  </div>

                  {/* PASSWORD */}

                  <div
                    className="flex flex-column gap-2 w-full"
                    style={{ width: "100%" }}
                  >
                    <label className="text-sm font-medium">Password</label>

                    <Password
                      name="password"
                      value={formik.values.password}
                      onChange={(e) =>
                        formik.setFieldValue("password", e.target.value)
                      }
                      onBlur={formik.handleBlur}
                      toggleMask
                      feedback={false}
                      className="w-full block"
                      inputClassName="w-full block flex"
                      inputStyle={{ height: 44 }}
                      placeholder="Enter password"
                    />

                    {formik.touched.password && formik.errors.password && (
                      <small className="p-error">
                        {formik.errors.password}
                      </small>
                    )}
                  </div>

                  {/* FORGOT PASSWORD */}

                  <div className="flex justify-content-end">
                    <span
                      className="cursor-pointer text-sm"
                      style={{
                        color: "#1e3a8a",
                        fontWeight: 500,
                      }}
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </span>
                  </div>

                  {/* ERROR */}

                  {serverError && (
                    <Message severity="error" text={serverError} />
                  )}

                  {/* LOGIN BUTTON */}

                  <Button
                    type="submit"
                    label={loading ? "Authenticating..." : "Login"}
                    className="w-full login-btn"
                    style={{
                      height: 44,
                      backgroundColor: "#1e3a8a",
                      border: "none",
                    }}
                  />

                  <Divider />

                  {/* SIGNUP */}

                  <div className="text-center text-sm text-600">
                    New organization?{" "}
                    <span
                      className="cursor-pointer"
                      style={{
                        color: "#1e3a8a",
                        fontWeight: 600,
                      }}
                      onClick={() => navigate("/signup")}
                    >
                      Create workspace
                    </span>
                  </div>
                </form>

                {/* FOOTER */}

                <div className="text-center text-xs text-500 mt-4">
                  Secure authentication • RBAC protected • Audit-logged access
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* SUBTLE BUTTON INTERACTION */}

      <style>{`
        .login-btn:hover{
          transform: translateY(-1px);
          box-shadow:0 6px 16px rgba(0,0,0,0.12);
          transition:all .2s ease;
        }
      `}</style>
    </>
  );
}
