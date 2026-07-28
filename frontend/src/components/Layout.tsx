import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Left Sidebar */}
      <Sidebar collapsed={collapsed} toggleCollapse={() => setCollapsed(!collapsed)} />

      {/* Right-side Content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Main Content */}
        <main style={{ flex: 1, padding: "30px 40px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
