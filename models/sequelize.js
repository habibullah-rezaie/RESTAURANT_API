const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("SushiHuny", "habibullah", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

