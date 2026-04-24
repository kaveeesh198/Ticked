const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Name, email and password are required." });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0)
      return res.status(409).json({ error: "Email already in use." });

    const password_hash = await bcrypt.hash(password, 10);

    const { rows } = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );
    const user = rows[0];

    // Create default settings for new user
    await client.query(
      "INSERT INTO user_settings (user_id) VALUES ($1)",
      [user.id]
    );

    // Create default categories for new user
    await client.query(
      `INSERT INTO categories (user_id, name, color) VALUES
       ($1, 'Work', 'bg-accent'),
       ($1, 'Personal', 'bg-primary'),
       ($1, 'Health', 'bg-muted-foreground'),
       ($1, 'Learning', 'bg-foreground/70')`,
      [user.id]
    );

    const token = generateToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error during registration." });
  } finally {
    client.release();
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password." });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found." });

    res.json(rows[0]);
  } catch (err) {
    console.error("Get me error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = { register, login, getMe };
