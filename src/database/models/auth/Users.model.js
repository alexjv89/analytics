const { DataTypes } = require('sequelize');
const crypto = require('crypto');

module.exports = function(sequelize){
  return sequelize.define('Users', {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      defaultValue: () => crypto.randomUUID(),
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.TEXT,
      unique: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },{
    schema: 'auth',
    tableName: 'users',
    timestamps: false,
  });
};