module.exports = {
  up: queryInterface => queryInterface.bulkInsert('status_activity_rols',[
    {
      idRol: 3,
      idStatusActivity: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('status_activity_rols', null, {})
}
