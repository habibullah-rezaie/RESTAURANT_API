const { Model, STRING } = require("sequelize");
const sequelize = require("./sequelize");

class RefreshToken extends Model {}

RefreshToken.init(
  {
    token: {
      type: STRING,
      primaryKey: true,
      allowNull: false,
    },
  },
  { sequelize, updatedAt: false }
);

module.exports = RefreshToken;
