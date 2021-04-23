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
const Allergen = require("./allergen");
const Topping = require("./topping");
const OrderItemTopping = require("./orderItemTopping");
const ProductCategory = require("./productCategory");

// Every Order belongs to a customer
Order.belongsTo(Customer);

// Every Customer has an address
Customer.belongsTo(Address);

// Every Address has a zip code
Address.belongsTo(ZipCode, { as: "Zip" });

// Product has many files
Product.belongsToMany(File, { through: ProductFile });
File.belongsToMany(Product, { through: ProductFile });

// Product belongs to several orders
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// Every product belongs to a special product
Product.belongsTo(ProductCategory);

Additive.belongsTo(Product);
Allergen.belongsTo(Product);

Product.hasMany(Topping);
Topping.belongsTo(Product);

Topping.belongsToMany(OrderItem, { through: OrderItemTopping });
OrderItem.belongsToMany(Topping, { through: OrderItemTopping });
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
