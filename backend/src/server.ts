import app from "./app";
import pool from "./config/db";
import dashboardRoutes from "./routes/dashboardRoutes";


app.use(
"/api/dashboard",
dashboardRoutes
);

const PORT = process.env.PORT || 5000;

pool.connect()
  .then(() => {
    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database Connection Failed");
    console.error(err);
  });