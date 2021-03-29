const express = require("express")
const { getCustomers } = require("../../controllers/admin/customer")
const router = express.Router()

router.get("/", getCustomers)

module.exports = router