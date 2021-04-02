const express = require("express");
const { query } = require("express-validator");

const {
  getCustomers,
  getCustomer,
} = require("../../controllers/admin/customer");

const router = express.Router();

// GET /admin/customers/ => Show customers
router.get(
  "/",
  query("order")
    .trim()
    .isIn(["ASC", "DESC"])
    .withMessage('The query order should be either "ASC" or "DESC".'),
  getCustomers
);

// GET /admin/customers/:id => get info about a customer
router.get("/:id", getCustomer);

module.exports = router;
