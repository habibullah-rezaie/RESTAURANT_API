const Admin = require("./admin");
const database = require("./sequelize");
const File = require("./file");
const Timing = require("./timing");
const Product = require("./product");
const Order = require("./order");
const Customer = require("./customer");
const ZipCode = require("./zipCode");
const Address = require("./address");
const ProductFile = require("./productFile");
const OrderItem = require("./OrderItem");
const Additive = require("./additive");

// Every Order belongs to a customer
Order.belongsTo(Customer, { as: "customer" });

// Every Customer has an address
Customer.belongsTo(Address);

// Every Address has a zip code
Address.belongsTo(ZipCode, { as: "zip" });

// Product has many files
Product.belongsToMany(File, { through: ProductFile });
File.belongsToMany(Product, { through: ProductFile });

// Product belongs to several orders
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

Additive.belongsTo(Product);
/**
 * server: An http server
 */
module.exports = async (server) => {
  try {
    await database.sync({ force: true });
    console.log("Success Synchronizing database.");
  } catch (error) {
    console.error(error);
  }
};
