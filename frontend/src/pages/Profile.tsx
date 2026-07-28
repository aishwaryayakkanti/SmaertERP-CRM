import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [apiMessage, setApiMessage] = useState("Checking security credentials...");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Employee";

  // Mock metadata details for UX completeness
  const userEmail = userName.toLowerCase().replace(/\s+/g, "") + "@company.com";
  const department = userRole.toLowerCase() === "admin" ? "Management & Security" : "Development Department";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setApiMessage(response.data.message);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setApiMessage("Failed to connect to authentication server.");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="fade-in" style={{ padding: "30px 20px" }}>
      <div
        className="glass-card scale-up"
        style={{
          maxWidth: "580px",
          margin: "0 auto",
          padding: "40px",
          textAlign: "center",
        }}
      >
        {/* Profile Avatar */}
        <div className="profile-avatar-circle">
          {userName.charAt(0).toUpperCase()}
        </div>

        <h2 style={{ marginBottom: "6px" }}>{userName}</h2>
        <span
          className="badge badge-success"
          style={{
            padding: "6px 16px",
            fontSize: "0.8rem",
            fontWeight: 700,
            marginBottom: "35px",
          }}
        >
          {userRole} Mode
        </span>

        {/* Profile Details List */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "16px", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>Email Address</span>
            <strong style={{ color: "var(--text-h)" }}>{userEmail}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>Department Assignment</span>
            <strong style={{ color: "var(--text-h)" }}>{department}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)", fontWeight: 500 }}>Access Authority</span>
            <strong style={{ color: "var(--text-h)", textTransform: "capitalize" }}>{userRole} Level</strong>
          </div>
        </div>

        {/* Live server security check status badge */}
        <div
          style={{
            backgroundColor: "var(--primary-bg)",
            padding: "14px 20px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            color: "var(--primary)",
            border: "1px solid var(--primary-border)",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            fontWeight: 600,
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#2ec4b6", display: "inline-block" }}></span>
          <span>{apiMessage}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;