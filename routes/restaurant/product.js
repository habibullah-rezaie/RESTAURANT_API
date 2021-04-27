const express = require("express");
const { query, param, sanitize } = require("express-validator");

const {
  getProducts,
  getProduct,
  getToppings,
  getFiles,
  getAdditives,
  getAllergens,
  getCategories,
} = require("../../controllers/restaurant/product");
const Product = require("../../models/product");
const ProductCategory = require("../../models/productCategory");

const router = express.Router();

// GET /admin/products/ => GEt list of products
router.get(
  "/",
  [
    query("category")
      .trim()
      .custom(async (ctg, { req }) => {
        if (ctg) {
          console.log(ctg);
          const fetchedCtg = await ProductCategory.findOne({
            where: { name: ctg },
          });
          if (!fetchedCtg) throw new Error("Category does not exist.");
          req.productCategory = fetchedCtg;
          return true;
        }
      }),
    query().custom((qr) => {
      if (
        qr.limit !== undefined &&
        Number.isNaN((qr.limit = Number.parseInt(qr.limit)))
      ) {
        throw new Error("Limit should be a number");
      }

      if (
        qr.page !== undefined &&
        Number.isNaN((qr.page = Number.parseInt(qr.page)))
      ) {
        throw new Error("Page should be a number");
      }
      return true;
    }),
  ],
  getProducts
);

// GET /admin/products/:id => GEt detail single product
router.get(
  "/:id",
  [
    param("id")
      .trim()
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id, {
          include: ["ProductCategory"],
        });
        if (!product) throw new Error("No product exist with given id");
        req.product = product;
      }),
  ],
  getProduct
);

// GET /admin/products/toppings/ => Get list of toppings of a product
router.get(
  "/:productId/toppings",
  [
    param("productId")
      .trim()
      .custom(async (productId, { req }) => {
        if (productId) {
          const product = await Product.findByPk(productId);
          if (!product)
            throw new Error("No product with given product id exists.");
          req.product = product;
          return true;
        }
        throw new Error("No product id was given");
      }),
    query().custom((qr) => {
      if (
        qr.limit !== undefined &&
        Number.isNaN((qr.limit = Number.parseInt(qr.limit)))
      ) {
        throw new Error("Limit should be a number");
      }

      if (
        qr.page !== undefined &&
        Number.isNaN((qr.page = Number.parseInt(qr.page)))
      ) {
        throw new Error("Page should be a number");
      }
      return true;
    }),
  ],
  getToppings
);

// GET /admin/products/files/ => Get list of files of a product
router.get(
  "/:productId/files/",
  [
    param("productId")
      .trim()
      .custom(async (productId, { req }) => {
        if (productId) {
          const product = await Product.findByPk(productId);
          if (!product)
            throw new Error("No product with given product id exists.");
          req.product = product;
          return true;
        }
        throw new Error("No product id was given");
      }),
  ],
  getFiles
);

// GET /admin/products/allergens/ => Get list of allergens of a product
router.get(
  "/:productId/allergens/",
  [
    param("productId")
      .trim()
      .custom(async (productId, { req }) => {
        if (productId) {
          const product = await Product.findByPk(productId);
          if (!product)
            throw new Error("No product with given product id exists.");
          req.product = product;
          return true;
        }
        throw new Error("No product id was given");
      }),
    query().custom((qr) => {
      if (
        qr.limit !== undefined &&
        Number.isNaN((qr.limit = Number.parseInt(qr.limit)))
      ) {
        throw new Error("Limit should be a number");
      }

      if (
        qr.page !== undefined &&
        Number.isNaN((qr.page = Number.parseInt(qr.page)))
      ) {
        throw new Error("Page should be a number");
      }
      return true;
    }),
  ],
  getAllergens
);

// GET /admin/products/additvies/ => Get list of additives of a product
router.get(
  "/:productId/additives/",
  [
    param("productId")
      .trim()
      .custom(async (productId, { req }) => {
        if (productId) {
          const product = await Product.findByPk(productId);
          if (!product)
            throw new Error("No product with given product id exists.");
          req.product = product;
          return true;
        }
        throw new Error("No product id was given");
      }),
    query().custom((qr) => {
      if (
        qr.limit !== undefined &&
        Number.isNaN((qr.limit = Number.parseInt(qr.limit)))
      ) {
        throw new Error("Limit should be a number");
      }

      if (
        qr.page !== undefined &&
        Number.isNaN((qr.page = Number.parseInt(qr.page)))
      ) {
        throw new Error("Page should be a number");
      }
      return true;
    }),
  ],
  getAdditives
);

module.exports = router;

// GET /products/categories => get  list of all categories
router.get(
  "/categories",
  [
    query("limit")
      .optional()
      .isInt()
      .withMessage("Limit should be an integer.")
      .toInt(),

    query("page")
      .optional()
      .isInt()
      .withMessage("Page should be an integer.")
      .toInt(),
  ],
  getCategories
);
