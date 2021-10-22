const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNULL: false,
  },
  secondName: {
    type: DataTypes.STRING(45),
    allowNULL: false,
  },
  surname: {
    type: DataTypes.STRING(45),
    allowNULL: false,
  },
  secondSurname: {
    type: DataTypes.STRING(45),
    allowNULL: false,
  },
  numberPhone: {
    type: DataTypes.STRING,
    allowNULL: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNULL: false,
    unique: true,
  },
  status: {
    type: DataTypes.STRING(15),
    allowNULL: false,
    defaultValue: "Pending"
  },
  confirmationCode: {
    type: DataTypes.STRING(10),
    allowNULL: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNULL: false,
  },
  deviceToken: {
    type: DataTypes.STRING
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
