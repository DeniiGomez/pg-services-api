const {check, validationResult} = require('express-validator')
const { Alert, Emergency, UserRol, User, ManagementAlert } = require('../database/connection')

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
    const { idEmergency, latitude, longitude } = req.body

    const rules = [
      check('id').not().isEmpty().withMessage("El id del usuario es requrido"),
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
      const alert = await Alert.create({ idEmergency, latitude, longitude })
       q
    }
  } catch (err) {

  }
}

module.exports = {
  getAlerts,
  getAlert
}
