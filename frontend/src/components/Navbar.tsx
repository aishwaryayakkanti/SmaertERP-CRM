import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Employee";

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, text: "Aishwarya filed a leave request", time: "5 mins ago" },
    { id: 2, text: "Payroll calculations compiled for July", time: "1 hour ago" },
    { id: 3, text: "New employee check-in log: John Doe", time: "2 hours ago" },
  ];

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
        padding: "16px 40px",
        borderBottom: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        boxSizing: "border-box",
        position: "relative",
        zIndex: 500,
      }}
    >
      {/* Left Search Box */}
      <div style={{ position: "relative", width: "300px" }}>
        <input
          type="text"
          placeholder="Search records, leaves, employees..."
          className="form-input"
          style={{
            padding: "8px 14px 8px 36px",
            fontSize: "0.85rem",
            borderRadius: "20px",
            backgroundColor: "var(--bg)",
          }}
        />
        <span
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "0.9rem",
            color: "var(--text)",
          }}
        >
          🔍
        </span>
      </div>

      {/* Right Action Icons & Badges */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        
        {/* Notifications Icon with overlay dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.3rem",
              cursor: "pointer",
              padding: "5px",
              color: "var(--text-h)",
              display: "flex",
              position: "relative",
            }}
            title="Notifications"
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: "2px",
                right: "2px",
                width: "8px",
                height: "8px",
                backgroundColor: "var(--danger)",
                borderRadius: "50%",
              }}
            ></span>
          </button>

          {showNotifications && (
            <div
              className="glass-card scale-up"
              style={{
                position: "absolute",
                top: "40px",
                right: "-10px",
                width: "280px",
                padding: "15px",
                zIndex: 600,
                textAlign: "left",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", borderBottom: "1px solid var(--border)", paddingBottom: "6px" }}>
                Notifications
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ fontSize: "0.8rem", color: "var(--text-h)" }}>
                    <div>{n.text}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text)", marginTop: "2px" }}>{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown button */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                backgroundColor: "var(--primary-bg)",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "1rem",
                border: "1px solid var(--primary-border)",
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div style={{ textAlign: "left" }} className="split-desktop-only">
              <div style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.85rem", lineHeight: "1.2" }}>
                {userName}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text)", textTransform: "capitalize" }}>
                {userRole}
              </div>
            </div>
            <span style={{ fontSize: "0.7rem", color: "var(--text)" }}>▼</span>
          </button>

          {showProfileMenu && (
            <div
              className="glass-card scale-up"
              style={{
                position: "absolute",
                top: "45px",
                right: 0,
                width: "160px",
                padding: "8px",
                zIndex: 600,
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  navigate("/profile");
                }}
                className="btn-secondary"
                style={{
                  width: "100%",
                  border: "none",
                  justifyContent: "flex-start",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                }}
              >
                👤 Profile Settings
              </button>
              <div style={{ height: "1px", backgroundColor: "var(--border)" }}></div>
              <button
                onClick={handleLogout}
                className="btn-danger"
                style={{
                  width: "100%",
                  border: "none",
                  justifyContent: "flex-start",
                  padding: "8px 12px",
                  fontSize: "0.85rem",
                  backgroundColor: "rgba(239, 68, 68, 0.08)",
                }}
              >
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Navbar;