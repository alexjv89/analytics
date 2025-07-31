const { DataTypes } = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('VerificationTokens', {
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    identifier: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },{
    schema: 'auth',
    tableName: 'verification_tokens',
    timestamps: false,
  });
};