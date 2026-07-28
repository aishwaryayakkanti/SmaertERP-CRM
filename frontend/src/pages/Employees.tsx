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
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      const list = response.data.employees || [];
      setEmployees(list);
      setFilteredEmployees(list);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load employees.");
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = employees;
    if (searchQuery) {
      result = result.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (deptFilter) {
      result = result.filter((emp) => emp.department === deptFilter);
    }
    setFilteredEmployees(result);
    setCurrentPage(1);
  }, [searchQuery, deptFilter, employees]);

  // Unique departments for filter list
  const departments = Array.from(new Set(employees.map((emp) => emp.department)));

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

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
    setShowFormModal(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setDepartment("");
    setPosition("");
    setSalary("");
    setEditingEmployee(null);
    setShowFormModal(false);
  };

  return (
    <div className="fade-in" style={{ padding: "10px 20px" }}>
      <div className="page-header">
        <div>
          <h1 style={{ margin: 0 }}>Employees Roster</h1>
          <p style={{ color: "var(--text)", marginTop: "4px" }}>
            Add, update, search, and manage corporate employee directories.
          </p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowFormModal(true)} className="btn-primary">
            <span>➕</span> Register Employee
          </button>
        )}
      </div>

      {error && <div className="badge badge-danger" style={{ marginBottom: "20px" }}>{error}</div>}

      {/* Filter and Search Section */}
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
            placeholder="Search employee by name or email..."
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "36px" }}
          />
          <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text)" }}>
            🔍
          </span>
        </div>

        <div style={{ minWidth: "180px" }}>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="form-select"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Modal overlay sheet */}
      {showFormModal && isAdmin && (
        <div className="modal-overlay">
          <div className="modal-sheet scale-up">
            <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
              {editingEmployee ? `Edit Employee Record: ${editingEmployee.name}` : "Register New Employee Profile"}
            </h3>
            <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
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
                  placeholder="e.g. Frontend Developer"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label className="form-label">Annual Salary ($)</label>
                <input
                  type="number"
                  placeholder="e.g. 75000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingEmployee ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Roster Table view */}
      <div className="table-container">
        <table className="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee Details</th>
              <th>Department</th>
              <th>Position</th>
              <th>Salary</th>
              {isAdmin && <th style={{ textAlign: "right" }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} style={{ padding: "40px", textAlign: "center", color: "var(--text)" }}>
                  No employees matched the search filter criteria.
                </td>
              </tr>
            ) : (
              currentItems.map((emp) => (
                <tr key={emp.id}>
                  <td><strong>#{emp.id}</strong></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "var(--primary-bg)",
                          color: "var(--primary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 750,
                          fontSize: "0.9rem",
                        }}
                      >
                        {emp.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ textAlign: "left" }}>
                        <div style={{ fontWeight: 700, color: "var(--text-h)" }}>{emp.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text)", marginTop: "2px" }}>{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td><strong style={{ color: "var(--primary)" }}>${emp.salary.toLocaleString()}</strong></td>
                  {isAdmin && (
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => startEdit(emp)}
                        className="btn-secondary"
                        style={{ marginRight: "8px", padding: "6px 12px", fontSize: "0.8rem" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="btn-danger"
                        style={{ padding: "6px 12px", fontSize: "0.8rem" }}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px" }}>
          <div style={{ fontSize: "0.85rem", color: "var(--text)" }}>
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredEmployees.length)} of {filteredEmployees.length} profiles
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn-secondary"
              style={{ padding: "6px 14px", fontSize: "0.8rem" }}
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Employees;