const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  if(!req.headers.authorization) {
    return res.status(403).send({ message: `You don't have authorization` })
  }

  const token = req.headers.authorization.split(" ")[1]
  const payload = jwt.decode(token, process.env.JWT_SECRET)

  req.user = payload.sub
  next()
}

module.exports = isAuth
