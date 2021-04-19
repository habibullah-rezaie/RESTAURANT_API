const express = require("express");
const { query, param } = require("express-validator");

const {
  getOrders,
  getSingleOrder,
  changeOrderSentStatus,
} = require("../../controllers/admin/order");
const { isAuthenticated } = require("../../utils/auth");
const ZipCode = require("../../models/zipCode");
const Order = require("../../models/order");

const router = express.Router();

// GET /admin/orders/ => return all orders list
router.get(
  "/",
  isAuthenticated,
  [
    query("page")
      .optional()
      .trim()
      .isNumeric()
      .withMessage("The page entry should have a numeric value.")
      .toInt(),
    query("limit")
      .optional()
      .trim()
      .isNumeric()
      .withMessage("The limit entry should have a numeric value.")
      .toInt(),
    query("isDone")
      .optional()
      .trim()
      .isIn(["true", "false"])
      .withMessage('"isDone" should either be true or false'),
    query("zipCode")
      .optional()
      .trim()
      .isPostalCode("DE")
      .withMessage("Invalid postal code.")
      .custom(async (postalCode, { req }) => {
        console.log(postalCode);

        const fetchedPostalCode = await ZipCode.findByPk(postalCode);

        if (!fetchedPostalCode) {
          const err = new Error("We do no have service in the area.");
          err.SPECIAL_TYPE = "validation";
          throw err;
        }

        req.zipCode = fetchedPostalCode;
      }),
    query("phoneNumber")
      .optional()
      .trim()
      .isMobilePhone("any") // TODO: Change local
      .withMessage("Invalid phone number."),
    query("startDate")
      .optional()
      .trim()
      .isNumeric()
      .withMessage('The "startDate" enty should be a timestamp.')
      .toInt(),
    query("endDate")
      .optional()
      .trim()
      .isNumeric()
      .withMessage('The "endDate" enty should be a timestamp.')
      .toInt()
      .custom((endDate, { req }) => {
        if (endDate < req.body.startDate)
          throw new Error('"endDate" should not be before "startDate".');
        return true;
      }),
    query("orderBy")
      .optional()
      .trim()
      .isIn(["total", "createdAt"])
      .withMessage("Only can order orders based on thier total and date"),
    query("orderByDirection")
      .optional()
      .trim()
      .isIn(["ASC", "DESC"])
      .withMessage('orderByDirection should be either "ASC" or "DESC".'),
  ],
  getOrders
);

// GET /admin/orders/:id => return details of an specific order
router.get("/:id", isAuthenticated, [], getSingleOrder);

// PATCH /admin/orders/:id => change the isDone COL' value in DB
router.patch(
  "/:id",
  isAuthenticated,
  [
    param("id")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
      .custom(async (id, { req }) => {
        const order = await Order.findByPk(id);

        if (!order) throw new Error("No order exist with given id");

        req.order = order;
      }),
  ],
  changeOrderSentStatus
);

module.exports = router;
