import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Employees", path: "/employees", icon: "👥" },
    { name: "Attendance", path: "/attendance", icon: "📅" },
    { name: "Leave Requests", path: "/leave", icon: "📝" },
    { name: "Payroll", path: "/payroll", icon: "💰" },
    { name: "My Profile", path: "/profile", icon: "👤" },
  ];

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        display: "flex",
        flexDirection: "column",
        padding: "30px 20px",
        boxSizing: "border-box",
      }}
    >
      {/* Brand Header */}
      <div style={{ marginBottom: "40px", paddingLeft: "12px" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, letterSpacing: "-1px" }}>
          Smart<span style={{ color: "var(--primary)" }}>ERP</span>
        </h1>
      </div>

      {/* Navigation menu list */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "14px 20px",
              borderRadius: "12px",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 600,
              color: isActive ? "var(--primary)" : "var(--text)",
              backgroundColor: isActive ? "var(--primary-bg)" : "transparent",
              border: `1px solid ${isActive ? "var(--primary-border)" : "transparent"}`,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            })}
            onMouseEnter={(e) => {
              if (e.currentTarget.style.color !== "var(--primary)") {
                e.currentTarget.style.backgroundColor = "var(--bg)";
                e.currentTarget.style.color = "var(--text-h)";
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget.style.color !== "var(--primary)") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text)";
              }
            }}
          >
            <span style={{ fontSize: "1.1rem" }}>{link.icon}</span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;