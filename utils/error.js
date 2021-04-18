/**
 *
 * @param {[import("express-validator").ValidationError]} errors A req that contains
 * the errors throw by validator
 */
exports.sendValidatorError = (errors, res) => {
  let statusCode = 422;

  // Find a different status code.
  const details = errors.array().map((err) => {
    statusCode = (err.statusCode && err.statusCode) || 422;

    return err.msg;
  });

  // Validation errors has occured
  if (!errors.isEmpty()) {
    return res.status(statusCode).json({
      message: "Validation error occured.",
      details,
    });
  }
};

/**
 * Throw error; the erorr`s message would be sent to the client
 *
 * if you want the message to not be sent to the cliend throught error
 * without this function
 *
 * @param {String} msg A message to include in error
 * @param {Number} statusCode A statusCode to include for later error response
 * @param {Object} options other attribues to add to error
 */
exports.throwError = (msg, statusCode, options = {}) => {
  const err = new Error("ERROR");
  err.msg = msg;
  err.statusCode = statusCode;
  Object.keys(options).forEach((key) => (err[key] = options[key]));
  throw err;
};
