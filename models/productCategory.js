const { Model, UUID, UUIDV4, TEXT, STRING } = require("sequelize");
const sequelize = require("./sequelize");

class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: TEXT,
    },
  },
  { sequelize, timestamps: false }
);

module.exports = ProductCategory;
