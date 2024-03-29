const {
  Model,
  UUID,
  UUIDV4,
  TEXT,
  SMALLINT,
  TINYINT,
  DOUBLE,
} = require("sequelize");
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
      type: DOUBLE(5, 2),
      allowNull: true,
    },
    outPrice: {
      type: DOUBLE(9, 2),
      allowNull: true,
    },
    inPrice: {
      type: DOUBLE(9, 2),
      allowNull: true,
    },
  },
  { sequelize, timestamps: false }
);

module.exports = OrderItem;
