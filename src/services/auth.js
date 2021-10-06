require('dotenv').config()
const jwt = require('jsonwebtoken')

const createToken = (user) => {
  const token = jwt.sign(
    {
      id: user.idUser,
      email: user.email,
    }, 
    process.env.JWT_SECRET,
    { 
      algorithm: 'HS256'
    }
  )

  return token
}

module.exports = createToken
