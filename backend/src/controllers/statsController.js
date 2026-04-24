const pool = require("../config/db");

// GET /api/stats
const getStats = async (req, res) => {
  const userId = req.user.id;

  try {
    // Total completed
    const { rows: completedRows } = await pool.query(
      "SELECT COUNT(*) FROM todos WHERE user_id = $1 AND completed = TRUE",
      [userId]
    );

    // In progress
    const { rows: activeRows } = await pool.query(
      "SELECT COUNT(*) FROM todos WHERE user_id = $1 AND completed = FALSE",
      [userId]
    );

    // Completed today
    const { rows: todayRows } = await pool.query(
      `SELECT COUNT(*) FROM todos
       WHERE user_id = $1 AND completed = TRUE
       AND updated_at::date = CURRENT_DATE`,
      [userId]
    );

    // Due soon (active tasks created more than 2 days ago)
    const { rows: dueSoonRows } = await pool.query(
      `SELECT COUNT(*) FROM todos
       WHERE user_id = $1 AND completed = FALSE
       AND created_at < NOW() - INTERVAL '2 days'`,
      [userId]
    );

    // Streak: count consecutive days with at least 1 completion
    const { rows: streakRows } = await pool.query(
      `WITH daily AS (
         SELECT updated_at::date AS day
         FROM todos
         WHERE user_id = $1 AND completed = TRUE
         GROUP BY updated_at::date
         ORDER BY updated_at::date DESC
       ),
       streak AS (
         SELECT day,
                ROW_NUMBER() OVER (ORDER BY day DESC) AS rn,
                day - (ROW_NUMBER() OVER (ORDER BY day DESC))::int AS grp
         FROM daily
       )
       SELECT COUNT(*) AS streak
       FROM streak
       WHERE grp = (SELECT grp FROM streak ORDER BY day DESC LIMIT 1)`,
      [userId]
    );

    // Goals met: % of tasks completed this week
    const { rows: weekRows } = await pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE completed = TRUE) AS done,
         COUNT(*) AS total
       FROM todos
       WHERE user_id = $1
       AND created_at >= date_trunc('week', CURRENT_DATE)`,
      [userId]
    );

    const weekTotal = parseInt(weekRows[0].total);
    const weekDone = parseInt(weekRows[0].done);
    const goalsMet = weekTotal > 0 ? Math.round((weekDone / weekTotal) * 100) : 0;

    res.json({
      tasks_completed: parseInt(completedRows[0].count),
      in_progress: parseInt(activeRows[0].count),
      completed_today: parseInt(todayRows[0].count),
      due_soon: parseInt(dueSoonRows[0].count),
      current_streak: parseInt(streakRows[0]?.streak || 0),
      goals_met: goalsMet,
    });
  } catch (err) {
    console.error("Get stats error:", err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

// GET /api/stats/weekly
const getWeeklyStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT
         TO_CHAR(updated_at::date, 'Dy') AS day,
         updated_at::date AS date,
         COUNT(*) AS count
       FROM todos
       WHERE user_id = $1
         AND completed = TRUE
         AND updated_at >= date_trunc('week', CURRENT_DATE)
       GROUP BY updated_at::date
       ORDER BY updated_at::date ASC`,
      [userId]
    );

    // Build full week array Mon-Sun
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const result = days.map((day) => {
      const found = rows.find((r) => r.day === day);
      return { day, count: found ? parseInt(found.count) : 0 };
    });

    res.json(result);
  } catch (err) {
    console.error("Weekly stats error:", err);
    res.status(500).json({ error: "Failed to fetch weekly stats." });
  }
};

// GET /api/stats/activity
const getActivity = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT
         CASE WHEN completed = TRUE THEN 'Completed' ELSE 'Added' END AS action,
         text AS task,
         updated_at AS time
       FROM todos
       WHERE user_id = $1
       ORDER BY updated_at DESC
       LIMIT 10`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Activity error:", err);
    res.status(500).json({ error: "Failed to fetch activity." });
  }
};

// GET /api/stats/achievements
const getAchievements = async (req, res) => {
  const userId = req.user.id;

  try {
    const { rows } = await pool.query(
      `SELECT a.id, a.name, a.description, a.icon,
              CASE WHEN ua.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS unlocked,
              ua.unlocked_at
       FROM achievements a
       LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = $1
       ORDER BY a.id ASC`,
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Achievements error:", err);
    res.status(500).json({ error: "Failed to fetch achievements." });
  }
};

module.exports = { getStats, getWeeklyStats, getActivity, getAchievements };
