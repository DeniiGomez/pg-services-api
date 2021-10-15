const admin = require('firebase-admin')

const serviceAccount = require('./serviceKey.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://prueba-push-notification-f4804-default-rtdb.firebaseio.com"
})

module.exports = admin
