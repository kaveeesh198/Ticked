const pool = require("../config/db");

// Unlock an achievement if not already unlocked
const unlock = async (userId, conditionKey) => {
  try {
    const { rows } = await pool.query(
      "SELECT id FROM achievements WHERE condition_key = $1",
      [conditionKey]
    );
    if (rows.length === 0) return;

    const achievementId = rows[0].id;

    await pool.query(
      `INSERT INTO user_achievements (user_id, achievement_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, achievement_id) DO NOTHING`,
      [userId, achievementId]
    );
  } catch (err) {
    console.error(`Achievement unlock error [${conditionKey}]:`, err.message);
  }
};

// Run all achievement checks after a todo is completed
const checkAchievements = async (userId) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    // ── tasks_100: Completed 100 tasks ──────────────────────────
    const { rows: totalRows } = await pool.query(
      "SELECT COUNT(*) FROM todos WHERE user_id = $1 AND completed = TRUE",
      [userId]
    );
    const totalCompleted = parseInt(totalRows[0].count);
    if (totalCompleted >= 100) await unlock(userId, "tasks_100");
    if (totalCompleted >= 1000) await unlock(userId, "tasks_1000");

    // ── early_bird: Complete 10 tasks before 9 AM ───────────────
    const { rows: earlyRows } = await pool.query(
      `SELECT COUNT(*) FROM todos
       WHERE user_id = $1
         AND completed = TRUE
         AND EXTRACT(HOUR FROM updated_at) < 9`,
      [userId]
    );
    if (parseInt(earlyRows[0].count) >= 10) await unlock(userId, "early_bird");

    // ── night_owl: Complete a task after midnight ───────────────
    if (hour >= 0 && hour < 4) await unlock(userId, "night_owl");

    // ── streak_7: 7-day streak ──────────────────────────────────
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
    const currentStreak = parseInt(streakRows[0]?.streak || 0);
    if (currentStreak >= 7) await unlock(userId, "streak_7");

    // ── goals_10: Complete tasks on 10 different weeks ──────────
    const { rows: weeksRows } = await pool.query(
      `SELECT COUNT(DISTINCT date_trunc('week', updated_at)) AS weeks
       FROM todos
       WHERE user_id = $1 AND completed = TRUE`,
      [userId]
    );
    if (parseInt(weeksRows[0].weeks) >= 10) await unlock(userId, "goals_10");

  } catch (err) {
    console.error("Achievement check error:", err.message);
  }
};

module.exports = { checkAchievements };