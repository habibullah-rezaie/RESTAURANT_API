const Admin = require("./admin");
const database = require("./sequelize");
const File = require("./file");
const Timing = require("./timing");
const Product = require("./product");
const Order = require("./order");
const Customer = require("./customer");
const ZipCode = require("./zipCode");
const Address = require("./address");
const OrderItem = require("./OrderItem");
const Additive = require("./additive");
const Allergen = require("./allergen");
const Topping = require("./topping");
const OrderItemTopping = require("./orderItemTopping");
const ProductCategory = require("./productCategory");
const { belongsTo } = require("./timing");

// Every Order belongs to a customer
Order.belongsTo(Customer);
Customer.hasMany(Order);

// Every Customer has an address
Customer.belongsTo(Address);
Address.hasMany(Customer);

// Every Address has a zip code
Address.belongsTo(ZipCode, { as: "Zip" });
ZipCode.hasMany(Address);

// Product has many files
Product.hasMany(File);
File.belongsTo(Product);

// Product belongs to several orders
Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

// Every product belongs to a special product
Product.belongsTo(ProductCategory);
ProductCategory.hasMany(Product);

Additive.belongsTo(Product);
Product.hasMany(Additive);

Allergen.belongsTo(Product);
Product.hasMany(Allergen);

Product.hasMany(Topping);
Topping.belongsTo(Product);

Topping.belongsToMany(OrderItem, { through: OrderItemTopping });
OrderItem.belongsToMany(Topping, { through: OrderItemTopping });

/**
 * server: An http server
 */
module.exports = async (cb) => {
  try {
    await database.sync({ force: false });

    await cb();
  } catch (error) {
    console.error(error);
  }
};
