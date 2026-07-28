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
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Leave Management</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Review, file, and audit employee vacation time requests.
          </p>
        </div>
        {!showApplyForm && (
          <button onClick={() => setShowApplyForm(true)} className="btn-primary">
            <span>📝</span> Apply for Time-Off
          </button>
        )}
      </div>

      {showApplyForm && (
        <div className="glass-card" style={{ marginBottom: "35px", animation: "fadeIn 0.3s ease" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--text-h)" }}>Submit Leave Application</h3>
          <form onSubmit={handleApplyLeave}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Employee Name</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Select Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="Annual">Annual Leave</option>
                  <option value="Sick">Sick Leave</option>
                  <option value="Maternity/Paternity">Maternity/Paternity Leave</option>
                  <option value="Unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Reason / Description</label>
                <textarea
                  placeholder="Provide details explaining the time-off request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                File Request
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text)" }}>Loading applications...</div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Req ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                    No leave requests listed.
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td><strong>#{leave.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{leave.employee_name}</div>
                    </td>
                    <td>{leave.leave_type}</td>
                    <td style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>
                      <div>
                        <strong>From:</strong> {new Date(leave.start_date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                      </div>
                      <div>
                        <strong>To:</strong> {new Date(leave.end_date).toLocaleDateString(undefined, { timeZone: "UTC" })}
                      </div>
                    </td>
                    <td style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "Approved"
                            ? "badge-success"
                            : leave.status === "Rejected"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: "right" }}>
                        {leave.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleToggleStatus(leave.id, "Approved")}
                              className="btn-primary"
                              style={{
                                marginRight: "8px",
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                                backgroundColor: "var(--success)",
                                color: "white",
                              }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleToggleStatus(leave.id, "Rejected")}
                              className="btn-danger"
                              style={{
                                padding: "6px 12px",
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