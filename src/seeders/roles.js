module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('rols',[
    {
      name: 'Admin',
      description: 'Administrador',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Moderador',
      description: 'Puede crear usuarios',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Bombero',
      description: 'Miembro del cuerpo de bomberos',
      createdAt: new Date(),
      updatedAt: new Date()
    },
      {
      name: 'Civil',
      description: 'Usuario final',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ]),
  down: (queryInterface) => queryInterface.bulkDelete('rols', null, {})
}