const express = require("express");
const { getCustomers } = require("../../controllers/admin/customer");

const router = express.Router();

// GET /admin/customers/ => Show customers
router.get("/", getCustomers);

// GET /admin/customers/:id => get info about a customer
router.get("/:id", getCustomer);

module.exports = router;
