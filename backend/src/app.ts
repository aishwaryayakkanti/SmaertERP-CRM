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

export default app;