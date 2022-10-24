/**
 *
 * @param {[import("express-validator").ValidationError]} errors A req that contains
 * the errors throw by validator
 */
exports.sendValidatorError = (errors, res, next = undefined) => {
  let httpStatusCode = 422;
  let hasSpecialTypeError = false;

  // Find a different status code.
  const details = errors.array().map((err) => {
    httpStatusCode = (err.httpStatusCode && err.httpStatusCode) || 422;

    if ((err.msg.specialType || err.msg.httpStatusCode) && next) {
      hasSpecialTypeError = true;
      return next(err.msg);
    }

    return err.msg;
  });

  if (hasSpecialTypeError) return;

  // Validation errors has occured
  if (!errors.isEmpty()) {
    return res.status(httpStatusCode).json({
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
 * @param {Number} httpStatusCode A httpStatusCode to include for later error response
 * @param {Object} options other attribues to add to error
 */
exports.throwError = (msg, httpStatusCode, options = {}) => {
  const err = new Error('ERROR');
  err.msg = msg;
  err.httpStatusCode = httpStatusCode;
  Object.keys(options).forEach((key) => (err[key] = options[key]));
  throw err;
};
