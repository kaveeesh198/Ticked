const pool = require("../config/db");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.name, c.color,
              COUNT(t.id) AS tasks,
              COUNT(t.id) FILTER (WHERE t.completed = TRUE) AS completed
       FROM categories c
       LEFT JOIN todos t ON t.category_id = c.id
       WHERE c.user_id = $1
       GROUP BY c.id
       ORDER BY c.created_at ASC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ error: "Failed to fetch categories." });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  const { name, color } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ error: "Category name is required." });

  try {
    const { rows } = await pool.query(
      `INSERT INTO categories (user_id, name, color)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, name.trim(), color || "bg-primary"]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ error: "Failed to create category." });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2",
      [id, req.user.id]
    );
    if (rowCount === 0)
      return res.status(404).json({ error: "Category not found." });

    res.json({ message: "Category deleted." });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ error: "Failed to delete category." });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
