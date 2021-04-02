const express = require("express");
const {
  addTiming,
  updateTiming,
  deleteTiming,
} = require("../../controllers/admin/timing");

const router = express.Router();

// POST /admin/timings/ => add a timing
router.post("/", addTiming);

// PUT /admin/timings/:day => update a timing on a
// particular day
router.put("/:day", updateTiming);

// DELETE /admin/timings/:day => update a timing on
// particular day
router.delete("/:day", deleteTiming);

module.exports = router;
