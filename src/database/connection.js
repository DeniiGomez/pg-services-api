require('dotenv').config()
const  { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/users')
const RolModel = require('../models/rols')
const UserRolModel = require('../models/usersRols')
const EmergencyModel = require('../models/emergencies')
const AlertModel = require('../models/alerts')
const ManagementAlertModel = require('../models/managementAlert')
const StatusModel = require('../models/statuses')
const StatusActivityModel = require('../models/statusActivity')
const StatusActivityRolModel = require('../models/statusActivityRol')

const insertEmergencies = require('./insertEmergencies')

//connection db 
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const User = UserModel(sequelize, DataTypes);
const Rol = RolModel(sequelize, DataTypes);
const StatusActivity = StatusActivityModel(sequelize, DataTypes)
const StatusActivityRol = StatusActivityRolModel(sequelize, DataTypes)
const UserRol = UserRolModel(sequelize, DataTypes);
const Emergency = EmergencyModel(sequelize, DataTypes);
const Alert = AlertModel(sequelize, DataTypes);
const Status = StatusModel(sequelize, DataTypes);
const ManagementAlert = ManagementAlertModel(sequelize, DataTypes);

StatusActivity.belongsToMany(Rol, { through: StatusActivityRol, foreignKey: 'idStatusActivity'})
Rol.belongsToMany(StatusActivity, { through: StatusActivityRol, foreignKey: 'idRol' })
Rol.belongsToMany(User, { through: UserRol,  foreignKey: 'idRol'});
User.belongsToMany(Rol, { through: UserRol, foreignKey: 'idUser'});

Rol.hasMany(UserRol, { foreignKey: 'idRol' })
User.hasMany(UserRol, { foreignKey: 'idUser'})

UserRol.belongsTo(User, { foreignKey: 'idUser'})
UserRol.belongsTo(Rol, { foreignKey: 'idRol'})

Emergency.belongsTo(UserRol, { foreignKey: 'idUserRol'});
Alert.belongsTo(Emergency, { foreignKey: 'idEmergency'});
Alert.belongsTo(Status, { foreignKey: 'idStatus'});

UserRol.belongsToMany(Alert, { through: ManagementAlert, foreignKey: 'idUserRol'});
Alert.belongsToMany(UserRol, { through: ManagementAlert, foreignKey: 'idAlert'});

UserRol.hasMany(ManagementAlert, { foreignKey: 'idUserRol'})
Alert.hasMany(ManagementAlert, { foreignKey: 'idAlert'})

ManagementAlert.belongsTo(UserRol, { foreignKey: 'idUserRol'});
ManagementAlert.belongsTo(Alert, { foreignKey: 'idAlert'});
//UserRol.belongsTo(ManagementAlert, { foreignKey: 'idUserRol'});

(async () => {
  try {
    await sequelize.sync({ force: true }) 
    console.log('Connection successfull to DB')
  } catch (err) {
    console.log(err.message)
  }
})();

module.exports = {
  User,
  Rol,
  UserRol,
  Emergency, 
  Alert, 
  Status, 
  ManagementAlert,
  insertEmergencies,
  StatusActivity,
  StatusActivityRol
}
