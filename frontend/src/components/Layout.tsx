import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "var(--bg)" }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right-side Content area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Main Content */}
        <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
