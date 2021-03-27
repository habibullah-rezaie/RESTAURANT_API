const { Model, UUID, UUIDV4, STRING, CHAR, TEXT } = require("sequelize");
const sequelize = require("./sequelize");

class ZipCode extends Model {}

ZipCode.init(
  {
    code: {
      type: CHAR(5),
      primaryKey: true,
      allowNull: false,
      validate: {
        len: [5, 5],
      },
    },
    description: {
      type: TEXT({ length: "tiny" }),
    },
  },
  { sequelize, timestamps: false }
);

module.exports = ZipCode;
