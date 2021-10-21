//const admin = require('../services/firebase')
const { sendOneNotification, sendNotifications } = require('../services/notifications')
const {check, validationResult} = require('express-validator')
const { Alert, Emergency, UserRol, User, StatusActivity, Rol, Status } = require('../database/connection')


const testNotification = async(req, res) => {

  const token = req.headers.devicetoken
  //console.log(req.headers)

  //const message = req.body.message
  try {
    const notification = {
      token,
      notification: {
        body: "Notificacion",
        title: "App",
        sound: "default",
      },
      android:{
        priority:"high"
      },
    }

    await sendOneNotification(notification)

    res.status(200).send({ message: "Notificacion enviada" })

  } catch(err) {
    res.status(500).send({ message: err.message })
  }

}

const getAlerts = async (req, res) => {
  try {
    const idUser = req.query.idUser
    const idAlert = req.query.idAlert

    if(idUser && idAlert) {
      const alert = await Alert.findOne({
        attributes: { exclude: ['idEmergency', 'idStatus']},
        where: {id: idAlert},
        include: [
          {
            model: Emergency,
            where: {idUserRol: idUser},
          },
          {
            model: Status, 
            attributes: ['id','name'],
          }
        ]
      })

      res.status(200).send(alert ? alert : {})  

    }else if (idAlert) {
      const alert = await Alert.findOne({
        attributes: { exclude: ['idEmergency', 'idStatus']},
        where: {id: idAlert},
        include: [
          {
            model: Emergency,
            where: {idUserRol: idUser},
            include: [
              {
                model: UserRol,
              }
            ]
          },
          {
            model: Status, 
            attributes: ['id','name'],
          }
        ]
      })

      res.status(200).send(alert ? alert : {})  
    }else {
      const alerts = await Alert.findAll({
        attributes: { exclude: ['idEmergency', 'idStatus']},
        include: [
          {
            model: Emergency,
            attributes: { exclude: ['idUserRol']},
            where: {idUserRol: idUser},
            include: [
              {
                model: UserRol,
              }
            ]
          },
          {
            model: Status, 
            attributes: ['id','name'],
          }
        ]
      })

      res.status(200).send(alerts)  
    }
  } catch (error) {
    res.status(500).send(error.message)
  }

}

const getAlert = async (req, res) => {
  const idUser = req.query.idUser
  const idAlert = req.query.idAlert

  const alert = await Alert.findOne({
    where: { id: idAlert },
    include: [
      {
        model: Emergency,
        include: [
          {
            model: UserRol,
            where: { id: idUser },
            include: { 
              model: User,
            }
          }
        ]
      }
    ]
  })

  res.status(200).send(alert)
}

const createAlert = async (req, res) => {
  try {
    //const token = req.headers.devicetoken

    const { idEmergency, latitude, longitude } = req.body

    const rules = [
      check('idEmergency').not().isEmpty().withMessage("El id del usuario es requrido"),
      check('latitude').not().isEmpty().withMessage("La longitu es requrida"),
      check('longitude').not().isEmpty().withMessage("La longitude es requerida")
    ]

    await Promise.all(rules.map(validation => validation.run(req)))

    const errors = validationResult(req)
    const listErrors = errors.array().map(err => err.msg)
    console.log(errors)

    if(!errors.isEmpty()){
      return res.status(500).send({ errors: listErrors })
    } else {

      const usersAvailable = await User.findAll({ 
        attributes: ['deviceToken'],
        include: [
          { 
            model: Rol,
            where: {id: 3},
            through: { attributes: [] },
            include: {
              model: StatusActivity,
              where: { id: 1 },
              through: { attributes: [] }
            }
          },
        ] 
      })

      if(usersAvailable.length){
        const tokens = usersAvailable.map(x => x.deviceToken).filter(y => y !== null)
        
        if(tokens.length){ 
          const emergency = await Emergency.findOne({where: { id: idEmergency }})
          const alert = await Alert.create({ idEmergency, latitude, longitude, idStatus: 1 })
            const notifications = {
              tokens,
              notification: {
                title: "Alerta de emergencia",
                body: emergency.name,
              },
              data: {
                idAlert: `${alert.id}`,
              },
            }  
            const notification = await sendNotifications(notifications) 
            if(notification.failureCount > 0) {
              const failedToken = []
              notification.responses.forEach((res, index) => {
                if(!res.success) failedToken.push(res.error.message)
              })
              res.status(500).send({ message: failedToken })
            }
            //console.log(notification)
            res.status(200).send({ message: 'Alerta enviada a las unidades disponibles' })
          //return res.status(200).send(notifications)
        }else {
          return res.status(200).send({ message: 'Unidades no disponibles' })
        }

      }else {
        return res.status(200).send({ message: 'Unidades no disponibles' })
      }

      //console.log(available)
      
      //const notification = {
        //notification: {

        //}
      //}

      //const alert = await Alert.create({ idEmergency, latitude, longitude })
      
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
}

module.exports = {
  getAlerts,
  getAlert,
  testNotification,
  createAlert
}
