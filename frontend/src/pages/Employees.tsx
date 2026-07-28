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

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");

  const userRole = localStorage.getItem("userRole") || "";
  const isAdmin = userRole.toLowerCase() === "admin";

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data.employees || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Only Admins can perform this action.");
      return;
    }
    try {
      await api.post("/employees", {
        name,
        email,
        department,
        position,
        salary: Number(salary),
      });
      alert("Employee added successfully!");
      resetForm();
      fetchEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add employee.");
    }
  };

  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;
    if (!isAdmin) {
      alert("Only Admins can perform this action.");
      return;
    }
    try {
      await api.put(`/employees/${editingEmployee.id}`, {
        name,
        email,
        department,
        position,
        salary: Number(salary),
      });
      alert("Employee updated successfully!");
      resetForm();
      fetchEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update employee.");
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!isAdmin) {
      alert("Only Admins can perform this action.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  const startEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setName(employee.name);
    setEmail(employee.email);
    setDepartment(employee.department);
    setPosition(employee.position);
    setSalary(employee.salary.toString());
    setShowAddForm(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setPosition("");
    setSalary("");
    setEditingEmployee(null);
    setShowAddForm(false);
  };

  return (
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Employees Roster</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Add, update, and manage corporate employee directories.
          </p>
        </div>
        {isAdmin && !showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="btn-primary">
            <span>➕</span> Add New Employee
          </button>
        )}
      </div>

      {error && <div className="badge badge-danger" style={{ marginBottom: "20px" }}>{error}</div>}

      {/* Add / Edit Form */}
      {showAddForm && isAdmin && (
        <div className="glass-card" style={{ marginBottom: "35px", animation: "fadeIn 0.3s ease" }}>
          <h3 style={{ marginTop: 0, marginBottom: "20px", color: "var(--text-h)" }}>
            {editingEmployee ? `Edit Employee Record: ${editingEmployee.name}` : "Register New Employee Profile"}
          </h3>
          <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Position / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Lead Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label className="form-label">Annual Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 85000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button type="button" onClick={resetForm} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editingEmployee ? "Save Changes" : "Register Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Table */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                  No registered employee records found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td><strong>#{emp.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{emp.name}</div>
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td><strong style={{ color: "var(--primary)" }}>${emp.salary.toLocaleString()}</strong></td>
                  {isAdmin && (
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => startEdit(emp)}
                        className="btn-secondary"
                        style={{
                          marginRight: "8px",
                          padding: "6px 12px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="btn-danger"
                        style={{
                          padding: "6px 12px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;