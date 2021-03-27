const Admin = require("./admin");
const database = require("./sequelize");
const File = require("./file");
const Timing = require("./timing");
const Product = require("./product");
const Order = require("./order");
const Customer = require("./customer");
const ZipCode = require("./zipCode");

// TODO: Connect Order to customer
// TODO: Connect Customer to Address

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
