const express = require("express");
const { addProduct, addAllergrns, addAdditives, addToppings, addFile } = require("../../controllers/admin/add-product");
const router = express.Router();

// POST /admin/products/ -> add a product
router.post("/", addProduct);
router.post("/allergens", addAllergrns);
router.post("/additives", addAdditives);
router.post("/toppings", addToppings);
router.post("/files", addFile)

module.exports = router;
