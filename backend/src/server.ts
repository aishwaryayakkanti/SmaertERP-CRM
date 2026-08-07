import app from "./app";
import pool from "./config/db";
import { initDb } from "./config/initDb";
import dashboardRoutes from "./routes/dashboardRoutes";


app.use(
"/api/dashboard",
dashboardRoutes
);

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(async () => {
    console.log("✅ PostgreSQL Connected");

    // Initialize database tables and seed default admin
    await initDb();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err);
  });