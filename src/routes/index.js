const express = require('express')
const authController = require('../controllers/auth')
const emergencyController = require('../controllers/emergencies')
const alertController = require('../controllers/alerts')
const managementController = require('../controllers/management')
const api = express.Router()
const auth = require('../middlewares/auth')

//Routes
//Login
api.get('/users', auth, authController.users)
api.post('/users/login', authController.login)
api.post('/users/register', authController.register)
api.get('/users/confirm/:code', authController.confirmMail)
api.post('/users/recover-password', authController.recoverPassword)
api.put('/users/:idUser', auth, authController.updatedUser)

//crud emergencies
api.use(auth)
api.get('/emergencies', emergencyController.getEmergencies)
api.post('/emergencies', emergencyController.createEmergency)
api.put('/emergencies/:idEmergency', emergencyController.updateEmergency)
api.delete('/emergencies/:idEmergency', emergencyController.deleteEmergency)

//curd alerts
api.get('/alerts', alertController.getAlerts)
api.post('/test-alert', alertController.testNotification)
api.post('/alerts', alertController.createAlert)
api.put('/alerts/:idAlert', alertController.updatedAlert)

//Crud Management
api.get('/management', managementController.getManagements)
api.post('/management', managementController.createManagement)


module.exports = api
