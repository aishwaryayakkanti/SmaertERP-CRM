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
      const [logsRes, empRes] = await Promise.all([
        api.get("/attendance"),
        api.get("/employees"),
      ]);

      const employeesList: Employee[] = empRes.data.employees || [];
      setEmployees(employeesList);

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
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Attendance Registry</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Track employee shifts, daily logging, and checkout timings.
          </p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            <span>📅</span> Log Daily Check-In
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="glass-card" style={{ marginBottom: "35px", animation: "fadeIn 0.3s ease" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--text-h)" }}>Mark Daily Attendance Sheets</h3>
          <form onSubmit={handleMarkAttendance}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Select Employee</label>
                <select
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="">-- Choose Employee --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} (ID: {emp.id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-In Time</label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-Out Time</label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Shift Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className="form-select"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" onClick={() => setShowAddForm(false)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Log Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text)" }}>Loading logs...</div>
      ) : (
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Log ID</th>
                <th>Employee Name</th>
                <th>Date</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                    No check-in logs recorded.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td><strong>#{log.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{log.employee_name}</div>
                    </td>
                    <td>
                      {new Date(log.attendance_date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        timeZone: "UTC"
                      })}
                    </td>
                    <td style={{ color: "#2ec4b6", fontWeight: 700 }}>{log.check_in}</td>
                    <td style={{ fontWeight: 500, color: log.check_out ? "var(--text-h)" : "var(--text)" }}>
                      {log.check_out || "Active Roster"}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          log.status === "Present"
                            ? "badge-success"
                            : log.status === "Absent"
                            ? "badge-danger"
                            : "badge-warning"
                        }`}
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