const express = require("express");
const { addProduct, addAllergrns } = require("../../controllers/admin/add-product");
const router = express.Router();

// POST /admin/products/ -> add a product
router.post("/", addProduct);
router.post("/allergens", addAllergrns);

module.exports = router;
