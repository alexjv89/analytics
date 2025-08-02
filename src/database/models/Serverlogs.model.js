const { DataTypes } = require('sequelize');

module.exports = function(sequelize){
  return sequelize.define('Serverlogs', {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    app_env: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    app_name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_method: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_protocol: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_host: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_ip: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_body: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    req_query: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    req_headers: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    req_route_path: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_user_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    req_session_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    res_status_code: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    res_status_message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    res_time: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    res_meta: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    req_org_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    project: {
      type: DataTypes.STRING(12),
      allowNull: false,
    },
  }, {
    tableName: 'serverlogs',
    timestamps: true,
    indexes: [
      {
        fields: ['req_method']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['app_name']
      },
      {
        fields: ['status', 'app_name', 'req_org_id']
      },
      {
        fields: ['app_name', 'req_org_id', 'status', 'createdAt']
      },
      {
        fields: ['createdAt', 'app_env', 'app_name', 'status', 'req_method', 'req_protocol', 'res_status_code']
      },
      {
        fields: ['status']
      },
      {
        fields: ['res_status_code']
      },
      {
        fields: ['req_org_id']
      }
    ]
  });
};