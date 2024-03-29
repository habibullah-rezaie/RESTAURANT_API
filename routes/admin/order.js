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
const Customer = require("../../models/customer");
const Address = require("../../models/address");

const router = express.Router();

// GET /admin/orders/ => return all orders list
router.get(
  "/",
  isAuthenticated,
  [
    query().custom((reqBody) => {
      console.log(reqBody);
      return true;
    }),
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
      .isIn([0, 1])
      .withMessage('"isDone" should either be 1 or 0'),
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
      .customSanitizer((phoneNumber) => {
        if (/^490?[1|3]/.test(phoneNumber)) phoneNumber = "+" + phoneNumber;
        return phoneNumber;
      })
      .isMobilePhone("de-DE")
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
router.get(
  "/:id",
  isAuthenticated,
  [
    param("id")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
      .custom(async (id, { req }) => {
        const order = await Order.findByPk(id, {
          attributes: ["id", "isDone", "createdAt"],
          include: [
            {
              model: Customer,
              attributes: ["createdAt", "firstName", "lastName"],
              include: [{ model: Address, attributes: ["detail", "ZipCode"] }],
            },
          ],
        });

        if (!order) throw new Error("No order exist with given id");

        req.order = order;
      }),
  ],
  getSingleOrder
);

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
