const { Model, UUID, UUIDV4, STRING } = require("sequelize");
const sequelize = require("./sequelize");

class Address extends Model {}

Address.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    detail: {
      type: STRING(500),
      allowNull: false, // Detail is contained of Street, and home number so it is necessary
    },
  },
  { sequelize, timestamps: false }
);

module.exports = Address;
