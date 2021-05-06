const moment = require("moment");
const express = require("express");
const { body } = require("express-validator");
const { Op } = require("sequelize");

const { createOrder } = require("../../controllers/restaurant/order");
const Customer = require("../../models/customer");
const Product = require("../../models/product");
const ZipCode = require("../../models/zipCode");
const Timing = require("../../models/timing");
const { throwError } = require("../../utils/error");

const router = express.Router();

// POST /order => create an order
router.post(
  "/",
  [
    body().custom(async (reqBody, {}) => {
      const now = moment();
      const today = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ][now.weekday()];

      const timing = await Timing.findByPk(today);

      if (!timing)
        throw { message: "Restaurant is closed today.", httpStatusCode: 400 };
      const opening =
        now.format("YYYY-MM-DD") + "T" + timing.opening + "+02:00";

      const closing =
        now.format("YYYY-MM-DD") + "T" + timing.closing + "+02:00";

      if (
        !(
          now.utcOffset(120).isAfter(opening) &&
          now.utcOffset(120).isBefore(closing)
        )
      ) {
        throw {
          message: "Restaurant is closed at the moment.",
          httpStatusCode: 400,
        };
      }

      const { firstName, lastName, phoneNumber, address, products } = reqBody;
      if (!address) throw new Error("No address given.");
      if (!firstName || !lastName || !phoneNumber)
        throw new Error("Invalid phone number, first name, or last name.");
      if (!address.zipCode) throw new Error("No zip code was given.");
      if (!address.detail) throw new Error("No Address detail was given.");
      if (!products || products.length === 0)
        throw new Error("No product was given.");

      return true;
    }),
    body("products")
      .isArray()
      .withMessage("Entry products in json should be an array")
      .custom(async (products, { req }) => {
        const newProducts = [];
        const toppings = {};

        for (const prd of products) {
          try {
            const product = await Product.findByPk(prd.id);
            if (product && !Number.isNaN(prd.qty)) {
              newProducts.push({ product, qty: prd.qty, remark: prd.remark });

              const productToppings = [];
              if (prd.toppings && prd.toppings.length > 0) {
                for (const toppingId of prd.toppings) {
                  const [fetchedTopping] = await product.getToppings({
                    where: {
                      id: toppingId,
                    },
                  });
                  if (!fetchedTopping)
                    throw new Error(
                      "Invalid Topping for product" + product.title
                    );
                  productToppings.push(fetchedTopping);
                }
                toppings[product.id] = productToppings;
              } else {
                toppings[product.id] = "";
              }
            } else if (!product) throw new Error("Invalid product id");
            else throw new Error("Invalid quantity");
          } catch (err) {
            console.error(err);
            throw err;
          }
        }

        console.log(toppings);
        req.toppings = toppings;
        req.products = newProducts;
      }),
    body(["firstName", "lastName"])
      .trim()
      .isLength({ max: 100 })
      .withMessage(
        "First name, and last name should not have more than 100 characters."
      ),
    body("phoneNumber")
      .trim()
      .isNumeric()
      .withMessage("Non-numeric phone number.")
      .isLength({ max: 14 })
      .withMessage("Invalid length for phoneNumber"),
    body("address")
      .isObject()
      .withMessage("Address should be an object.")
      .custom(async (address, { req }) => {
        if (!address) throw new Error("No address given.");

        const { firstName, lastName, phoneNumber } = req.body;
        console.log(firstName);
        if (!firstName || !lastName || !phoneNumber)
          throw new Error("Invalid phone number, first name, or last name.");
        if (!address.zipCode) throw new Error("No zip code was given.");
        if (!address.detail) throw new Error("No Address detail was given.");

        const zipCode = await ZipCode.findByPk(address.zipCode);

        if (!zipCode)
          throw new Error(
            "Invalid zip code, or we do not provide service in given zip code."
          );

        req.zipCode = zipCode;

        const fetchedCustomer = await Customer.findOne({
          where: {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            "$Address.detail$": { [Op.eq]: address.detail },
            "$Address.ZipCode$": { [Op.eq]: address.zipCode },
          },
          include: ["Address"],
        });

        req.customer = fetchedCustomer;
      }),
  ],
  createOrder
);

module.exports = router;
