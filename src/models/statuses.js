module.exports = (sequelize, DataTypes) => sequelize.define('status', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45),
  },
  description: {
    type: DataTypes.STRING,
  }
})