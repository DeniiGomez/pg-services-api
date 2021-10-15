//const admin = require('../services/firebase')
const { sendOneNotification, sendNotifications } = require('../services/notifications')
const {check, validationResult} = require('express-validator')
const { Alert, Emergency, UserRol, User, StatusActivity, Rol } = require('../database/connection')


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
  const id = req.query.idUser

  const alerts = await Alert.findAll({
    include: [
      {
        model: Emergency,
        include: [
          {
            model: UserRol,
            where: { id },
            include: { 
              model: User,
            }
          }
        ]
      }
    ]
  })

  res.status(200).send(alerts)
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

      const usersAvailable = await UserRol.findAll({ 
        where: {idRol: 3},
        include: [
          {
            model: User,
          },
          { 
            model: Rol,
            include: {
              model: StatusActivity,
              where: { id: 1 }
            }
          },
        ] 
      })

      if(usersAvailable.length){
        const tokens = usersAvailable.map(item => item.user).map(x => x.deviceToken).filter(y => y !== null)

        if(tokens.length){
         
          const emergency = await Emergency.findOne({where: { id: idEmergency }})
          //const alert = Alert.create({ idEmergency, latitude, longitude })
          
          const notifications = {
            tokens,
            notification: {
              title: "Alerta de emergencia",
              body: emergency.name,
            },
            data: {
              //idAlert: alert.id,
            }
          }
          await sendNotifications(notifications) 
          res.status(200).send({ message: 'Alerta enviadas a la unidad de bomberos' })
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
