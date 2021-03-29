const express = require("express");
const { updateProduct } = require("../../controllers/admin/update-product");
const router = express.Router();

// PUT /admin/products/:id -> update a product
router.put("/:id", updateProduct);

module.exports = router;
