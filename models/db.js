const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("chat_app", "habibullah", "", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;

