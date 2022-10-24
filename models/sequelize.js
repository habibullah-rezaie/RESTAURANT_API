const { Sequelize } = require("sequelize");

const DATABASE = process.env.DATABASE_NAME;
const USER = process.env.DATABASE_USERNAME;
const PASSWORD = process.env.DATABASE_PASSWORD;

const sequelize = new Sequelize(DATABASE, USER, PASSWORD, {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
