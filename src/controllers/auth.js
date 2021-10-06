const { User, Rol, UserRol, Emergency, insertEmergencies }  = require('../database/connection')
const createToken = require('../services/auth')
const sendMail = require('../services/email')
const bcrypt = require('bcryptjs')
const generateCode = require('../services/code')

const { check, validationResult } = require('express-validator')

const users = async (req, res) => {
  const users =  await User.findAll()
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

    //const user =  await User.findOne({ where: { email } })
    const user =  await UserRol.findOne({ include: [{ model: User, where : { email } }, { model: Rol}] })
    //console.log(user)

    if(!user) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }

    if(user.user.status === 'Pending') return res.status(400).send({ message: 'User required confirm email' })

    if(!bcrypt.compare(password, user.user.password)) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }

    if(user.rol.id === 4 && user.rol.name === 'Civil') {
      const emergencies = await Emergency.findOne({ where: { idUserRol: user.id } })
      //console.log(emergencies)
      if(!emergencies) {
        await insertEmergencies(Emergency, user.id)
      }
    }


    const token = createToken(user.user)

    res.status(200).send({
      id: user.id,
      name: user.user.name,
      email: user.user.email,
      rol: {
        id: user.rol.id,
        name: user.rol.name,
      },
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
      check('idRol').not().isEmpty().withMessage('El rol es obligatorio')
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
      const user =  await User.create(body)
      await UserRol.create({ idRol: body.idRol, idUser: user.id })
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

    const user =  await User.update({ status: 'Active' }, { where: { confirmationCode: code } })

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
