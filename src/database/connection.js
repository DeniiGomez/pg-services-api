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
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  port: process.env.DB_POT,
  dialect: 'mysql'
});

const User = UserModel(sequelize, DataTypes);
const Rol = RolModel(sequelize, DataTypes);
const UserRol = UserRolModel(sequelize, DataTypes);
const Emergency = EmergencyModel(sequelize, DataTypes);
const Alert = AlertModel(sequelize, DataTypes);
const ManagementAler = ManagementAlertModel(sequelize, DataTypes);
const Status = StatusModel(sequelize, DataTypes);

UserRol.belongsTo(User, { foreignKey: 'idUser'});
UserRol.belongsTo(Rol, { foreignKey: 'idRol'});
Emergency.belongsTo(UserRol, { foreignKey: 'idUserRol'});
Alert.belongsTo(Emergency, { foreignKeyi: 'idEmergencie'});
ManagementAler.belongsTo(Alert, { foreignKey: 'idAlert'});
ManagementAler.belongsTo(Status, { foreignKey: 'idStatus'});

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
  ManagementAler,
  insertEmergencies
}
