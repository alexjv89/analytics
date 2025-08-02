import { Sequelize } from 'sequelize';  
/*======================Initialize Sequelize======================*/

let sequelize = null;

function getSequelizeInstance() {
  if (sequelize) {
    return sequelize;
  }
  
  // Check if DB_APP is available
  if (!process.env.DB_APP) {
    throw new Error('DB_APP environment variable is required but not set');
  }
  
  sequelize = new Sequelize(process.env.DB_APP, {
    logging: false,
    dialect: 'postgres',
    dialectOptions: process.env.NODE_ENV === 'production' ? {
      ssl: {
        require: true, // This will force the SSL requirement
        rejectUnauthorized: false // This is to avoid errors due to self-signed certificates
      }
    } : {}
  });
  
  return sequelize;
}

/*======================Initialize models======================*/

export { getSequelizeInstance };