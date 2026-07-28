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
    <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Employees Roster</h1>
        {isAdmin && !showAddForm && (
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
            Add New Employee
          </button>
        )}
      </div>

      {error && <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>}

      {/* Add / Edit Form */}
      {showAddForm && isAdmin && (
        <div
          style={{
            padding: "20px",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            backgroundColor: "var(--code-bg)",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ marginTop: 0, color: "var(--text-h)" }}>
            {editingEmployee ? `Edit Employee: ${editingEmployee.name}` : "Register New Employee"}
          </h3>
          <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Department</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Position / Role</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "0.85rem", fontWeight: 600 }}>Annual Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 75000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--border)", boxSizing: "border-box" }}
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
                {editingEmployee ? "Save Changes" : "Create Employee"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Roster Table */}
      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: "10px", backgroundColor: "var(--bg)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--code-bg)" }}>
              <th style={{ padding: "15px", fontWeight: 600 }}>ID</th>
              <th style={{ padding: "15px", fontWeight: 600 }}>Name</th>
              <th style={{ padding: "15px", fontWeight: 600 }}>Email</th>
              <th style={{ padding: "15px", fontWeight: 600 }}>Department</th>
              <th style={{ padding: "15px", fontWeight: 600 }}>Position</th>
              <th style={{ padding: "15px", fontWeight: 600 }}>Salary</th>
              {isAdmin && <th style={{ padding: "15px", fontWeight: 600, textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 7 : 6} style={{ padding: "30px", textAlign: "center", color: "var(--text)" }}>
                  No employees found.
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} style={{ borderBottom: "1px solid var(--border)", transition: "background-color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--code-bg)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                  <td style={{ padding: "15px" }}>{emp.id}</td>
                  <td style={{ padding: "15px", fontWeight: 600, color: "var(--text-h)" }}>{emp.name}</td>
                  <td style={{ padding: "15px" }}>{emp.email}</td>
                  <td style={{ padding: "15px" }}>{emp.department}</td>
                  <td style={{ padding: "15px" }}>{emp.position}</td>
                  <td style={{ padding: "15px" }}>${emp.salary.toLocaleString()}</td>
                  {isAdmin && (
                    <td style={{ padding: "15px", textAlign: "right" }}>
                      <button
                        onClick={() => startEdit(emp)}
                        style={{
                          marginRight: "8px",
                          padding: "5px 10px",
                          border: "1px solid var(--border)",
                          backgroundColor: "transparent",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        style={{
                          padding: "5px 10px",
                          border: "1px solid transparent",
                          backgroundColor: "rgba(220, 53, 69, 0.1)",
                          color: "#dc3545",
                          borderRadius: "4px",
                          cursor: "pointer",
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