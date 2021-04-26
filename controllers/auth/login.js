const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Admin = require("../../models/admin");
const RefreshToken = require("../../models/refreshToken");
const { sendValidatorError, throwError } = require("../../utils/error");

exports.login = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  try {
    const { admin } = req;

    const accessToken = jwt.sign(
      {
        admin: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
        },
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    let refreshToken = jwt.sign(
      {
        admin: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
        },
      },
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    refreshToken = await RefreshToken.create({ token: refreshToken });

    if (!refreshToken || !refreshToken.token)
      throwError("Something went wrong, we're trying to fix it.", 500);

    res.status(200).json({
      token: accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
