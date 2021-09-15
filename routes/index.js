const express = require('express')
const loginController = require('../controllers/login')
const api = express.Router()
const auth = require('../middlewares/auth')

//Routes
//Login
api.get('/users', auth, loginController.users)
api.post('/users/login', loginController.login)
api.post('/users/register', loginController.register)
api.get('/users/confirm/:code', loginController.confirmMail)
api.post('/users/recover-password', loginController.recoverPassword)

module.exports = api
