const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    idUser: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNULL: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNULL: false,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNULL: false,
      defaultValue: "Pending"
    },
    confirmationCode: {
      type: DataTypes.STRING,
      allowNULL: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNULL: false,
    }
  }, {
    hooks: {
      beforeCreate: async (user) => {
        if(user.password) {
          const salt = await bcrypt.genSaltSync(10)
          user.password = bcrypt.hashSync(user.password, salt)
        }
      },
      beforeUpdate: async (user) => {
        if(user.password) {
          const salt = await bcrypt.genSaltSync(10)
          user.password = bcrypt.hashSync(user.password, salt)
        }
      }
    },
    instanceMethods: {
      validPassword(password) {
        return bcrypt.compare(password, this.password)
      }
    }
  })
}
