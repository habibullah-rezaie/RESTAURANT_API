const { Model, UUID, UUIDV4, TEXT } = require("sequelize");
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
      type: TEXT,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false }
);

module.exports = Additive;
