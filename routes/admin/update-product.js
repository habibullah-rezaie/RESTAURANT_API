const express = require("express");
const { updateProduct } = require("../../controllers/admin/update-product");
const router = express.Router();

// PUT /admin/products/
router.put("/", updateProduct);

module.exports = router;
