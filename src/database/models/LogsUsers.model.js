const { DataTypes } = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('LogsUsers', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tp_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    org: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
    project: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
  }, {
    tableName: 'logs_users',
    timestamps: false,
  });
};