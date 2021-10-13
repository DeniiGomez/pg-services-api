require('dotenv').config()
const  { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('../models/users')
const RolModel = require('../models/rols')
const UserRolModel = require('../models/usersRols')
const EmergencyModel = require('../models/emergencies')
const AlertModel = require('../models/alerts')
const ManagementAlertModel = require('../models/managementAlert')
const StatusModel = require('../models/statuses')

const insertEmergencies = require('./insertEmergencies')

//connection db 
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_CONNECTION
});

const User = UserModel(sequelize, DataTypes);
const Rol = RolModel(sequelize, DataTypes);
const UserRol = UserRolModel(sequelize, DataTypes);
const Emergency = EmergencyModel(sequelize, DataTypes);
const Alert = AlertModel(sequelize, DataTypes);
const ManagementAlert = ManagementAlertModel(sequelize, DataTypes);
const Status = StatusModel(sequelize, DataTypes);

UserRol.belongsTo(User, { foreignKey: 'idUser'});
UserRol.belongsTo(Rol, { foreignKey: 'idRol'});
Emergency.belongsTo(UserRol, { foreignKey: 'idUserRol'});
Alert.belongsTo(Emergency, { foreignKeyi: 'idEmergencie'});
ManagementAlert.belongsTo(Alert, { foreignKey: 'idAlert'});
ManagementAlert.belongsTo(Status, { foreignKey: 'idStatus'});

(async () => {
  try {
    await sequelize.sync({ force: false }) 
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
  insertEmergencies
}
