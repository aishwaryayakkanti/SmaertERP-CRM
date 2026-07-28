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

  return (
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Payroll Center</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Compute employee compensation scales, tax withholdings, and print generated advices.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text)" }}>Loading payroll registers...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedEmp ? "1.2fr 1fr" : "1fr", gap: "30px", alignItems: "start" }}>
          
          {/* Employee Salary List */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Annual Base</th>
                  <th>Monthly Gross</th>
                  <th>Net Payout</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                      No payroll structures configured.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const pay = calculatePayslip(emp.salary);
                    return (
                      <tr
                        key={emp.id}
                        style={{
                          backgroundColor: selectedEmp?.id === emp.id ? "var(--primary-bg)" : "transparent",
                        }}
                      >
                        <td style={{ padding: "15px" }}>
                          <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{emp.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "2px" }}>{emp.position}</div>
                        </td>
                        <td>${emp.salary.toLocaleString()}</td>
                        <td>${pay.grossMonthly.toLocaleString()}</td>
                        <td><strong style={{ color: "var(--primary)" }}>${pay.netMonthly.toLocaleString()}</strong></td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            onClick={() => setSelectedEmp(emp)}
                            className="btn-secondary"
                            style={{
                              padding: "6px 12px",
                              fontSize: "0.8rem",
                            }}
                          >
                            View payslip
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Payslip Advice Panel */}
          {selectedEmp && (
            <div
              className="glass-card scale-up"
              style={{
                padding: "30px",
                borderColor: "var(--primary-border)",
                backgroundColor: "var(--bg-card)",
                boxShadow: "var(--shadow)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedEmp(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.4rem",
                  cursor: "pointer",
                  color: "var(--text)",
                  padding: 0,
                  width: "auto",
                }}
              >
                ✕
              </button>

              <div className="payslip-dashed-line" style={{ textAlign: "center" }}>
                <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Payslip Advice</h3>
                <div style={{ fontSize: "0.8rem", color: "var(--text)", marginTop: "6px", fontWeight: 600 }}>
                  SmartERP CRM Ltd • Monthly Earnings Breakdown
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "0.85rem", marginBottom: "25px" }}>
                <div><span style={{ color: "var(--text)" }}>Employee:</span> <strong style={{ color: "var(--text-h)" }}>{selectedEmp.name}</strong></div>
                <div><span style={{ color: "var(--text)" }}>Roster ID:</span> <strong style={{ color: "var(--text-h)" }}>#{selectedEmp.id}</strong></div>
                <div><span style={{ color: "var(--text)" }}>Position:</span> <strong style={{ color: "var(--text-h)" }}>{selectedEmp.position}</strong></div>
                <div><span style={{ color: "var(--text)" }}>Dept:</span> <strong style={{ color: "var(--text-h)" }}>{selectedEmp.department}</strong></div>
              </div>

              {/* Computations Table list */}
              <div style={{ fontSize: "0.95rem", marginBottom: "25px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--text)" }}>Basic Salary (Monthly Gross)</span>
                  <strong style={{ color: "var(--text-h)" }}>${calculatePayslip(selectedEmp.salary).grossMonthly.toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", color: "var(--danger)" }}>
                  <span>Income Tax Withholding (15%)</span>
                  <span>-${calculatePayslip(selectedEmp.salary).tax.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", color: "var(--danger)" }}>
                  <span>Medical Welfare Deduction</span>
                  <span>-${calculatePayslip(selectedEmp.salary).benefits.toLocaleString()}</span>
                </div>
              </div>

              {/* Net disbursed payout */}
              <div
                style={{
                  backgroundColor: "var(--primary-bg)",
                  padding: "18px 24px",
                  borderRadius: "12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid var(--primary-border)",
                }}
              >
                <span style={{ fontWeight: 700, color: "var(--text-h)", fontSize: "0.85rem" }}>NET DISBURSED AMOUNT</span>
                <strong style={{ fontSize: "1.4rem", color: "var(--primary)", fontWeight: 800 }}>
                  ${calculatePayslip(selectedEmp.salary).netMonthly.toLocaleString()}
                </strong>
              </div>

              <div style={{ marginTop: "25px" }}>
                <button
                  onClick={() => alert("Dispatching print job...")}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "12px",
                  }}
                >
                  🖨️ Print Payslip Advice
                </button>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}

export default Payroll;