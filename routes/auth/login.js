const express = require("express");
const { login } = require("../../controllers/auth/login");
const { body } = require("express-validator");
const Admin = require("../../models/admin");
const { compare } = require("bcryptjs");
const router = express.Router();

// POST /login => login admink
router.post(
  "/",
  [
    body("password")
      .trim()
      .isLength({ min: 8, max: 64 })
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
          err.statusCode = 401;
          throw err;
        }

        const passwordCompareRes = await compare(password, admin.password);

        if (!passwordCompareRes) {
          const err = new Error("Invalid email or password");
          err.statusCode = 401;
          throw err;
        }

        req.admin = admin;
      }),
  ],
  login
);

module.exports = router;
