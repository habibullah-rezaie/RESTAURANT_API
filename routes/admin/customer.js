const express = require("express");
const { query, param } = require("express-validator");

const {
  getCustomers,
  getCustomer,
} = require("../../controllers/admin/customer");
const Customer = require("../../models/customer");
const { isAuthenticated } = require("../../utils/auth");

const router = express.Router();

// GET /admin/customers/ => Show customers
router.get(
  "/",
  isAuthenticated,
  query("order")
    .trim()
    .isIn(["ASC", "DESC"])
    .withMessage('The query order should be either "ASC" or "DESC".'),
  getCustomers
);

// GET /admin/customers/:id => get info about a customer
router.get(
  "/:id",
  isAuthenticated,
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const customer = await Customer.findByPk(id);
        if (!customer) throw new Error("Invalid customer");
        req.customer = customer;
      }),
  ],
  getCustomer
);

module.exports = router;

