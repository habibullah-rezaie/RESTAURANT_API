const { json } = require("express");
const express = require("express");

const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");
const zipCodeRoutes = require("./routes/admin/zipCodes");

const app = express();

// Allow CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// parse json requests
app.use(json());

// Use product updating related routes
app.use("/admin/products", updateProductRoutes);

// Use routes related to zip code
app.use("/admin/zipCodes", zipCodeRoutes);

sync(app);
