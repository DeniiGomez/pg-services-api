module.exports = (sequelize, DataTypes) => sequelize.define('alert', {
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