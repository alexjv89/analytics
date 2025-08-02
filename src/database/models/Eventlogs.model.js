const { DataTypes } = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('Eventlogs', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    app_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    app_env: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    log_org: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    log_user: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    project: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  }, {
    tableName: 'eventlogs',
    timestamps: false,
    comment: 'tracking events',
    indexes: [
      {
        unique: true,
        fields: ['id']
      }
    ]
  });
};