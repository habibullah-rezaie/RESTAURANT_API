const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("SushiHuny", "noor", "", {
  dialect: "mysql",
  host: "localhost"
});

module.exports = sequelize;

