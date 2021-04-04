const express = require("express");
<<<<<<< HEAD
const {
  updateProduct,
  updateProductAllergen,
  updateProductAdditive,
  updateProductToppings,
  updateProductCategory,
} = require("../../controllers/admin/update-product");
const router = express.Router();

// PUT /admin/products/:id -> update a product
router.put("/:id", updateProduct);

// PUT /admin/products/allergen/id -> change the text of a specifiec allergen
router.put("/allergens/:id", updateProductAllergen);

// PUT /admin/products/additives/id -> change the text of a specifiec additives
router.put("/additives/:id", updateProductAdditive);

// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put("/toppings/:id", updateProductToppings);


// PUT /admin/products/toppings/id -> change the text of a specifiec toppings
router.put("/categories/:id", updateProductCategory);
=======
const { updateProduct } = require("../../controllers/admin/update-product");
const router = express.Router();

// PUT /admin/products/
router.put("/", updateProduct);
>>>>>>> f93baabc6d3e56bc618128048b279953abff8fa7

module.exports = router;
