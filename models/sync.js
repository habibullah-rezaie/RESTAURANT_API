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
File.belongsTo(Product)

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

    // const ctg = await ProductCategory.create({
    //   name: "newFood",
    //   description: "foodery",
    // });

    // const prod = await Product.create({
    //   title: "first product",
    //   description: "this is first product",
    //   inPrice: 0,
    //   outPrice: 1,
    //   discount: 0,
    // });

    // await prod.setProductCategory(ctg);
    // console.log(prod);

    // const al1 = await Allergen.create({ text: "this first allergen" });
    // const al1 = await Topping.create({
    //   title: "this second Topping",
    //   price: 12,
    // });

    // const [prod] = await Product.findAll();
    // console.log(prod);
    // await al1.setProduct(prod);


    await cb();

  } catch (error) {
    console.error(error);
  }
};
