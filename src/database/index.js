import { getSequelizeInstance } from '@/database/sequelize.js'

let db = null;

function getDB() {
  if (db) {
    return db;
  }
  
  const sequelize = getSequelizeInstance();
  
  // Initialize all models
  db = {
    sequelize,
    // Application models
    // Orgs: require('./models/Orgs.model.js')(sequelize),
    Members: require('./models/Members.model.js')(sequelize),
    Projects: require('./models/Projects.model.js')(sequelize),
    Eventlogs: require('./models/Eventlogs.model.js')(sequelize),
    Serverlogs: require('./models/Serverlogs.model.js')(sequelize),
    LogsUsers: require('./models/LogsUsers.model.js')(sequelize),
    LogsOrgs: require('./models/LogsOrgs.model.js')(sequelize),
    
    // Auth models
    Users: require('./models/auth/Users.model.js')(sequelize),
    AuthAccounts: require('./models/auth/AuthAccounts.model.js')(sequelize),
    Sessions: require('./models/auth/Sessions.model.js')(sequelize),
    VerificationTokens: require('./models/auth/VerificationTokens.model.js')(sequelize)
  };
  
  return db;
}

export { getDB };