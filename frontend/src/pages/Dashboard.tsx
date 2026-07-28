import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";

  const [data, setData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  });

  const recentActivities = [
    { text: "Leave request approved for Aishwarya", time: "10 mins ago", type: "success" },
    { text: "Attendance check-in logged for Employee ID #4", time: "30 mins ago", type: "info" },
    { text: "Employee record modified by Admin", time: "2 hours ago", type: "warning" },
  ];

  const events = [
    { title: "Monthly Operations Sync", date: "July 30, 2026", time: "10:00 AM" },
    { title: "HR Attendance Payroll Audit", date: "Aug 02, 2026", time: "02:00 PM" },
  ];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        setData(response.data.stats);
      } catch(error) {
        console.log("Dashboard Error:", error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      
      {/* Welcome header section */}
      <div
        className="glass-card"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
          border: "none",
          color: "white",
          padding: "30px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "left" }}>
          <h1 style={{ color: "white", fontSize: "1.8rem", fontWeight: 800, margin: 0 }}>
            Welcome back, {userName}!
          </h1>
          <p style={{ opacity: 0.9, marginTop: "6px", fontSize: "0.95rem" }}>
            Here is what's happening with your operations roster today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }} className="split-desktop-only">
          <button onClick={() => navigate("/leave")} className="btn-primary" style={{ backgroundColor: "rgba(255,255,255,0.2)", border: "none" }}>
            Apply Leave
          </button>
          <button onClick={() => navigate("/attendance")} className="btn-primary" style={{ backgroundColor: "white", color: "var(--primary)", border: "none" }}>
            Log Shift
          </button>
        </div>
      </div>

      {/* Stats Cards grid */}
      <div className="dashboard-grid">
        <Card title="Total Staff" value={data.totalEmployees} icon="👥" theme="primary" />
        <Card title="Active Shifts" value={data.presentToday} icon="✅" theme="success" />
        <Card title="Absent Today" value={data.absentToday} icon="❌" theme="danger" />
        <Card title="Leave Requests" value={data.pendingLeaves} icon="⏳" theme="warning" />
      </div>

      {/* Analytics Chart & Secondary Widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }} className="form-grid">
        
        {/* SVG Line Chart Card */}
        <div className="glass-card" style={{ textAlign: "left" }}>
          <h3 style={{ marginBottom: "20px" }}>Weekly Attendance Trends</h3>
          
          <div className="chart-container" style={{ height: "220px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {/* SVG line graph */}
            <svg viewBox="0 0 500 180" style={{ width: "100%", height: "150px" }}>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="var(--border)" strokeDasharray="5,5" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="var(--border)" strokeDasharray="5,5" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="var(--border)" strokeDasharray="5,5" />

              {/* Chart Line Path */}
              <path
                d="M 20 120 Q 100 80 180 50 T 340 90 T 480 30"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Glowing Area under line */}
              <path
                d="M 20 120 Q 100 80 180 50 T 340 90 T 480 30 L 480 150 L 20 150 Z"
                fill="url(#gradient)"
                opacity="0.1"
              />

              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--bg)" />
                </linearGradient>
              </defs>

              {/* Data points */}
              <circle cx="20" cy="120" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
              <circle cx="180" cy="50" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
              <circle cx="340" cy="90" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
              <circle cx="480" cy="30" r="5" fill="var(--primary)" stroke="white" strokeWidth="2" />
            </svg>
            
            {/* Axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text)", marginTop: "10px", padding: "0 10px" }}>
              <span>Monday</span>
              <span>Wednesday</span>
              <span>Friday</span>
              <span>Sunday</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Shortcuts */}
        <div className="glass-card" style={{ textAlign: "left", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ marginBottom: "15px" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                onClick={() => navigate("/employees")}
                className="btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px", width: "100%", fontSize: "0.85rem" }}
              >
                👥 Add New Employee Profile
              </button>
              <button
                onClick={() => navigate("/leave")}
                className="btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px", width: "100%", fontSize: "0.85rem" }}
              >
                📝 Review Time-Off Filings
              </button>
              <button
                onClick={() => navigate("/payroll")}
                className="btn-secondary"
                style={{ justifyContent: "flex-start", padding: "12px", width: "100%", fontSize: "0.85rem" }}
              >
                💰 Compute Monthly Payrolls
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Activity Logs and Upcoming Events widgets */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="form-grid">
        {/* Recent logs */}
        <div className="glass-card" style={{ textAlign: "left" }}>
          <h3 style={{ marginBottom: "18px" }}>Recent Activity Log</h3>
          <div>
            {recentActivities.map((act, index) => (
              <div key={index} className="activity-item">
                <span style={{ fontSize: "1.1rem" }}>
                  {act.type === "success" ? "🟢" : act.type === "warning" ? "🟡" : "🔵"}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-h)" }}>{act.text}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text)", marginTop: "2px" }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming calendar events */}
        <div className="glass-card" style={{ textAlign: "left" }}>
          <h3 style={{ marginBottom: "18px" }}>Upcoming HR Events</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {events.map((evt, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 20px",
                  borderRadius: "10px",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--text-h)" }}>{evt.title}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text)", marginTop: "4px" }}>
                    📅 {evt.date} • {evt.time}
                  </div>
                </div>
                <span style={{ fontSize: "1.2rem" }}>🔔</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

function Card(
  {
    title,
    value,
    icon,
    theme
  }:
  {
    title: string;
    value: number;
    icon: string;
    theme: string;
  }
) {
  return (
    <div
      className={`glass-card stat-card ${theme}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 24px",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {title}
        </span>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, marginTop: "6px", marginBottom: 0 }}>
          {value}
        </h1>
      </div>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "10px",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default Dashboard;