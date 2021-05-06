const express = require("express");
const { login, logout } = require("../controllers/auth");
const { query, body } = require("express-validator");
const Admin = require("../models/admin");
const { compare } = require("bcryptjs");
const router = express.Router();
const { isAuthenticated } = require("../utils/auth");

// POST /login => login admink
router.post(
  "/login",
  [
    body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
      .withMessage("Invalid password or Email"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email or password")
      .custom(async (email, { req }) => {
        let password;
        if (!req.body.password) return;

        password = req.body.password;

        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
          throw {
            httpStatusCode: 401,
            message: "No admin exist with given email.",
          };
        }

        const passwordCompareRes = await compare(password, admin.password);

        if (!passwordCompareRes) {
          throw {
            httpStatusCode: 401,
            message: "Invalid email, or password.",
          };
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
    query("refreshToken")
      .isString()
      .withMessage({
        msg: "Refresh token should be a String.",
        httpStatusCode: 401,
      })
      .isLength({ min: 10 })
      .withMessage({
        msg: "Refresh token has invalid length.",
        httpStatusCode: 401,
      })
      .custom(async (token, { req }) => {
        let fetchedToken = null;
        try {
          fetchedToken = await RefreshToken.findByPk(token);
        } catch (err) {
          throw {
            httpStatusCode: 500,
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

router.delete(
  "/logout",
  [
    query("refreshToken")
      .isString()
      .withMessage({
        msg: "Refresh token should be a String.",
        httpStatusCode: 401,
      })
      .isLength({ min: 10 })
      .withMessage({
        msg: "Refresh token has invalid length.",
        httpStatusCode: 401,
      })
      .custom(async (token, { req }) => {
        let fetchedToken = null;
        try {
          fetchedToken = await RefreshToken.findByPk(token);
        } catch (err) {
          throw {
            httpStatusCode: 500,
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
  logout
);
module.exports = router;
