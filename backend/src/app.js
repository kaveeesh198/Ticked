require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { startNotificationCron } = require("./services/notificationService");

const authRoutes       = require("./routes/auth");
const todosRoutes      = require("./routes/todos");
const categoriesRoutes = require("./routes/categories");
const profileRoutes    = require("./routes/profile");
const settingsRoutes   = require("./routes/settings");
const statsRoutes      = require("./routes/stats");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api/auth",       authRoutes);
app.use("/api/todos",      todosRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/profile",    profileRoutes);
app.use("/api/settings",   settingsRoutes);
app.use("/api/stats",      statsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Ticked API", version: "1.0.0" });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`\n🚀 Ticked API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);

  // Start email notification cron job
  startNotificationCron();
});