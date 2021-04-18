const express = require("express");
const { discountAll } = require("../../controllers/admin/discount");
const { isAuthenticated } = require("../../utils/auth");

const router = express.Router();

// PATCH /discountAll => give discount to all products
router.patch("/discountAll", isAuthenticated, [], discountAll);

module.exports = router;
