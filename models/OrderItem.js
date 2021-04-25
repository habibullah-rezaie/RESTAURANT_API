const { Model, UUID, UUIDV4, TEXT, SMALLINT, TINYINT } = require("sequelize");
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
    discount: {
      type: TINYINT,
      allowNull: false,
    },
    outPrice: {
      type: SMALLINT,
      allowNull: false,
    },
    inPrice: {
      type: SMALLINT,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false }
);

module.exports = OrderItem;
