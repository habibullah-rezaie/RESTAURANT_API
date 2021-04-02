const { SendValidatorError } = require("../../utils/error");

// POST /admin/timings/ => add a timing
exports.addTiming = async (req, res, next) => {
  SendValidatorError(req, res);

  res.send('hi')
};

// PUT /admin/timings/:day => update a timing given day of the week
exports.updateTiming = async (req, res, next) => {};

// DELETE /admin/timings/:day
exports.deleteTiming = async (req, res, next) => {};
