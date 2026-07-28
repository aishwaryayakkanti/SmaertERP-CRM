import { NavLink } from "react-router-dom";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Employees", path: "/employees" },
    { name: "Attendance", path: "/attendance" },
    { name: "Leave Management", path: "/leave" },
    { name: "Payroll", path: "/payroll" },
    { name: "My Profile", path: "/profile" },
  ];

  return (
    <aside
      style={{
        width: "250px",
        minWidth: "250px",
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        padding: "30px 15px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "40px", paddingLeft: "15px" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0, letterSpacing: "-0.5px" }}>
          Smart<span style={{ color: "var(--accent)" }}>ERP</span>
        </h1>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              padding: "12px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 550,
              color: isActive ? "var(--accent)" : "var(--text)",
              backgroundColor: isActive ? "var(--accent-bg)" : "transparent",
              border: isActive ? "1px solid var(--accent-border)" : "1px solid transparent",
              transition: "all 0.2s ease-in-out",
            })}
            onMouseEnter={(e) => {
              if (e.currentTarget.style.backgroundColor !== "var(--accent-bg)") {
                e.currentTarget.style.backgroundColor = "var(--code-bg)";
                e.currentTarget.style.color = "var(--text-h)";
              }
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget.style.backgroundColor !== "var(--accent-bg)") {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--text)";
              }
            }}
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;