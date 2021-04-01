const express = require("express");
const {
  addZipCode,
  updateZipCode,
  deleteZipCode,
} = require("../../controllers/admin/zip-codes");

const router = express.Router();

// POST /admin/products/zipCodes/ => Add a zip code
router.post("/", addZipCode);

// PUT /admin/products/zipCode/:code => Edit a zip code
router.put("/:code", updateZipCode);

// DELETE /admins/products/zipCodes/:code => delete a zip code
router.delete("/:code", deleteZipCode);

module.exports = router;
