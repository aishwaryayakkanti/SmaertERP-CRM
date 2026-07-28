import { useEffect, useState } from "react";
import api from "../services/api";

interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  attendance_date: string;
  check_in: string;
  check_out: string | null;
  status: string;
}

interface Employee {
  id: number;
  name: string;
}

function Attendance() {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("17:00");
  const [status, setStatus] = useState("Present");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchLogsAndEmployees = async () => {
    try {
      setLoading(true);
      // Fetch both logs and employees lists in parallel
      const [logsRes, empRes] = await Promise.all([
        api.get("/attendance"),
        api.get("/employees"),
      ]);

      const employeesList: Employee[] = empRes.data.employees || [];
      setEmployees(employeesList);

      // Map employee names to attendance logs
      const rawLogs: AttendanceRecord[] = logsRes.data.attendance || [];
      const mappedLogs = rawLogs.map((log) => {
        const emp = employeesList.find((e) => e.id === log.employee_id);
        return {
          ...log,
          employee_name: emp ? emp.name : `Employee ID: ${log.employee_id}`,
        };
      });

      setLogs(mappedLogs);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndEmployees();
  }, []);

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      alert("Please select an employee.");
      return;
    }
    try {
      await api.post("/attendance", {
        employee_id: Number(employeeId),
        attendance_date: date,
        check_in: checkIn,
        check_out: checkOut || null,
        status,
      });
      alert("Attendance logged successfully!");
      setShowAddForm(false);
      fetchLogsAndEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to log attendance.");
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Attendance Registry</h1>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
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
            Log Attendance Check-in
          </button>
        )}
      </div>

      {showAddForm && (
        <div
          style={{
            padding: "20px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            backgroundColor: "var(--code-bg)",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ marginTop: 0, color: "var(--text-h)" }}>Mark Employee Attendance</h3>
          <form onSubmit={handleMarkAttendance}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Select Employee</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Check-In Time</label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Check-Out Time</label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                />
              </div>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Attendance Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", backgroundColor: "var(--bg)", color: "var(--text-h)" }}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
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
                Log Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>Loading logs...</div>
      ) : (
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--bg)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--code-bg)" }}>
                <th style={{ padding: "15px", fontWeight: 600 }}>Log ID</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Employee Name</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Check-In</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Check-Out</th>
                <th style={{ padding: "15px", fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "30px", textAlign: "center", color: "var(--text)" }}>
                    No check-in records logged.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid var(--border)", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--code-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <td style={{ padding: "15px" }}>{log.id}</td>
                    <td style={{ padding: "15px", fontWeight: 600, color: "var(--text-h)" }}>{log.employee_name}</td>
                    <td style={{ padding: "15px" }}>
                      {new Date(log.attendance_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC"
                      })}
                    </td>
                    <td style={{ padding: "15px", color: "green", fontWeight: 500 }}>{log.check_in}</td>
                    <td style={{ padding: "15px", color: log.check_out ? "blue" : "gray" }}>
                      {log.check_out || "Active Shift"}
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
                            log.status === "Present"
                              ? "rgba(40, 167, 69, 0.15)"
                              : log.status === "Absent"
                              ? "rgba(220, 53, 69, 0.15)"
                              : "rgba(255, 193, 7, 0.15)",
                          color:
                            log.status === "Present"
                              ? "#28a745"
                              : log.status === "Absent"
                              ? "#dc3545"
                              : "#ffc107",
                        }}
                      >
                        {log.status}
                      </span>
                    </td>
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

export default Attendance;