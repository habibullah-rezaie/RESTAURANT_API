const bcrypt = require("bcryptjs");

exports.login = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { email, password } = req.body;

  
};
