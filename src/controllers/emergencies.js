const { check, validationResult } = require("express-validator")
const { Emergency } = require("../database/connection")

const getEmergencies = async(req, res) => {
  const idUserRol = req.query.idUser
  const idEmergency = req.query.idEmergency

  if(idEmergency && idUserRol) {
    const emergency = await Emergency.findOne({ where: { idUserRol, id: idEmergency }})
    res.status(200).send(!emergency ? {} : {
      id: emergency.id,
      idUser: emergency.idUserRol,
      name: emergency.name,
      description: emergency.description,
    })
  }else if(idEmergency) {
    const emergency = await Emergency.findOne({ where: { id: idEmergency }})
    res.status(200).send(emergency ? {
      id: emergency.id,
      idUser: emergency.idUserRol,
      name: emergency.name,
      description: emergency.description
    } : {})
  }else {
    let listEmergencies = await Emergency.findAll({ where: { idUserRol }})
    listEmergencies = listEmergencies.map(item => ({
      id: item.id,
      idUser: item.idUserRol,
      name: item.name,
      description: item.description
    }))
    
    res.status(200).send(listEmergencies)
  }

}

const createEmergency = async(req, res) => {
  try {
    const { name, description, idUser} = req.body
    
    const rules = [
      check('name').not().isEmpty().withMessage("El nombre es obligatorio").escape(),
      check('description').not().isEmpty().withMessage('La descripcion es obligatoria').escape(),
      check('idUser').not().isEmpty().withMessage('El id del usuario es obligatorio'),
    ]
    await Promise.all(rules.map(validation => validation.run(req)))

    const errors = validationResult(req)
    const listErrors = errors.array().map(err => err.msg)
    console.log(errors)

    if(!errors.isEmpty()){
      return res.status(500).send({ errors: listErrors })
    } else {
      const emergency = await Emergency.create({ name, description, idUserRol: idUser })
      
      res.status(200).send({ message: 'Emergencia creada con exito', emergency : {
        id: emergency.id,
        idUser: emergency.idUserRol,
        name: emergency.name,
        description: emergency.description,
      }  })
    }
  } catch(err) {
    console.log(err)
    res.status(500).send({ error: err.message })
  }

}

const updateEmergency = async(req, res) => {
  try {
    const id = req.params.idEmergency
    const { name, description } = req.body
    
    const rules = [
      check('name').not().isEmpty().withMessage("El nombre es obligatorio").escape(),
      check('description').not().isEmpty().withMessage('La descripcion es obligatoria').escape(),
    ]

    await Promise.all(rules.map(validation => validation.run(req)))

    const errors = validationResult(req)
    const listErrors = errors.array().map(err => err.msg)
    console.log(errors)

    if(!errors.isEmpty()){
      return res.status(500).send({ errors: listErrors })
    } else {

      await Emergency.update({ name, description, }, { where: { id }})
      res.status(200).send({ message: 'Emergencia editada con exito', })
    }
  } catch(err) {
    console.log(err)
    res.status(500).send({ error: err.message })
  }
}

const deleteEmergency = async(req, res) => {
  try {
    const id = req.params.idEmergency
    
    await Emergency.destroy({ where: { id }})
    
    res.status(200).send({ message: 'Emergencia eliminada con exito', })
  } catch(err) {
    console.log(err)
    res.status(500).send({ error: err.message })
  }
}

module.exports = {
  getEmergencies,
  createEmergency,
  updateEmergency,
  deleteEmergency
}