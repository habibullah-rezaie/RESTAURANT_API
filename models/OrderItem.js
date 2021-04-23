const { Model, UUID, UUIDV4, TEXT, SMALLINT } = require("sequelize");
const sequelize = require("./sequelize");

class OrderItem extends Model {}

OrderItem.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    remark: {
      type: TEXT,
    },
    qty: {
      type: SMALLINT,
      defaultValue: 1,
    },
  },
  { sequelize }
);

module.exports = OrderItem;
