const { json } = require("express");
const express = require("express");


const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");
const addproductRoutes = require("./routes/admin/add-product")
const deleteProductRoutes = require("./routes/admin/delete-product")
const customer = require("./routes/admin/customer")

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


//used for product addition 
app.use("/admin/products", addproductRoutes)

//used for product deletion
app.use("/admin/products", deleteProductRoutes)

//used for customers view
app.use("/admin/products", customer)

sync(app);
