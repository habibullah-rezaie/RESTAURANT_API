const { validationResult } = require("express-validator");

/**
 *
 * @param {Express.Request} req A req that contains
 * the errors throw by validator
 */
exports.SendValidatorError = (req, res) => {
  // validation results
  const errors = validationResult(req);

  // Validation errors has occured
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation error occured.",
      details: errors.array().map((err) => err.msg),
    });
  }
};
