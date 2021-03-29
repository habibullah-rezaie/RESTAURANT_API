const express = require("express");
const { deleteProduct, deleteProductImage, deleteProductAllergen} = require("../../controllers/admin/delete-product");
const router = express.Router();
router.delete("/:id", deleteProduct);
router.delete("/:id", deleteProductImage)
router.delete("/:id", deleteProductAllergen)

module.exports = router;
