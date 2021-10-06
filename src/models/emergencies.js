module.exports = (sequelize, DataTypes) => sequelize.define('emergency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNULL: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNULL: false,
  },
})
