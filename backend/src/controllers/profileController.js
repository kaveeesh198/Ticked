const pool = require("../config/db");

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

// PUT /api/profile
const updateProfile = async (req, res) => {
  const { name, avatar_url } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: "Name is required." });

  try {
    const { rows } = await pool.query(
      `UPDATE users
       SET name = $1, avatar_url = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, avatar_url, created_at`,
      [name.trim(), avatar_url || null, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Failed to update profile." });
  }
};

module.exports = { getProfile, updateProfile };
