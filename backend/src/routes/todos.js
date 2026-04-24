const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  clearCompleted,
} = require("../controllers/todosController");

router.use(auth); // all todo routes require authentication

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/completed", clearCompleted);
router.delete("/:id", deleteTodo);

module.exports = router;
