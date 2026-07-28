import { useEffect, useState } from "react";
import api from "../services/api";

interface LeaveRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
}

interface Employee {
  id: number;
  name: string;
}

function Leave() {
  const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [leaveType, setLeaveType] = useState("Annual");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole.toLowerCase() === "admin";

  const fetchLeavesAndEmployees = async () => {
    try {
      setLoading(true);
      const [leavesRes, empRes] = await Promise.all([
        api.get("/leave"),
        api.get("/employees"),
      ]);

      const employeesList = empRes.data.employees || [];
      setEmployees(employeesList);

      const rawLeaves: LeaveRecord[] = leavesRes.data.leaves || [];
      const mappedLeaves = rawLeaves.map((leave) => {
        const emp = employeesList.find((e: any) => e.id === leave.employee_id);
        return {
          ...leave,
          employee_name: emp ? emp.name : `Employee ID: ${leave.employee_id}`,
        };
      });

      setLeaves(mappedLeaves);
    } catch (error) {
      console.error("Error fetching leaves data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeavesAndEmployees();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      alert("Please select an employee.");
      return;
    }
    try {
      await api.post("/leave", {
        employee_id: Number(employeeId),
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
      });
      alert("Leave request submitted successfully!");
      resetForm();
      fetchLeavesAndEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit leave request.");
    }
  };

  const handleToggleStatus = async (id: number, newStatus: string) => {
    if (!isAdmin) {
      alert("Only Admins can approve/reject leave requests.");
      return;
    }
    try {
      await api.put(`/leave/${id}`, {
        status: newStatus,
      });
      alert(`Leave request ${newStatus.toLowerCase()} successfully!`);
      fetchLeavesAndEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update leave status.");
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setLeaveType("Annual");
    setStartDate("");
    setEndDate("");
    setReason("");
    setShowApplyForm(false);
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Leave Management</h1>
        {!showApplyForm && (
          <button
            onClick={() => setShowApplyForm(true)}
            style={{
              padding: "10px 20px",
              backgroundColor: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Apply for Leave
          </button>
        )}
      </div>

      {showApplyForm && (
        <div
          style={{
            padding: "20px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            backgroundColor: "var(--code-bg)",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ marginTop: 0, color: "var(--text-h)" }}>Submit Leave Request</h3>
          <form onSubmit={handleApplyLeave}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Employee Name</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Maternity/Paternity">Maternity/Paternity Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Reason / Description</label>
                <textarea
                  placeholder="Explain the reason for time-off..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "8px 16px",
                  border: "1px solid var(--border)",
                  backgroundColor: "transparent",
                  color: "var(--text-h)",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "var(--accent)",
                  color: "white",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading requests...</div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--bg)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--code-bg)" }}>
                <th style={{ padding: "15px", fontWeight: 600 }}>Req ID</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Employee Name</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Type</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Dates</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Reason</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Status</th>
                {isAdmin && <th style={{ padding: "15px", fontWeight: 600, textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ padding: "30px", textAlign: "center", color: "var(--text)" }}>
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id} style={{ borderBottom: "1px solid var(--border)", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--code-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <td style={{ padding: "15px" }}>{leave.id}</td>
                    <td style={{ padding: "15px", fontWeight: 600, color: "var(--text-h)" }}>{leave.employee_name}</td>
                    <td style={{ padding: "15px" }}>{leave.leave_type}</td>
                    <td style={{ padding: "15px", fontSize: "0.85rem" }}>
                      <div>
                        <strong>From:</strong> {new Date(leave.start_date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                      </div>
                      <div>
                        <strong>To:</strong> {new Date(leave.end_date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                      </div>
                    </td>
                    <td style={{ padding: "15px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td style={{ padding: "15px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          backgroundColor:
                            leave.status === "Approved"
                              ? "rgba(40, 167, 69, 0.15)"
                              : leave.status === "Rejected"
                              ? "rgba(220, 53, 69, 0.15)"
                              : "rgba(255, 193, 7, 0.15)",
                          color:
                            leave.status === "Approved"
                              ? "#28a745"
                              : leave.status === "Rejected"
                              ? "#dc3545"
                              : "#ffc107",
                        }}
                      >
                        {leave.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ padding: "15px", textAlign: "right" }}>
                        {leave.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleToggleStatus(leave.id, "Approved")}
                              style={{
                                marginRight: "8px",
                                padding: "5px 10px",
                                border: "1px solid #28a745",
                                backgroundColor: "#28a745",
                                color: "white",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleToggleStatus(leave.id, "Rejected")}
                              style={{
                                padding: "5px 10px",
                                border: "1px solid #dc3545",
                                backgroundColor: "#dc3545",
                                color: "white",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "0.8rem",
                              }}
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: "0.85rem", color: "var(--text)", fontStyle: "italic" }}>Processed</span>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leave;