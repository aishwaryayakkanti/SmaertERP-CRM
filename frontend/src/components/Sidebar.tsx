import { NavLink } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

function Sidebar({ collapsed, toggleCollapse }: SidebarProps) {
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
      className="sidebar-container"
      style={{
        width: collapsed ? "80px" : "260px",
        minWidth: collapsed ? "80px" : "260px",
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--bg-card)",
        display: "flex",
        flexDirection: "column",
        padding: "30px 15px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          marginBottom: "40px",
          paddingLeft: collapsed ? "0" : "12px",
          height: "40px",
        }}
      >
        {!collapsed && (
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, letterSpacing: "-1px" }}>
            Smart<span style={{ color: "var(--primary)" }}>ERP</span>
          </h1>
        )}

        <button
          onClick={toggleCollapse}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "var(--text)",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
          }}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>

      {/* Navigation menu list */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? "0" : "14px",
              padding: "12px 18px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: isActive ? "var(--primary)" : "var(--text)",
              backgroundColor: isActive ? "var(--primary-bg)" : "transparent",
              border: `1px solid ${isActive ? "var(--primary-border)" : "transparent"}`,
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            })}
            title={collapsed ? link.name : ""}
          >
            <span style={{ fontSize: "1.2rem" }}>{link.icon}</span>
            {!collapsed && <span>{link.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;