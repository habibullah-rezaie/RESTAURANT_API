const express = require("express");
const { getTimings } = require("../../controllers/restaurant/timing");

const router = express.Router();

// GET /timings => get list of timings
router.get("/timings", getTimings);

module.exports = router;
