module.exports = {
  up: queryInterface => queryInterface.bulkInsert('statuses',[
    {
      name: 'Pendiente',
      description: 'Pendiente de ser atendido',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Aceptado',
      description: 'Solicitud atendida',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'En curso',
      description: 'Una unidad de bomberos esta en camino',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      name: 'Finalizado',
      description: 'La unidad de bomberos ya esta en el lugar',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('statuses', null, {})
}
