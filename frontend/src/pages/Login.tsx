import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Simple Client-Side Validations
    if (!email.includes("@")) {
      setValidationError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);

      navigate("/dashboard");

    } catch (error: any) {
      setValidationError(error.response?.data?.message || "Invalid Email or Password");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="split-container fade-in">
      
      {/* Left side hero branding illustration */}
      <div className="split-hero">
        <div style={{ maxWidth: "460px", textAlign: "left" }}>
          <span
            style={{
              padding: "6px 12px",
              borderRadius: "50px",
              backgroundColor: "rgba(255,255,255,0.15)",
              fontSize: "0.8rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "1px",
              display: "inline-block",
              marginBottom: "20px",
            }}
          >
            v2.1 Enterprise Ready
          </span>
          <h1 style={{ fontSize: "2.8rem", color: "white", marginBottom: "20px", fontWeight: 800, letterSpacing: "-1.5px" }}>
            Smart<span style={{ opacity: 0.85 }}>ERP</span> CRM
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: "1.6", opacity: 0.9, marginBottom: "30px" }}>
            Align employee directories, punch logs, attendance lists, and payroll computing tools in a high-security SaaS console.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem" }}>
              <span>🛡️</span> <strong>Stateless Authentication</strong> (JWT Security)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem" }}>
              <span>⚡</span> <strong>Real-Time Dashboards</strong> (Database aggregations)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.95rem" }}>
              <span>💼</span> <strong>Role-Based Access Control</strong> (Admin vs Employee permissions)
            </div>
          </div>
        </div>
      </div>

      {/* Right side login form */}
      <div className="split-form">
        <div
          className="glass-card scale-up"
          style={{
            width: "400px",
            maxWidth: "100%",
            padding: "36px",
            textAlign: "center",
            boxShadow: "none",
            border: "none",
          }}
        >
          <div style={{ marginBottom: "25px", textAlign: "left" }}>
            <h2>Welcome back</h2>
            <p style={{ color: "var(--text)", fontSize: "0.85rem", marginTop: "4px" }}>
              Please enter your credentials to sign in
            </p>
          </div>

          {validationError && (
            <div
              className="badge badge-danger"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "20px",
                textAlign: "left",
                justifyContent: "flex-start",
                textTransform: "none",
                fontWeight: 600,
                boxSizing: "border-box"
              }}
            >
              ⚠️ {validationError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  style={{ paddingRight: "40px" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    fontSize: "1.1rem",
                  }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? "👁️" : "🙈"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.95rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;