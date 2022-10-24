const { json } = require("express");
const express = require("express");
const path = require("path");
require("dotenv").config();

const { hash } = require("bcryptjs");

const sync = require("./models/sync");
const updateProductRoutes = require("./routes/admin/update-product");

const addproductRoutes = require("./routes/admin/add-product");
const deleteProductRoutes = require("./routes/admin/delete-product");

const zipCodeRoutes = require("./routes/admin/zipCodes");
const timingRoutes = require("./routes/admin/timing");
const customerRoutes = require("./routes/admin/customer");
const productRoutes = require("./routes/restaurant/product");
const discountRoutes = require("./routes/admin/discount");
const orderRoutes = require("./routes/admin/order");
const adminAuth = require("./routes/auth");

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

// TODO: comment this in production
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

// parse json requests
app.use(json());

app.use("/files", express.static(path.join(__dirname, "files")));

//used for product addition
app.use("/admin/products", addproductRoutes);

//used for product deletion
app.use("/admin/products", deleteProductRoutes);

// Use product updating related routes
app.use("/admin/products", updateProductRoutes);

// Use routes related to zip code
app.use("/admin/zipCodes", zipCodeRoutes);

// Use routes related to timing(service time)
app.use("/admin/timings", timingRoutes);

// Use routes related to customer
app.use("/admin/customers", customerRoutes);

// Use admin routes related to discount
app.use("/admin/discount/", discountRoutes);

// Use admin routes related to discount
app.use("/admin/orders/", orderRoutes);

app.use("/products", productRoutes);

// Use client timing routes
app.use("/timings", timingClientRoutes);

// Use client zip code related routes
app.use("/zipCodes", zipCodeClientRoutes);

// Use client order related routes
app.use("/order", orderClientRoutes);

// Use login routes
app.use("/auth", adminAuth);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "build", "index.html"));
// });

// Error handling route
app.use((err, req, res, next) => {
  console.error(err);

  // In case of unique constraint voilation
  if (err.name === "SequelizeUniqueConstraintError") {
    return res.status(422).json({ message: "Data Already exists." });
  }

  // Cases that require different error handling
  // They have a occured in special condition
  if (err.specialType) {
    switch (err.specialType) {
      case "VALIDATION":
        return res.status(err.httpStatusCode ? err.httpStatusCode : 500).json({
          message: err.message,
          details: err.details,
        });
    }
  }

  // Cases where errors require different response codes than
  // 422
  if (err.httpStatusCode) {
    let message = "NO MESSAGE";

    if (err.msg) {
      message = err.msg;
    } else if (err.message) {
      message = err.message;
    }

    return res.status(err.httpStatusCode).json({
      message,
    });
  }

  res.status(500).json({
    message: `Something went wrong. Sorry! we're tring to fix it.`,
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
          firstName: "Habibullah",
          lastName: "Rezaie",
          email: "habibullah.rezaie.8@gmail.com",
          password: await hash("password", 13),
        })
      );
    }

    app.listen(process.env.API_PORT, () =>
      console.log("Server started on post 8888")
    );
  } catch (err) {
    console.error(err);
  }
});
