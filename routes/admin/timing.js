const express = require("express");
const { body } = require("express-validator");
const {
  addTiming,
  updateTiming,
  deleteTiming,
} = require("../../controllers/admin/timing");
const Timing = require("../../models/timing");

const router = express.Router();

// POST /admin/timings/ => add a timing
router.post(
  "/",
  [
    body("day")
      .trim()
      .toLowerCase()
      .isIn([
        "saturday",
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
      ])
      .withMessage("Invalid day, not one of seven days in a week")
      .custom(async (day, {}) => {
        const timing = await Timing.findByPk(day);

        if (timing) throw new Error(`A timing already exists in ${day}`);
        return true;
      }),
    body("opening")
      .trim()
      .matches(
        /^([2][0-3]|[01]?[0-9]):([0-5][1-9]|[0]?[1-9]]):([0-5][1-9]|[0]?[1-9])$/
      )
      .withMessage("Invalid opening time."),
    body("closing")
      .trim()
      .matches(
        /^([2][0-3]|[01]?[0-9]):([0-5][1-9]|[0]?[1-9]]):([0-5][1-9]|[0]?[1-9])$/
      )
      .withMessage("Invalid closing time."),
  ],
  addTiming
);

// PUT /admin/timings/:day => update a timing on a
// particular day
router.put("/:day", updateTiming);

// DELETE /admin/timings/:day => update a timing on
// particular day
router.delete("/:day", deleteTiming);

module.exports = router;
