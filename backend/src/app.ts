import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("Smart ERP CRM Backend Running...");
});

import pool from "./config/db";
app.get("/api/debug-db", async (req, res) => {
    try {
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        const usersRes = await pool.query("SELECT id, name, email, role FROM users LIMIT 5")
            .then(r => r.rows)
            .catch(e => ({ error: e.message }));
        res.json({
            status: "connected",
            tables: tablesRes.rows.map(r => r.table_name),
            users: usersRes
        });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

export default app;