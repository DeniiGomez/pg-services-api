module.exports = (sequelize, DataTypes) => sequelize.define('users_rols', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
})