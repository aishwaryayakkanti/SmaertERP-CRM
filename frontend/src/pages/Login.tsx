import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userName", response.data.user.name);
      localStorage.setItem("userRole", response.data.user.role);

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {
      alert("Invalid Email or Password");
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        className="glass-card scale-up"
        style={{
          width: "420px",
          maxWidth: "100%",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {/* Brand Logo Display */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-1px" }}>
            Smart<span style={{ color: "var(--primary)" }}>ERP</span>
          </h1>
          <p style={{ color: "var(--text)", fontSize: "0.9rem", marginTop: "6px" }}>
            Administrative Console Gateway
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: "25px" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{
              width: "100%",
              padding: "12px",
              fontSize: "0.95rem",
            }}
          >
            Sign In to Panel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;