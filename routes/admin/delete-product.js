const express = require("express");
const { param } = require("express-validator");

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

router.delete("/:id", deleteProductFile);
router.delete("/allergens/:id", deleteProductAllergen);
router.delete("/additives/:id", deleteProductAdditive);
router.delete("/categories/:id", deleteProductCategory);
router.delete("/toppings/:id", deleteProductTopping);

module.exports = router;
