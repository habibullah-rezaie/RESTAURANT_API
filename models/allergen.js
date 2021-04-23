const { Model, UUID, UUIDV4, STRING } = require("sequelize");
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
      type: STRING,
      allowNull: false,
      unique: true,
    },
  },
  { sequelize }
);

module.exports = Allergen;
