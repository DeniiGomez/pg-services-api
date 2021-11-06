const { User, Rol, UserRol, Emergency, insertEmergencies, StatusActivity, StatusActivityRol }  = require('../database/connection')
const createToken = require('../services/auth')
const sendMail = require('../services/email')
const bcrypt = require('bcryptjs')
const generateCode = require('../services/code')

const { check, validationResult } = require('express-validator')

const users = async (req, res) => {
  const users =  await User.findAll()
  res.status(200).send(users)
}

const updatedUser = async (req, res) => {
  try {
    const id = req.params.idUser
    const body = req.body
    await User.update(body, { where: { id }})
    res.status(200).send({ message: 'Datos actualizados'})
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
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
    //console.log(errors)

    if(!errors.isEmpty()) return res.status(500).send({ errors: listErrors })

    //const user =  await UserRol.findOne({ include: [{ model: User, where : { email } }, ] })
    const user = await User.findOne({ 
      where: { email }, 
      include: {
        model: Rol,
        through: { attributes: [] }
      }
    })

    //console.log(user.password, password)

    //return res.status(200).send(user)

    if(!user) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }

    if(user.status === 'Pending') return res.status(400).send({ message: 'User required confirm email' })
  
    const compare = await bcrypt.compare(password, user.password)

    if(!compare) {
      return res.status(400).send({ message: 'Email or password does not match' })
    }

    //if(user.rols[0].id === 4 && user.rols[0].name === 'Civil') {
      //const emergencies = await Emergency.findOne({ where: { idUserRol: user.id } })
      ////console.log(emergencies)
      //if(!emergencies) {
        //await insertEmergencies(Emergency, user.id)
      //}
    //}


    const token = createToken(user)

    res.status(200).send({
      id: user.id,
      avatar: `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=random`,
      name: user.name,
      surname: user.surname,
      fullName: `${user.name}${user.secondName ? " "+user.secondName : "" } ${user.surname}${user.secondSurname ? " "+user.secondSurname : ""}`,
      email: user.email,
      numberPhone: user.numberPhone,
      rol: {
        id: user.rols[0].id,
        name: user.rols[0].name,
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
      check('name').not().isEmpty().withMessage("El campo nombres es obligatorio").escape(),
      check('surname').not().isEmpty().withMessage("El campo apellidos es obligatorio").escape(),
      check('numberPhone').isInt().not().isEmpty().withMessage("El campo numero de telefono es obligatorio").escape(),
      check('email').isEmail().normalizeEmail().withMessage('El email debe ser valido').escape(),
      check('password').not().isEmpty().withMessage('La contrasena es obligatoria').escape(),
      check('idRol').not().isEmpty().withMessage('El rol es obligatorio').escape(),
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
      //const token = createToken(user)
      const mail = await sendMail(body.name, body.email, code)
      await UserRol.create({ idRol: body.idRol, idUser: user.id })
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
    console.log(code)

    const user = await User.findOne({ where: { confirmationCode: code } })

    if(!user) return res.status(404).send({ message: 'Confirmation code invalid' })
    
    const active = await User.findOne({ where: { confirmationCode: code, status: 'Active'} })

    if(active) return res.status(404).send({ message: 'Confirmation code has expired' })

    await User.update({ status: 'Active' }, { where: { confirmationCode: code } })

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
  recoverPassword,
  updatedUser
}
