const express = require("express");
const router = express.Router();
const timingControllers = require("../../controllers/admin/delete-timing");
router.delete("/:day", timingControllers.deleteTiming);

module.exports = router;
