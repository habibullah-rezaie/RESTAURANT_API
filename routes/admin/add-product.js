const express = require("express");
const { addProduct, addAllergrns, addAdditives } = require("../../controllers/admin/add-product");
const router = express.Router();

// POST /admin/products/ -> add a product
router.post("/", addProduct);
router.post("/allergens", addAllergrns);
router.post("/additives", addAdditives);

module.exports = router;
