const express = require("express");
const { login } = require("../controllers/auth");
const { body } = require("express-validator");
const Admin = require("../models/admin");
const { compare } = require("bcryptjs");
const router = express.Router();

// POST /login => login admink
router.post(
  "/login",
  [
    body("password")
      .trim()
      .isLength({ min: 7, max: 64 })
      .withMessage("Invalid password or Email"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid Email or Email")
      .custom(async (email, { req }) => {
        let password;
        if (!req.body.password) return;

        password = req.body.password;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
          const err = new Error("Invalid email or password");
          err.statusCode = 400;
          throw err;
        }

        const passwordCompareRes = await compare(password, admin.password);

        if (!passwordCompareRes) {
          const err = new Error("Invalid email or password");
          err.statusCode = 400;
          throw err;
        }

        req.admin = admin;
      }),
  ],
  login
);

const { getToken } = require("../controllers/auth");
const RefreshToken = require("../models/refreshToken");

router.get(
  "/token",
  [
    body().custom((reqBody) => {
      console.log(reqBody);
      return true;
    }),
    body("refreshToken")
      .isString()
      .withMessage({
        msg: "Refresh token should be a String.",
        specialType: "AUTHENTICATION_FAILURE",
      })
      .isLength({ min: 10 })
      .withMessage({
        msg: "Refresh token has invalid length.",
        specialType: "AUTHENTICATION_FAILURE",
      })
      .custom(async (token, { req }) => {
        let fetchedToken = null;
        try {
          fetchedToken = await RefreshToken.findByPk(token);
        } catch (err) {
          throw {
            specialType: "SuquelizeError",
            message: "Something went wrong, trying to fix it.",
            error: err,
          };
        }

        if (!fetchedToken) {
          throw new Error("Refresh token does not exist.");
        }

        req.refreshToken = fetchedToken;
      }),
  ],
  getToken
);

module.exports = router;
