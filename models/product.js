const {
  Model,
  UUID,
  UUIDV4,
  STRING,
  TEXT,
  SMALLINT,
  TINYINT,
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
      type: STRING(64),
      allowNull: false,
    },
    description: {
      type: TEXT,
    },
    inPrice: {
      type: SMALLINT,
      allowNull: false,
    },
    outPrice: {
      type: SMALLINT,
      allowNull: false,
    },
    discount: {
      type: TINYINT,
      defaultValue: 0,
      allowNull: false,
    },
  },
  { sequelize }
);

module.exports = Product;
