module.exports = (sequelize, DataTypes) => sequelize.define('status_activity_rol', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
})
