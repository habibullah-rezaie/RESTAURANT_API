const { Model, UUID, UUIDV4, STRING, SMALLINT } = require("sequelize");
const sequelize = require("./sequelize");

class Topping extends Model {}

Topping.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: STRING(100),
      allowNull: false,
    },
    price: {
      type: SMALLINT,
      allowNull: false,
    },
    ProductId: {
      type: UUID,
    },
  },
  { sequelize, indexes: [{ unique: true, fields: ["ProductId", "title"] }] }
);

module.exports = Topping;
