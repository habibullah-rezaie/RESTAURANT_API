const express = require("express");
const {
  updateProduct,
  updateProductAllergen,
} = require("../../controllers/admin/update-product");
const router = express.Router();

// PUT /admin/products/:id -> update a product
router.put("/:id", updateProduct);

// PUT /admin/products/allergen/id -> change the text of a specifiec allergen
router.put("/allergens/:id", updateProductAllergen);

module.exports = router;
