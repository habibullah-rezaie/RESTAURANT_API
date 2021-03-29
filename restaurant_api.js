const { json } = require("express");
const express = require("express");

const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");

const app = express();

// parse json requests
app.use(json());

app.use("/admin/products", updateProductRoutes);

sync(app);
