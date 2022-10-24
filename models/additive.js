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
    },
  },
  {
    sequelize,
    timestamps: false,
    indexes: [{ unique: true, fields: ["ProductId", "text"] }],
  }
);

module.exports = Additive;
