const { Model, STRING, TIME } = require("sequelize");

const sequelize = require("./sequelize");

class Timing extends Model {}

Timing.init(
  {
    day: {
      type: STRING(20),
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    opening: {
      type: TIME,
      allowNull: false,
    },
    closing: {
      type: TIME,
      allowNull: false,
    },
  },
  { sequelize, timestamps: false }
);

module.exports = Timing;
