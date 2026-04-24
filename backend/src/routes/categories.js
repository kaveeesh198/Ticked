const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoriesController");

router.use(auth);

router.get("/", getCategories);
router.post("/", createCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
