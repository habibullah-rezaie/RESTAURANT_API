const {
  Model,
  UUID,
  UUIDV4,
  STRING,
  TEXT,
  DOUBLE,
  INTEGER,
} = require("sequelize");
const sequelize = require("./sequelize");

class Product extends Model {}

Product.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: TEXT,
    },
    inPrice: {
      type: DOUBLE(9, 2),
      allowNull: false,
    },
    outPrice: {
      type: DOUBLE(9, 2),
      allowNull: false,
    },
    discount: {
      type: DOUBLE(5, 2),
      defaultValue: 0,
      allowNull: false,
    },
    sells: {
      type: INTEGER,
      defaultValue: 0,
    },
  },
  { sequelize }
);

module.exports = Product;
