const { DataTypes } = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('Projects', {
    id: {
      type: DataTypes.STRING(12),
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    client_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    client_secret: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    org: {
      type: DataTypes.STRING(12),
      allowNull: true,
    },
  }, {
    tableName: 'projects',
    timestamps: false,
  });
};