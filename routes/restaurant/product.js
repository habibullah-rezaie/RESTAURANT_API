const express = require("express");
const { query, param } = require("express-validator");

const {
  getProducts,
  getProduct,
  getToppings,
  getFiles,
  getAdditives,
  getAllergens,
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
          const fetchedCtg = await ProductCategory.findOne({
            where: { name: ctg },
          });
          if (!fetchedCtg) throw new Error("Category does not exist.");
          req.productCategory = fetchedCtg;
          return true;
        }
        throw new Error("No category name was passed");
      }),
    query("limit").trim().isNumeric().withMessage("Limit not a number").toInt(),
    query("page").trim().isNumeric().withMessage("Limit not a number").toInt(),
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
        const product = await Product.findByPk(id, {include: ['ProductCategory']});
        if (!product) throw new Error("No product exist with given id");
        req.product = product;
      }),
  ],
  getProduct
);

// GET /admin/products/toppings/ => Get list of toppings of a product
router.get("/toppings/", getToppings);

// GET /admin/products/files/ => Get list of files of a product
router.get("/files/", getFiles);

// GET /admin/products/allergens/ => Get list of allergens of a product
router.get("/allergens/", getAllergens);

// GET /admin/products/additvies/ => Get list of additives of a product
router.get("/additives/", getAdditives);
module.exports = router;
