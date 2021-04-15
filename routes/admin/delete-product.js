const express = require("express");
const {
  deleteProductCategory,
} = require("../../controllers/admin/delete-product");
const {
  deleteProduct,
  deleteProductImage,
  deleteProductAllergen,
  deleteProductAdditive,
  deleteProductTopping,
} = require("../../controllers/admin/delete-product");
const router = express.Router();
router.delete("/:id", deleteProduct);
router.delete("/:id", deleteProductImage);
router.delete("/allergens/:id", deleteProductAllergen);
router.delete("/additives/:id", deleteProductAdditive);
router.delete("/categories/:id", deleteProductCategory);
router.delete("/toppings/:id", deleteProductTopping);

module.exports = router;
