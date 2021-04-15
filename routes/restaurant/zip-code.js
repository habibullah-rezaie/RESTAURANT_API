const express = require("express");
const { getZipCodes } = require("../../controllers/restaurant/zip-code");
const router = express.Router();

// GET /zipCodes => get list of zip codes
router.get("/", getZipCodes);

module.exports = router;
