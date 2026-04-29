const pool = require("../config/db");
const { checkAchievements } = require("../services/achievementsService");

// GET /api/todos
const getTodos = async (req, res) => {
  const { filter, category_id } = req.query;

  let query = `
    SELECT t.id, t.text, t.completed, t.due_date, t.created_at, t.updated_at,
           c.id AS category_id, c.name AS category_name, c.color AS category_color
    FROM todos t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = $1
  `;
  const params = [req.user.id];

  if (filter === "active") query += ` AND t.completed = FALSE`;
  else if (filter === "completed") query += ` AND t.completed = TRUE`;

  if (category_id) {
    params.push(category_id);
    query += ` AND t.category_id = $${params.length}`;
  }

  query += ` ORDER BY
    CASE WHEN t.due_date IS NOT NULL AND t.completed = FALSE THEN 0 ELSE 1 END,
    t.due_date ASC NULLS LAST,
    t.created_at DESC`;

  try {
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Get todos error:", err);
    res.status(500).json({ error: "Failed to fetch todos." });
  }
};

// POST /api/todos
const createTodo = async (req, res) => {
  const { text, category_id, due_date } = req.body;

  if (!text || !text.trim())
    return res.status(400).json({ error: "Task text is required." });

  try {
    const { rows } = await pool.query(
      `INSERT INTO todos (user_id, text, category_id, due_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [req.user.id, text.trim(), category_id || null, due_date || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create todo error:", err);
    res.status(500).json({ error: "Failed to create todo." });
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { text, completed, category_id, due_date } = req.body;

  try {
    const check = await pool.query(
      "SELECT id, completed FROM todos WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (check.rows.length === 0)
      return res.status(404).json({ error: "Todo not found." });

    const wasCompleted = check.rows[0].completed;

    const { rows } = await pool.query(
      `UPDATE todos
       SET text        = COALESCE($1, text),
           completed   = COALESCE($2, completed),
           category_id = COALESCE($3, category_id),
           due_date    = COALESCE($4, due_date),
           notified    = CASE WHEN $4 IS NOT NULL THEN FALSE ELSE notified END,
           updated_at  = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [text?.trim() || null, completed ?? null, category_id || null, due_date || null, id, req.user.id]
    );

    const updatedTodo = rows[0];

    if (!wasCompleted && updatedTodo.completed === true) {
      checkAchievements(req.user.id);
    }

    res.json(updatedTodo);
  } catch (err) {
    console.error("Update todo error:", err);
    res.status(500).json({ error: "Failed to update todo." });
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (rowCount === 0)
      return res.status(404).json({ error: "Todo not found." });
    res.json({ message: "Todo deleted successfully." });
  } catch (err) {
    console.error("Delete todo error:", err);
    res.status(500).json({ error: "Failed to delete todo." });
  }
};

// DELETE /api/todos/completed
const clearCompleted = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM todos WHERE user_id = $1 AND completed = TRUE",
      [req.user.id]
    );
    res.json({ message: `${rowCount} completed task(s) cleared.` });
  } catch (err) {
    console.error("Clear completed error:", err);
    res.status(500).json({ error: "Failed to clear completed todos." });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo, clearCompleted };