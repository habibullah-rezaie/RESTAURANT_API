const express = require("express");
const { query, param } = require("express-validator");

const {
  getCustomers,
  getCustomer,
} = require("../../controllers/admin/customer");
const Customer = require("../../models/customer");

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
router.get(
  "/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        try {
          const customer = await Customer.findByPk(id);
          if (!customer) throw new Error("Invalid customer");
          req.customer = customer;
        } catch (err) {
          console.error(err);
          throw err;
        }
      }),
  ],
  getCustomer
);

module.exports = router;
