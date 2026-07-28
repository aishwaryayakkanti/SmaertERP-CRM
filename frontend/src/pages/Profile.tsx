import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [apiMessage, setApiMessage] = useState("Loading credentials...");
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Employee";

  // Mock secondary details for UI completeness
  const userEmail = userName.toLowerCase().replace(/\s+/g, "") + "@company.com";
  const department = userRole.toLowerCase() === "admin" ? "Management / HR" : "Development Team";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setApiMessage(response.data.message);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setApiMessage("Failed to connect to security credentials.");
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "12px",
          backgroundColor: "var(--bg)",
          padding: "40px",
          boxShadow: "var(--shadow)",
          textAlign: "center",
        }}
      >
        {/* User avatar mockup */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "var(--accent-bg)",
            color: "var(--accent)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "20px",
            border: "2px solid var(--accent-border)",
          }}
        >
          {userName.charAt(0).toUpperCase()}
        </div>

        <h2 style={{ margin: "0 0 5px 0", fontSize: "1.6rem" }}>{userName}</h2>
        <span
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "50px",
            backgroundColor: "var(--accent-bg)",
            color: "var(--accent)",
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "30px",
          }}
        >
          {userRole}
        </span>

        {/* Profile Details List */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)" }}>Email Address</span>
            <strong style={{ color: "var(--text-h)" }}>{userEmail}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)" }}>Primary Department</span>
            <strong style={{ color: "var(--text-h)" }}>{department}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
            <span style={{ color: "var(--text)" }}>Security Level</span>
            <strong style={{ color: "var(--text-h)", textTransform: "capitalize" }}>{userRole} Privileges</strong>
          </div>
        </div>

        {/* Live API token connection check */}
        <div
          style={{
            backgroundColor: "var(--code-bg)",
            padding: "12px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            color: "var(--text)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#28a745", display: "inline-block" }}></span>
          <span>{apiMessage}</span>
        </div>
      </div>
    </div>
  );
}

export default Profile;