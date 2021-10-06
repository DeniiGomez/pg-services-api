module.exports = (Emergency, idUserRol) => Emergency.bulkCreate([
  {
    name: 'Fractura',
    idUserRol,
  },
  {
    name: 'Accidente automovilisto',
    idUserRol,
  }
])