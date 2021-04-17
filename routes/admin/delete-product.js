const express = require("express");
const { param, body } = require("express-validator");

const {
  deleteProductCategory,
} = require("../../controllers/admin/delete-product");
const {
  deleteProduct,
  deleteProductFile,
  deleteProductAllergen,
  deleteProductAdditive,
  deleteProductTopping,
} = require("../../controllers/admin/delete-product");
const Additive = require("../../models/additive");
const Allergen = require("../../models/allergen");
const Product = require("../../models/product");

const router = express.Router();

// DELETE /admin/products/:id => delete a product
router.delete(
  "/:id",
  param("id")
    .trim()
    .isUUID(4)
    .withMessage("Invalid id format")
    .custom(async (id, { req }) => {
      const product = await Product.findByPk(id);
      if (!product) throw new Error("No product exist with given id");

      req.product = product;
    }),
  deleteProduct
);

// Handle deleting a special file of a special product.
router.delete(
  "/:productId/files/:file",
  [
    param("productId")
      .trim()
      .isUUID(4)
      .withMessage("Invalid id format")
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id);
        if (!product) throw new Error("No product exist with given id");

        req.product = product;
      }),
    param("file")
      .trim()
      .custom(async (fileName, { req }) => {
        if (!req.product) return; // Abort becuase no product found.
        const [file] = await req.product.getFiles({ where: { fileName } });

        if (!file)
          throw new Error(
            "No file related to current product found with given name."
          );

        req.file = file;
      }),
  ],
  deleteProductFile
);

// Handle /admin/product/:productId/allergens/:id
router.delete(
  "/:productId/allergens",
  [
    param("productId")
      .isUUID(4)
      .withMessage("Invalid id format.")
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id);

        if (!product) throw new Error("No product exists with given id.");
        req.product = product;
      }),
    body("id").custom(async (id, { req }) => {
      if (!req.product) return;

      if (id) {
        const allergen = await Allergen.findOne({
          where: {
            ProductId: req.product.id,
            id: id,
          },
        });

        if (!allergen)
          throw new Error(
            "No allergen found for given product id and allergen id"
          );
        req.allergen = allergen;
      }
    }),
  ],
  deleteProductAllergen
);

// Handle /admin/product/:productId/additives/:id
router.delete(
  "/:productId/additives",
  [
    param("productId")
      .isUUID(4)
      .withMessage("Invalid id format.")
      .custom(async (id, { req }) => {
        const product = await Product.findByPk(id);

        if (!product) throw new Error("No product exists with given id.");
        req.product = product;
      }),
    body("id").custom(async (id, { req }) => {
      if (!req.product) return;

      if (id) {
        const additive = await Additive.findOne({
          where: {
            ProductId: req.product.id,
            id: id,
          },
        });

        if (!additive)
          throw new Error(
            "No additive found for given product id and allergen id"
          );
        req.additive = additive;
      }
    }),
  ],
  deleteProductAdditive
);
router.delete("/categories/:id", deleteProductCategory);
router.delete("/toppings/:id", deleteProductTopping);

module.exports = router;
