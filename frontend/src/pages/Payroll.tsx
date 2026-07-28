import { useEffect, useState } from "react";
import api from "../services/api";

interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
}

function Payroll() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees");
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Error loading employees for payroll:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const calculatePayslip = (annualSalary: number) => {
    const grossMonthly = Math.round(annualSalary / 12);
    const tax = Math.round(grossMonthly * 0.15); // 15% standard tax
    const benefits = 150; // Flat medical and welfare benefits deduction
    const netMonthly = grossMonthly - tax - benefits;

    return {
      grossMonthly,
      tax,
      benefits,
      netMonthly,
    };
  };

  // Compute overall payroll stats
  const totalMonthlyPayroll = employees.reduce((sum, emp) => sum + Math.round(emp.salary / 12), 0);
  const totalMonthlyTax = employees.reduce((sum, emp) => sum + Math.round(Math.round(emp.salary / 12) * 0.15), 0);
  const netDisbursements = totalMonthlyPayroll - totalMonthlyTax - (employees.length * 150);

  return (
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Payroll Center</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Audit employee compensation sheets, tax withholdings, and dispatch pay slip advices.
          </p>
        </div>
      </div>

      {/* Salary Overview Cards */}
      <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
        <div className="glass-card stat-card primary" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Monthly Total Gross</span>
            <h2 style={{ fontSize: "1.6rem", marginTop: "4px" }}>${totalMonthlyPayroll.toLocaleString()}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>💰</span>
        </div>
        <div className="glass-card stat-card danger" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Tax Withholding</span>
            <h2 style={{ fontSize: "1.6rem", marginTop: "4px" }}>-${totalMonthlyTax.toLocaleString()}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>⚖️</span>
        </div>
        <div className="glass-card stat-card success" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Net Disbursed</span>
            <h2 style={{ fontSize: "1.6rem", marginTop: "4px" }}>${netDisbursements.toLocaleString()}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>🟢</span>
        </div>
        <div className="glass-card stat-card warning" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)" }}>Benefit Deductions</span>
            <h2 style={{ fontSize: "1.6rem", marginTop: "4px" }}>-${(employees.length * 150).toLocaleString()}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>🏥</span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text)" }}>Loading registers...</div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Employee Details</th>
                <th>Annual Base</th>
                <th>Monthly Base</th>
                <th>Net Payout</th>
                <th style={{ textAlign: "right" }}>Payslip Advice</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                    No employees structures configured.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  const pay = calculatePayslip(emp.salary);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{emp.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text)", marginTop: "2px" }}>{emp.position}</div>
                      </td>
                      <td>${emp.salary.toLocaleString()}</td>
                      <td>${pay.grossMonthly.toLocaleString()}</td>
                      <td><strong style={{ color: "var(--primary)" }}>${pay.netMonthly.toLocaleString()}</strong></td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          onClick={() => setSelectedEmp(emp)}
                          className="btn-secondary"
                          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
                        >
                          View Advice
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Floating Payslip Modal Dialog Overlay */}
      {selectedEmp && (
        <div className="modal-overlay">
          <div className="modal-sheet scale-up" style={{ width: "450px" }}>
            <div className="payslip-dashed-line" style={{ textAlign: "center", position: "relative" }}>
              <h3 style={{ margin: 0, textTransform: "uppercase", fontSize: "1.1rem" }}>Payslip Advice</h3>
              <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "4px" }}>
                SmartERP CRM Ltd • Monthly Earnings Breakdown
              </div>
              <button
                onClick={() => setSelectedEmp(null)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--text)",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.85rem", marginBottom: "20px" }}>
              <div><span style={{ color: "var(--text)" }}>Employee:</span> <strong>{selectedEmp.name}</strong></div>
              <div><span style={{ color: "var(--text)" }}>Roster ID:</span> <strong>#{selectedEmp.id}</strong></div>
              <div><span style={{ color: "var(--text)" }}>Position:</span> <strong>{selectedEmp.position}</strong></div>
              <div><span style={{ color: "var(--text)" }}>Department:</span> <strong>{selectedEmp.department}</strong></div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ color: "var(--text)" }}>Basic Salary (Monthly Gross)</span>
                <strong>${calculatePayslip(selectedEmp.salary).grossMonthly.toLocaleString()}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", color: "var(--danger)" }}>
                <span>Income Tax Withholding (15%)</span>
                <span>-${calculatePayslip(selectedEmp.salary).tax.toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", color: "var(--danger)" }}>
                <span>Medical Welfare Deduction</span>
                <span>-${calculatePayslip(selectedEmp.salary).benefits.toLocaleString()}</span>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "var(--primary-bg)",
                padding: "16px 20px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid var(--primary-border)",
                marginBottom: "24px"
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.85rem" }}>NET DISBURSED AMOUNT</span>
              <strong style={{ fontSize: "1.3rem", color: "var(--primary)", fontWeight: 800 }}>
                ${calculatePayslip(selectedEmp.salary).netMonthly.toLocaleString()}
              </strong>
            </div>

            <button
              onClick={() => alert("Dispatching advice slip print job...")}
              className="btn-primary"
              style={{ width: "100%", padding: "12px" }}
            >
              🖨️ Print Payslip Advice
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Payroll;