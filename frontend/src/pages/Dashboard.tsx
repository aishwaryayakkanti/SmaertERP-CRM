import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [data, setData] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    totalLeaves: 0,
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0
  });

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
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>System Roster Aggregates</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Real-time analytics and employee presence matrices.
          </p>
        </div>
      </div>

      {/* Roster cards list grid */}
      <div className="dashboard-grid">
        <Card
          title="Total Employees"
          value={data.totalEmployees}
          icon="👥"
          theme="primary"
          delayClass="delay-1"
        />
        <Card
          title="Present Today"
          value={data.presentToday}
          icon="✅"
          theme="success"
          delayClass="delay-2"
        />
        <Card
          title="Absent Today"
          value={data.absentToday}
          icon="❌"
          theme="danger"
          delayClass="delay-3"
        />
        <Card
          title="Total Leaves"
          value={data.totalLeaves}
          icon="📝"
          theme="warning"
          delayClass="delay-4"
        />
        <Card
          title="Pending Leaves"
          value={data.pendingLeaves}
          icon="⏳"
          theme="warning"
          delayClass="delay-1"
        />
        <Card
          title="Approved Leaves"
          value={data.approvedLeaves}
          icon="👍"
          theme="success"
          delayClass="delay-2"
        />
        <Card
          title="Rejected Leaves"
          value={data.rejectedLeaves}
          icon="👎"
          theme="danger"
          delayClass="delay-3"
        />
      </div>
    </div>
  );
}

function Card(
  {
    title,
    value,
    icon,
    theme,
    delayClass
  }:
  {
    title: string;
    value: number;
    icon: string;
    theme: string;
    delayClass: string;
  }
) {
  return (
    <div
      className={`glass-card stat-card ${theme} ${delayClass}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 30px",
        minHeight: "130px",
      }}
    >
      <div style={{ textAlign: "left" }}>
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "var(--text)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </span>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "8px", marginBottom: 0 }}>
          {value}
        </h1>
      </div>
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "14px",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.6rem",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)",
        }}
      >
        {icon}
      </div>
    </div>
  );
}

export default Dashboard;