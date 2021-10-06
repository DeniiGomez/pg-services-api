module.exports = (sequelize, DataTypes) => sequelize.define('management_alerts', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  longitude: {
    type: DataTypes.DOUBLE,
  },
  latitude: {
    type: DataTypes.DOUBLE,
  }
})