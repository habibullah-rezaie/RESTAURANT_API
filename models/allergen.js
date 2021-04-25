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
    },
  },
  {
    sequelize,
    indexes: [{ unique: true, fields: ["id", "text"] }],
    timestamps: false,
  }
);

module.exports = Allergen;
