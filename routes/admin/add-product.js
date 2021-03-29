const express = require("express");
const { addProduct } = require("../../controllers/admin/add-product");
const router = express.Router();

// POST /admin/products/ -> add a product
router.post('/', addProduct);

module.exports = router;
