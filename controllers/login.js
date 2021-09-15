const { Users }  = require('../connection')
const createToken = require('../services/auth')
const sendMail = require('../services/email')
const bcrypt = require('bcryptjs')
const generateCode = require('../services/code')

const { check, validationResult } = require('express-validator')

const users = async (req, res) => {
  const users =  await Users.findAll()
  res.status(200).send(users)
}

const login = async (req, res) => {
  try {
  
    const { email, password } = req.body

    const rules = [
      check('email').isEmail().normalizeEmail().withMessage('El email debe ser valido').escape(),
      check('password').not().isEmpty().withMessage('La contrasena es obligatoria').escape(),
    ]
  
    await Promise.all(rules.map(validation => validation.run(req)))

    const errors = validationResult(req)
    const listErrors = errors.array().map(err => err.msg)
    console.log(errors)

    if(!errors.isEmpty()) return res.status(500).send({ errors: listErrors })

    const user =  await Users.findOne({ where: { email } })

    if(!user) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }

    if(user.status === 'Pending') return res.status(400).send({ message: 'User required confirm email' })

    if(!bcrypt.compare(password, user.password)) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }
    const token = createToken(user)

    res.status(200).send({
      name: user.name,
      email: user.email,
      token
    })
  } catch (err) {
    console.log(err)
    const erroresSequelize = err.errors.map(err => err.message)
    res.status(500).send({ errors: erroresSequelize })
  }
}

const register = async (req, res) => {

  try {
    const body = req.body

    const rules = [
      check('name').not().isEmpty().withMessage("El nombre es obligatorio").escape(),
      check('email').isEmail().normalizeEmail().withMessage('El email deb ser valido').escape(),
      check('password').not().isEmpty().withMessage('La contrasena es obligatoria').escape(),
    ]

    await Promise.all(rules.map(validation => validation.run(req)))

    const errors = validationResult(req)
    const listErrors = errors.array().map(err => err.msg)
    console.log(errors)

    if(!errors.isEmpty()){
      return res.status(500).send({ errors: listErrors })
    } else {
      const code = generateCode()
      body.confirmationCode = code
      const user =  await Users.create(body)
      //const token = createToken(user)
      const mail = await sendMail(user.name, user.email, code)
      console.log(mail)
      res.status(200).send({ message: 'Usuario registrado, por favor revisa tu email para activar la cuenta' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ error: err.message })
  }
}

const confirmMail = async (req, res) => {
  try {
    const code = req.params.code

    const user =  await Users.update({ status: 'Active' }, { where: { confirmationCode: code } })

    if(!user) return res.status(404).send({ message: 'User not found' })

    res.status(200).send({ message: 'Correo confirmado' })

  } catch (err) {
    console.log(err)
  }
}

const recoverPassword = (req, res) => {
  res.status(200).send({
    'algo': 'recover password'
  })
}

module.exports = {
  users,
  login,
  register,
  confirmMail,
  recoverPassword
}
