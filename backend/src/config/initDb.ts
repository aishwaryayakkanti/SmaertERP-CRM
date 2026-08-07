import pool from "./db";
import bcrypt from "bcrypt";

export async function initDb() {
  try {
    console.log("⏳ Initializing database tables...");

    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('admin', 'employee'))
      );
    `);

    // Create Employees table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS employees (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          department VARCHAR(100) NOT NULL,
          position VARCHAR(100) NOT NULL,
          salary DECIMAL(12, 2) NOT NULL
      );
    `);

    // Create Attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
          id SERIAL PRIMARY KEY,
          employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          attendance_date DATE NOT NULL,
          check_in TIME NOT NULL,
          check_out TIME,
          status VARCHAR(50) DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Late', 'Half Day')),
          UNIQUE (employee_id, attendance_date)
      );
    `);

    // Create Leave Requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leave_requests (
          id SERIAL PRIMARY KEY,
          employee_id INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
          leave_type VARCHAR(100) NOT NULL CHECK (leave_type IN ('Annual', 'Sick', 'Maternity/Paternity', 'Unpaid')),
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          reason TEXT NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected'))
      );
    `);

    // Seed default admin user
    const adminCheck = await pool.query("SELECT * FROM users WHERE email = $1", ["aish@gmail.com"]);
    if (adminCheck.rows.length === 0) {
      const hash = await bcrypt.hash("aish123", 10);
      await pool.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Aishwarya", "aish@gmail.com", hash, "admin"]
      );
      console.log("🌱 Database seeded with default admin user: aish@gmail.com");
    }

    console.log("✅ Database tables verified and initialized successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize database tables:", error);
  }
}
