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
    // details: {
    //   type: DataTypes.JSONB,
    //   allowNull: true,
    //   defaultValue:{},
    // },
    // settings: {
    //   type: DataTypes.JSONB,
    //   allowNull: true,
    //   defaultValue:{},
    // },
    // feature_flags: {
    //   type: DataTypes.JSONB,
    //   allowNull: true,
    //   defaultValue:{
    //     'show_onboarding':true
    //   },
    // },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    // client_id: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    client_secret: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'projects',
    timestamps: false,
  });
};