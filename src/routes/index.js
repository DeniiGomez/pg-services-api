const express = require('express')
const authController = require('../controllers/auth')
const emergencyController = require('../controllers/emergencies')
const api = express.Router()
const auth = require('../middlewares/auth')

//Routes
//Login
api.get('/users', auth, authController.users)
api.post('/users/login', authController.login)
api.post('/users/register', authController.register)
api.get('/users/confirm/:code', authController.confirmMail)
api.post('/users/recover-password', authController.recoverPassword)

api.use(auth)
api.get('/emergencies', emergencyController.getEmergencies)
api.post('/emergencies', emergencyController.createEmergency)
api.put('/emergencies/:idEmergency', emergencyController.updateEmergency)
api.delete('/emergencies/:idEmergency', emergencyController.deleteEmergency)

module.exports = api
