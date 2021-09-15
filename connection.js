require('dotenv').config()
const  { Sequelize, DataTypes } = require('sequelize')
const UserModel = require('./models/users')

//connection db 
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD, {
  host: process.env.DB_HOST,
  port: process.env.DB_POT,
  dialect: 'mysql'
});

const Users = UserModel(sequelize, DataTypes);

(async () => {
  try {
    await sequelize.sync({ force: false }) 
    console.log('Connection successfull to DB')
  } catch (err) {
    console.log(err.message)
  }
})();

module.exports = {
  Users,
}
