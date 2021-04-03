const { json } = require("express");
const express = require("express");

const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");
const zipCodeRoutes = require("./routes/admin/zipCodes");
const timingRoutes = require("./routes/admin/timing");
const customerRoutes = require("./routes/admin/customer");
const productRoutes = require("./routes/restaurant/product");

const timingClientRoutes = require("./routes/restaurant/timing");
const zipCodeClientRoutes = require("./routes/restaurant/zip-code");

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

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// Use product updating related routes
app.use("/admin/products", updateProductRoutes);

// Use routes related to zip code
app.use("/admin/zipCodes", zipCodeRoutes);

// Use routes related to timing(service time)
app.use("/admin/timings", timingRoutes);

// Use routes related to customer
app.use("/admin/customers", customerRoutes);

app.use("/products", productRoutes);

// Use client timing routes
app.use("/timings", timingClientRoutes);

// Use client zip code related routes
app.use("/zipCodes", zipCodeClientRoutes);

// Error handling route
app.use((err, req, res, next) => {
  res.status(err.statusCode ? err.statusCode : 500).json({
    message: `Something went wrong. Sorry! we're tring to fix it.`,
  });
});

// Synchronize database and then make server listen
sync(app);
