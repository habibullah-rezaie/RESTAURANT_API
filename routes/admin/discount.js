const express = require("express");
const { body } = require("express-validator");
const { discountAll } = require("../../controllers/admin/discount");
const { isAuthenticated } = require("../../utils/auth");

const router = express.Router();

// PATCH /discountAll => give discount to all products
router.patch(
  "/discountAll",
  isAuthenticated,
  [
    body("discount")
      .trim()
      .isNumeric()
      .withMessage("Discount should be numeric")
      .toFloat()
      .custom((discount) => {
        if (!(0 <= discount && discount <= 100))
          throw new Error("Discount should be between 1 - 100.");
        return true;
      }),
  ],
  discountAll
);

module.exports = router;
