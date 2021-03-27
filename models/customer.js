const { Model, UUID, UUIDV4, STRING } = require("sequelize");
const sequelize = require("./sequelize");

class Customer extends Model {}

Customer.init(
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    lastName: {
      type: STRING(100),
      allowNull: false,
    },
    firstName: {
      type: STRING(100),
      allowNull: false,
    },
    phoneNumber: {
      type: STRING(14),
    },
  },
  { sequelize, updatedAt: false }
);

module.exports = Customer;
