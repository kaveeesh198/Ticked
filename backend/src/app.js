require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes       = require("./routes/auth");
const todosRoutes      = require("./routes/todos");
const categoriesRoutes = require("./routes/categories");
const profileRoutes    = require("./routes/profile");
const settingsRoutes   = require("./routes/settings");
const statsRoutes      = require("./routes/stats");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth",       authRoutes);
app.use("/api/todos",      todosRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/profile",    profileRoutes);
app.use("/api/settings",   settingsRoutes);
app.use("/api/stats",      statsRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "Ticked API", version: "1.0.0" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "An unexpected error occurred." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Ticked API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
