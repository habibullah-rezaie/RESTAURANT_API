const { json } = require("express");
const express = require("express");
require("dotenv").config();

const { hash } = require("bcryptjs");


const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");

const addproductRoutes = require("./routes/admin/add-product")
const deleteProductRoutes = require("./routes/admin/delete-product")
const customer = require("./routes/admin/customer")
const addTimingRoutes = require("./routes/admin/timing")
const deleteTimingRoutes = require("./routes/admin/dalete-timing")

const zipCodeRoutes = require("./routes/admin/zipCodes");
const timingRoutes = require("./routes/admin/timing");
const customerRoutes = require("./routes/admin/customer");
const productRoutes = require("./routes/restaurant/product");
const adminLogin = require("./routes/auth/login");

const timingClientRoutes = require("./routes/restaurant/timing");
const zipCodeClientRoutes = require("./routes/restaurant/zip-code");
const orderClientRoutes = require("./routes/restaurant/order");
const Admin = require("./models/admin");


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

///
// app.use((req,res, next)=>{
//   console.log(req.url);
//   next()
// })

///

// parse json requests
app.use(json());

// Use product updating related routes
app.use("/admin/products", updateProductRoutes);

//used for product addition 
app.use("/admin/products", addproductRoutes)

//used for product deletion
app.use("/admin/products", deleteProductRoutes)

//used for customers view
app.use("/admin/customers", customer)

//used for timing
app.use("/admin/timing", addTimingRoutes)

//used for timing deletion
app.use("/admin/timing", deleteTimingRoutes)



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

// Use client order related routes
app.use("/order", orderClientRoutes);

// Use login routes
app.use("/login", adminLogin);

// Error handling route
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode ? err.statusCode : 500).json({
    message: err.msg
      ? err.msg
      : `Something went wrong. Sorry! we're tring to fix it.`,
  });
});

// Synchronize database and then make server listen
sync(async () => {
  try {
    const admin = await Admin.findOne({
      where: {
        email: "habibullah.rezaie.8@gmail.com",
      },
    });

    if (!admin) {
      console.log(
        await Admin.create({
          firstName: "Habibullah ",
          lastName: "Rezaie",
          email: "habibullah.rezaie.8@gmail.com",
          password: await hash("password", 13),
        })
      );
    }
    app.listen(8888, () => console.log("Server started on post 8888"));
  } catch (err) {
    console.error(err);
  }
});
