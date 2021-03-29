const express = require("express");
const { deleteProduct } = require("../../controllers/admin/delete-product");
const router = express.Router();
router.delete("/:id", deleteProduct);

module.exports = router;
