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
  const [filteredLogs, setFilteredLogs] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkIn, setCheckIn] = useState("09:00");
  const [checkOut, setCheckOut] = useState("17:00");
  const [status, setStatus] = useState("Present");
  const [showFormModal, setShowFormModal] = useState(false);

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
      setFilteredLogs(mappedLogs);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogsAndEmployees();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = logs;
    if (searchQuery) {
      result = result.filter(
        (log) =>
          log.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.employee_id.toString() === searchQuery
      );
    }
    if (statusFilter) {
      result = result.filter((log) => log.status === statusFilter);
    }
    setFilteredLogs(result);
  }, [searchQuery, statusFilter, logs]);

  // Compute stat highlights
  const presentCount = logs.filter((l) => l.status === "Present").length;
  const absentCount = logs.filter((l) => l.status === "Absent").length;
  const lateCount = logs.filter((l) => l.status === "Late").length;

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
      setShowFormModal(false);
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
            Monitor and record corporate employee check-ins and shift parameters.
          </p>
        </div>
        <button onClick={() => setShowFormModal(true)} className="btn-primary">
          <span>📅</span> Log Attendance Sheet
        </button>
      </div>

      {/* Stats Overview */}
      <div className="dashboard-grid" style={{ marginBottom: "24px" }}>
        <div className="glass-card stat-card success" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase" }}>Present Staff</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>{presentCount}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>🟢</span>
        </div>
        <div className="glass-card stat-card danger" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase" }}>Absent Count</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>{absentCount}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>🔴</span>
        </div>
        <div className="glass-card stat-card warning" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase" }}>Late Check-Ins</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>{lateCount}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>🟡</span>
        </div>
        <div className="glass-card stat-card primary" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", textTransform: "uppercase" }}>Total Records</span>
            <h2 style={{ fontSize: "1.8rem", marginTop: "4px" }}>{logs.length}</h2>
          </div>
          <span style={{ fontSize: "1.4rem" }}>📂</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="glass-card"
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "24px",
          padding: "16px 24px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
          <input
            type="text"
            placeholder="Search logs by employee name..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text)" }}>
            🔍
          </span>
        </div>

        <div style={{ minWidth: "160px" }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
          </select>
        </div>
      </div>

      {/* Log Modal overlay sheet */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-sheet scale-up">
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>Mark Employee Attendance</h3>
            <form onSubmit={handleMarkAttendance}>
              <div className="form-group">
                <label className="form-label">Choose Employee</label>
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

              <div className="form-group" style={{ marginBottom: "24px" }}>
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

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowFormModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Log Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logs Table */}
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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                    No check-in logs match current query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
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
                    <td style={{ color: "var(--success)", fontWeight: 700 }}>{log.check_in}</td>
                    <td style={{ fontWeight: 500, color: log.check_out ? "var(--text-h)" : "var(--text)" }}>
                      {log.check_out || "Active Shift"}
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