const express = require("express");

const {
  getOrders,
  getSingleOrder,
  changeOrderSentStatus,
} = require("../../controllers/admin/order");
const { isAuthenticated } = require("../../utils/auth");

const router = express.Router();

// GET /admin/orders/ => return all orders list
router.get("/", isAuthenticated, [], getOrders);

// GET /admin/orders/:id => return details of an specific order
router.get("/:id", isAuthenticated, [], getSingleOrder);

// PATCH /admin/orders/:id => change the isDone COL' value in DB
router.patch("/:id", isAuthenticated, [], changeOrderSentStatus);

module.exports = router;
