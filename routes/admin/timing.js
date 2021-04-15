const express = require("express");
const router = express.Router();
const timingController = require("../../controllers/admin/add-timing");
router.post("/", timingController.addtiming);

module.exports = router;