const admin = require('./firebase')

const sendOneNotification = async (notification) => {
  try {
    const response = await admin.messaging().send(notification)
    //console.log(response)
    return response
  } catch (err) {
    throw new Error(err.message)
  }
}

const sendNotifications = async (notifications) => {
  try {
    const response = await admin.messaging().sendMulticast(notifications)
    //console.log(response)
    return response
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = {
  sendOneNotification,
  sendNotifications
}
