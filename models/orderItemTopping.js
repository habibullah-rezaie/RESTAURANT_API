const { Model, UUID, UUIDV4, TEXT, SMALLINT } = require("sequelize");
const sequelize = require("./sequelize");

class OrderItemTopping extends Model {}

OrderItemTopping.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false}
);

module.exports = OrderItemTopping;
