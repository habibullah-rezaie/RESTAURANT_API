const express = require("express");
const {
  getProducts,
  getProduct,
  getToppings,
  getFiles,
  getAdditives,
  getAllergens,
} = require("../../controllers/restaurant/product");

const router = express.Router();

// GET /admin/products/ => GEt list of products
router.get("/", getProducts);

// GET /admin/products/:id => GEt detail single product
router.get("/:id", getProduct);

// GET /admin/products/toppings/ => Get list of toppings of a product
router.get("/toppings/", getToppings);

// GET /admin/products/files/ => Get list of files of a product
router.get("/files/", getFiles);

// GET /admin/products/allergens/ => Get list of allergens of a product
router.get("/allergens/", getAllergens);

// GET /admin/products/additvies/ => Get list of additives of a product
router.get("/additives/", getAdditives);
module.exports = router;
