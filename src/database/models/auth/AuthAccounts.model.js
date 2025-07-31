const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = function(sequelize){
  return sequelize.define('AuthAccounts', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => crypto.randomUUID(),
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    provider_account_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    access_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    token_type: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    scope: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    id_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    session_state: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_id: {
      type: DataTypes.TEXT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },{
    schema: 'auth',
    tableName: 'accounts',
    timestamps: false,
  });
};