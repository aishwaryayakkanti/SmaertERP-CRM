import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [apiMessage, setApiMessage] = useState("Checking security credentials...");
  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'security'
  
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "Employee";

  // Form States
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [address, setAddress] = useState("120 Enterprise Way, Suite 400, Silicon Valley, CA");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userEmail = userName.toLowerCase().replace(/\s+/g, "") + "@company.com";
  const department = userRole.toLowerCase() === "admin" ? "Management & Administration" : "Engineering Department";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        setApiMessage(response.data.message);
      } catch (error) {
        console.error("Profile fetch error:", error);
        setApiMessage("Failed to verify active JWT token.");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters.");
      return;
    }
    alert("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>My Profile</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Configure your security credentials, personal contact information, and preferences.
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "30px" }} className="form-grid">
        
        {/* Left Side Profile Card */}
        <div
          className="glass-card"
          style={{
            padding: "40px 30px",
            textAlign: "center",
            height: "fit-content",
          }}
        >
          <div className="profile-avatar-circle">
            {userName.charAt(0).toUpperCase()}
          </div>

          <h2 style={{ marginBottom: "6px" }}>{userName}</h2>
          <span className="badge badge-success" style={{ padding: "6px 16px", marginBottom: "30px" }}>
            {userRole} Mode
          </span>

          <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>Email Address</span>
              <strong style={{ color: "var(--text-h)", fontSize: "0.85rem" }}>{userEmail}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--text)", fontSize: "0.85rem" }}>Department</span>
              <strong style={{ color: "var(--text-h)", fontSize: "0.85rem" }}>{department}</strong>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "var(--primary-bg)",
              padding: "10px 15px",
              borderRadius: "8px",
              fontSize: "0.8rem",
              color: "var(--primary)",
              border: "1px solid var(--primary-border)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#2ec4b6", display: "inline-block" }}></span>
            <span>{apiMessage}</span>
          </div>
        </div>

        {/* Right Side Settings Tabs Container */}
        <div className="glass-card" style={{ padding: "30px", textAlign: "left" }}>
          {/* Tab buttons */}
          <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid var(--border)", marginBottom: "25px" }}>
            <button
              onClick={() => setActiveTab("details")}
              style={{
                background: "none",
                border: "none",
                padding: "10px 0 14px 0",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: activeTab === "details" ? "var(--primary)" : "var(--text)",
                borderBottom: `2px solid ${activeTab === "details" ? "var(--primary)" : "transparent"}`,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              Contact Details
            </button>
            <button
              onClick={() => setActiveTab("security")}
              style={{
                background: "none",
                border: "none",
                padding: "10px 0 14px 0",
                fontSize: "0.95rem",
                fontWeight: 700,
                color: activeTab === "security" ? "var(--primary)" : "var(--text)",
                borderBottom: `2px solid ${activeTab === "security" ? "var(--primary)" : "transparent"}`,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              Security Settings
            </button>
          </div>

          {/* Details tab view */}
          {activeTab === "details" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <form onSubmit={(e) => { e.preventDefault(); alert("Profile contact details updated!"); }}>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "25px" }}>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Save Settings
                </button>
              </form>
            </div>
          )}

          {/* Security tab view */}
          {activeTab === "security" && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <form onSubmit={handleUpdatePassword}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "25px" }}>
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Retype password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <button type="submit" className="btn-primary">
                  Change Password
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Profile;