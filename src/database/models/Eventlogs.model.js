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
    event: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    app: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    object: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    action_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    env: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    org: { // log organization
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user: { // log user
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