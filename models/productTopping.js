const { Model, UUID, UUIDV4, TEXT, SMALLINT } = require("sequelize");
const sequelize = require("./sequelize");

class ProductTopping extends Model {}

ProductTopping.init(
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

module.exports = ProductTopping;
