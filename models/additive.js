const { Model, UUID, UUIDV4, STRING } = require("sequelize");
const sequelize = require("./sequelize");

class Additive extends Model {}

Additive.init(
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
  { sequelize, timestamps: false }
);

module.exports = Additive;
