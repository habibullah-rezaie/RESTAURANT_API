const { validationResult } = require("express-validator");
const Timing = require("../../models/timing");
const { sendValidatorError } = require("../../utils/error");

// POST /admin/timings/ => add a timing
exports.addTiming = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { day, opening, closing } = req.body;

  try {
    const timing = await Timing.create({ day, opening, closing });
    return res.status(201).json({
      timing: timing,
      message: "Successfully add timing for " + day,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
  new Date();
};

// PUT /admin/timings/:day => update a timing given day of the week
exports.updateTiming = async (req, res, next) => {};

// DELETE /admin/timings/:day
exports.deleteTiming = async (req, res, next) => {};
