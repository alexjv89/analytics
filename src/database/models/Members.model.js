const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
  return sequelize.define('Members', {
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    project: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
  }, {
    tableName: 'members',
    timestamps: false,
  });
};
