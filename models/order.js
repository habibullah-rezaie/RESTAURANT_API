const { Model, UUID, UUIDV4, BOOLEAN, DOUBLE } = require("sequelize");
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
    isDone: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    total: {
      type: DOUBLE(9, 2),
      defaultValue: 0,
    },
  },
  { sequelize }
);

module.exports = Order;
