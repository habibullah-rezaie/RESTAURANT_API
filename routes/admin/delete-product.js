const express = require("express");
const {
  deleteProductCategory,
} = require("../../controllers/admin/add-product");
const {
  deleteProduct,
  deleteProductImage,
  deleteProductAllergen,
  deleteProductTopping,
} = require("../../controllers/admin/delete-product");
const router = express.Router();
router.delete("/:id", deleteProduct);
router.delete("/:id", deleteProductImage);
router.delete("/:id", deleteProductAllergen);
router.delete("/:id", deleteProductAdditive);
router.delete("/:id", deleteProductCategory);
router.delete("/:id", deleteProductTopping);

module.exports = router;
