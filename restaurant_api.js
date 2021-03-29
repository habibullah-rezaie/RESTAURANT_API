const express = require("express");

const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");

const app = express();

app.use("/admin/products", updateProductRoutes);

sync(app);
