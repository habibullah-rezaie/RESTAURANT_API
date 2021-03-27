const { Model, UUID, UUIDV4 } = require("sequelize");
const sequelize = require("./sequelize");

class Order extends Model {}

Order.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
  },
  { sequelize }
);

module.exports = Order;
