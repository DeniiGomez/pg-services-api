const { sendOneNotification } = require('../services/notifications')
const {check, validationResult} = require('express-validator')

const { ManagementAlert, Alert, Emergency, User, UserRol, Status } = require('../database/connection')
const { Op } = require('sequelize')

const getManagements = async (req, res) => {
  try {
    const idUserRol = req.query.idUser
    const idManagement = req.query.idManagement
    const idAlert = req.query.idAlert
    const pending = req.query.pending

    if(idUserRol && idManagement) {
      const management = await ManagementAlert.findOne({
        //attributes: { exclude: ['idEmergency', 'idStatus']},
        where: { id: idManagement, idUserRol },
        include: [
          {
            model: Alert,
            //attributes: { exclude: ['idUserRol']},
            //where: {idUserRol},
            include: [
              {
                model: Emergency,
                attributes: { exclude: ['idUserRol']},
                include: [
                  {
                    model: UserRol,
                    attributes: ['id'],
                    include: {
                      model: User,
                      attributes: ['id', 'name', 'surname', 'numberPhone']
                    }
                  }
                ]
              },
              {
                model: Status, 
                attributes: ['id','name'],
              }
            ]
          },
          {
            model: UserRol,
            attributes: ['id'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'surname', 'numberPhone']
              }
            ]
          }
        ]
      })

      res.status(200).send(management ? management : {})  

    }else if(pending) {
      const alerts = await Alert.findAll({
        attributes: { exclude: ['idEmergency', 'idStatus']},
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Emergency,
            attributes: { exclude: ['idUserRol']},
            // include: [
            //   {
            //     model: UserRol,
            //   }
            // ]
          },
          {
            model: Status, 
            where: { 
              id: {
                [Op.ne]: 4
              }
            },
            attributes: ['id','name'],
          }
        ]
      })

      res.status(200).send(alerts)  
    }else if(idUserRol && idAlert) {
      const management = await ManagementAlert.findOne({
        //attributes: { exclude: ['idEmergency', 'idStatus']},
        where: { idAlert, idUserRol },
        include: [
          {
            model: Alert,
            //attributes: { exclude: ['idUserRol']},
            //where: {idUserRol},
            include: [
              {
                model: Emergency,
                attributes: { exclude: ['idUserRol']},
                include: [
                  {
                    model: UserRol,
                    attributes: ['id'],
                    include: {
                      model: User,
                      attributes: ['id', 'name', 'surname', 'numberPhone']
                    }
                  }
                ]
              },
              {
                model: Status, 
                attributes: ['id','name'],
              }
            ]
          },
          {
            model: UserRol,
            attributes: ['id'],
            include: [
              {
                model: User,
                attributes: ['id', 'name', 'surname', 'numberPhone']
              }
            ]
          }
        ]
      })

      let alert = JSON.stringify(management.alert)
      alert = JSON.parse(alert)
      //alert.user = management.users_rol.user
      
      //alert.alert.user = management.users_rol.user

      res.status(200).send(management ? alert : {})
    }else if (idUserRol) {
      const management = await ManagementAlert.findAll({
        //attributes: { exclude: ['idEmergency', 'idStatus']},
        where: { idUserRol },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Alert,
            //attributes: { exclude: ['idUserRol']},
            where: {idStatus: 4},
            include: [
              {
                model: Emergency,
              },
              {
                model: Status, 
                //where: { id: 4 },
                attributes: ['id','name'],
              }
            ]
          },
        ]
      })
    
      res.status(200).send(management)  
    }

  } catch (error) {
    res.status(500).send({ error: error.message })
  }
}

const createManagement = async (req, res) => {
  try {
    const { idAlert, idUserRol, latitude, longitude } = req.body

    const rules = [
      check('idAlert').not().isEmpty().withMessage("El de la alerta es requerido"),
      check('idUserRol').not().isEmpty().withMessage("El de la alerta es requerido"),
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

      const userDeviceToken = await Alert.findOne({
        where: { id: idAlert },
        include: [
          {
            model: Emergency,
            include: [
              {
                model: UserRol,
                attributes: ['id'],
                include: {
                  model: User,
                  attributes: ['id','deviceToken'],
                },
              }
            ]
          }
        ]
      })
      const notifications = {
        token: userDeviceToken.emergency.users_rol.user.deviceToken,
        notification: {
          title: "Alerta de emergencia aceptada",
          body: "Unidad de bomberos en camino",
        },
      }  
      await ManagementAlert.create({ idAlert, idUserRol, latitude, longitude})
      await Alert.update({ idStatus: 2 }, { where: { id: idAlert }})
      await Alert.update({ idStatus: 3 }, { where: { id: idAlert }})
      await sendOneNotification(notifications) 
      res.status(200).send({ message: 'Alerta de emergencia atendida, enviada'})
    }
  } catch (error) {
    res.status(500).send({ error: error.message })
  }

}

module.exports = {
  getManagements,
  createManagement
}