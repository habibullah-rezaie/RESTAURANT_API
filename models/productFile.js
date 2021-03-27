const { Model, UUID, UUIDV4 } = require("sequelize");
const sequelize = require("./sequelize");

class ProductFile extends Model {}

ProductFile.init(
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

module.exports = ProductFile;
