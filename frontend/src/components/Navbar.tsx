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
        padding: "15px 30px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg)",
        boxSizing: "border-box",
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "var(--accent)" }}>
          SmartERP CRM Console
        </h2>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>
            {userName}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--text)", textTransform: "capitalize" }}>
            {userRole}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            fontSize: "0.85rem",
            backgroundColor: "transparent",
            color: "var(--text-h)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-h)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;