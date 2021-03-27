const { Model, DataTypes } = require("sequelize");
const sequelize = require("./sequelize");

class File extends Model {}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    fileName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
  },
  { sequelize: sequelize }
);

module.exports = File;
