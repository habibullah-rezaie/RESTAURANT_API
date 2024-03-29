const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const RefreshToken = require("../models/refreshToken");
const { generateAccessToken } = require("../utils/auth");
const { sendValidatorError, throwError } = require("../utils/error");

const TOKEN_EXPIRATION_TIME = "15m";

const login = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);

  if (!errors.isEmpty()) return sendValidatorError(errors, res, next);

  try {
    const { admin } = req;

    const accessToken = generateAccessToken(
      {
        admin: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
        },
      },
      TOKEN_EXPIRATION_TIME
    );

    let refreshToken = jwt.sign(
      {
        admin: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
        },
      },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: Date.now() + 8640000,
      }
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

const getToken = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res);

  const { refreshToken } = req;

  try {
    jwt.verify(
      refreshToken.token,
      process.env.JWT_REFRESH_TOKEN_SECRET,
      (err, data) => {
        if (err) throwError(err.message, 403);

        const token = generateAccessToken({admin: data.admin}, TOKEN_EXPIRATION_TIME);

        res.status(200).json({
          token,
          message: "Access token generated.",
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  // validation results
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidatorError(errors, res, next);

  const { refreshToken } = req;
  try {
    await refreshToken.destroy();

    res.status(200).json({
      message: "Succeessfully logged out.",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getToken,
  login,
  logout,
};
