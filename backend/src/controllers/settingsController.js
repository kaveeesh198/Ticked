const pool = require("../config/db");

// GET /api/settings
const getSettings = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM user_settings WHERE user_id = $1",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Settings not found." });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings." });
  }
};

// PUT /api/settings
const updateSettings = async (req, res) => {
  const { notifications, dark_mode, sounds, week_starts_monday, language } = req.body;

  try {
    const { rows } = await pool.query(
      `UPDATE user_settings
       SET notifications       = COALESCE($1, notifications),
           dark_mode           = COALESCE($2, dark_mode),
           sounds              = COALESCE($3, sounds),
           week_starts_monday  = COALESCE($4, week_starts_monday),
           language            = COALESCE($5, language),
           updated_at          = NOW()
       WHERE user_id = $6
       RETURNING *`,
      [
        notifications ?? null,
        dark_mode ?? null,
        sounds ?? null,
        week_starts_monday ?? null,
        language || null,
        req.user.id,
      ]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ error: "Failed to update settings." });
  }
};

module.exports = { getSettings, updateSettings };
