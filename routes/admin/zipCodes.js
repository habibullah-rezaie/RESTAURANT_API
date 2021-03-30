const express = require("express");
const { addZipCode } = require("../../controllers/admin/zip-codes");

const router = express.Router();

// POST /admin/products/zipCodes/ => Add a zip code
router.post("/", addZipCode);

// PUT /admin/products/zipCode/:code => Edit a zip code
router.put("/:code", addZipCode);

// DELETE /admins/products/zipCodes/:code => delete a zip code
router.delete("/:code", addZipCode);

module.exports = router;
