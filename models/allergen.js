const { Model, UUID, UUIDV4, TEXT } = require("sequelize");
const sequelize = require("./sequelize");

class Allergen extends Model {}

Allergen.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    text: {
      type: TEXT({ length: "tiny" }),
      allowNull: false,
    },
  },
  { sequelize }
);

module.exports = Allergen;
