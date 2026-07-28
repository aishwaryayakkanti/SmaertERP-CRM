import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Employee";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    alert("Logged out successfully");
    navigate("/", { replace: true });
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 40px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h3 style={{ margin: 0, color: "var(--text-h)", fontWeight: 700 }}>
          Dashboard Console
        </h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        {/* User profile identifier */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              backgroundColor: "var(--primary-bg)",
              color: "var(--primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "1.1rem",
              border: "1px solid var(--primary-border)",
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.95rem", lineHeight: "1.2" }}>
              {userName}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em", marginTop: "2px" }}>
              {userRole}
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div style={{ width: "1px", height: "24px", backgroundColor: "var(--border)" }}></div>

        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{
            padding: "8px 16px",
            fontSize: "0.85rem",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;