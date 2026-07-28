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

  // Compute stats
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
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Payroll Center</h1>
        <p style={{ color: "var(--text)", marginTop: "5px" }}>
          Compute compensations, view structures, and print generated payslips.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading payroll data...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedEmp ? "1.2fr 1fr" : "1fr", gap: "25px" }}>
          
          {/* Employee Salary Summary list */}
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--bg)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--code-bg)" }}>
                  <th style={{ padding: "15px", fontWeight: 600 }}>Name</th>
                  <th style={{ padding: "15px", fontWeight: 600 }}>Annual Salary</th>
                  <th style={{ padding: "15px", fontWeight: 600 }}>Monthly Base</th>
                  <th style={{ padding: "15px", fontWeight: 600 }}>Net Payout</th>
                  <th style={{ padding: "15px", fontWeight: 600, textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {employees.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "var(--text)" }}>
                      No employee payroll metrics configured.
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => {
                    const pay = calculatePayslip(emp.salary);
                    return (
                      <tr
                        key={emp.id}
                        style={{
                          borderBottom: "1px solid var(--border)",
                          transition: "background-color 0.2s",
                          backgroundColor: selectedEmp?.id === emp.id ? "var(--accent-bg)" : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "var(--code-bg)";
                        }}
                        onMouseLeave={(e) => {
                          if (selectedEmp?.id !== emp.id) e.currentTarget.style.backgroundColor = "transparent";
                        }}
                      >
                        <td style={{ padding: "15px" }}>
                          <div style={{ fontWeight: 600, color: "var(--text-h)" }}>{emp.name}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text)" }}>{emp.position}</div>
                        </td>
                        <td style={{ padding: "15px" }}>${emp.salary.toLocaleString()}</td>
                        <td style={{ padding: "15px" }}>${pay.grossMonthly.toLocaleString()}</td>
                        <td style={{ padding: "15px", fontWeight: 600, color: "var(--accent)" }}>
                          ${pay.netMonthly.toLocaleString()}
                        </td>
                        <td style={{ padding: "15px", textAlign: "right" }}>
                          <button
                            onClick={() => setSelectedEmp(emp)}
                            style={{
                              padding: "6px 12px",
                              backgroundColor: "transparent",
                              color: "var(--text-h)",
                              border: "1px solid var(--border)",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: 500,
                            }}
                          >
                            View Slip
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Payslip preview Panel */}
          {selectedEmp && (
            <div
              style={{
                border: "1px solid var(--accent-border)",
                borderRadius: "10px",
                padding: "25px",
                backgroundColor: "var(--bg)",
                boxShadow: "var(--shadow)",
                position: "relative",
              }}
            >
              <button
                onClick={() => setSelectedEmp(null)}
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  background: "transparent",
                  border: "none",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  color: "var(--text)",
                }}
              >
                ✕
              </button>

              <div style={{ textAlign: "center", borderBottom: "2px dashed var(--border)", paddingBottom: "20px", marginBottom: "20px" }}>
                <h3 style={{ margin: 0, color: "var(--text-h)" }}>PAYSLIP ADVICE</h3>
                <div style={{ fontSize: "0.85rem", color: "var(--text)", marginTop: "4px" }}>
                  SmartERP CRM Ltd • Monthly Earnings
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.85rem", marginBottom: "20px" }}>
                <div><strong>Employee:</strong> {selectedEmp.name}</div>
                <div><strong>Emp ID:</strong> #{selectedEmp.id}</div>
                <div><strong>Position:</strong> {selectedEmp.position}</div>
                <div><strong>Department:</strong> {selectedEmp.department}</div>
              </div>

              {/* Computations Table */}
              <div style={{ fontSize: "0.9rem", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span>Basic Base Salary (Monthly)</span>
                  <strong>${calculatePayslip(selectedEmp.salary).grossMonthly.toLocaleString()}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", color: "#dc3545" }}>
                  <span>Withholding Income Tax (15%)</span>
                  <span>-${calculatePayslip(selectedEmp.salary).tax.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--border)", color: "#dc3545" }}>
                  <span>Medical Welfare Deduction</span>
                  <span>-${calculatePayslip(selectedEmp.salary).benefits.toLocaleString()}</span>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "var(--code-bg)",
                  padding: "15px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <span style={{ fontWeight: 600, color: "var(--text-h)" }}>NET DISBURSED AMOUNT</span>
                <strong style={{ fontSize: "1.3rem", color: "var(--accent)" }}>
                  ${calculatePayslip(selectedEmp.salary).netMonthly.toLocaleString()}
                </strong>
              </div>

              <div style={{ marginTop: "25px", textAlign: "center" }}>
                <button
                  onClick={() => alert("Printing Payslip...")}
                  style={{
                    padding: "10px 20px",
                    width: "100%",
                    backgroundColor: "var(--accent)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Print Payslip Advice
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