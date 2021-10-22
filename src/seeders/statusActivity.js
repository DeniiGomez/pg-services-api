module.exports = {
  up: queryInterface => queryInterface.bulkInsert('status_activities',[
    {
      name: 'Disponible',
      description: 'Unidad disponible',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Atendiento emergencia',
      description: 'Unidad ocupada',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('status_activities', null, {})
}
