/**
 *
 * @param {[import("express-validator").ValidationError]} errors A req that contains
 * the errors throw by validator
 */
exports.sendValidatorError = (errors, res) => {
  // Validation errors has occured
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation error occured.",
      details: errors.array().map((err) => err.msg),
    });
  }
};
