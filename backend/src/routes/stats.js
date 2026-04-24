const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getStats,
  getWeeklyStats,
  getActivity,
  getAchievements,
} = require("../controllers/statsController");

router.use(auth);

router.get("/", getStats);
router.get("/weekly", getWeeklyStats);
router.get("/activity", getActivity);
router.get("/achievements", getAchievements);

module.exports = router;
