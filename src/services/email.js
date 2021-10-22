require('dotenv').config()
const nodemailer = require('nodemailer')

const sendMail = async (name, email, code) => {
  //const testAccount = await nodemailer.createTestAccount()
  //console.log(testAccount)
  //console.log(process.env.CLIENT)

  const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.CLIENT,
      pass: process.env.PASS,
    }
  })

  //const url = `http://localhost:3030/api/v1/users/confirm/${code}`

  const mailOptions = {
    from: `Bomberos APP 🚒 <noreply@gmail.com>`,
    replyTo: 'noreply@gmail.com',
    to: email,
    subject: 'Confirmación de correo',
    html: `
      <div style="width: 100%; background-color: #eee; padding: 25px 0;>
      <div style="max-width: 600px; margin: 0 auto;>
      <div class="body" style="max-width: 600px; background-color: #fff; font-size: 16px; color: #333333; margin: 0 auto;">
        <div style="border-bottom: 2px solid #eee; padding: 25px 50px; ">
          <p style="font-size: 24px; margin: 0;">Confirmación de correo electrónico</p> 
        </div>
        <div style="padding: 25px 50px; width: auto; ">
          <p style="margin: 0; margin-bottom: 15px;">Hola ${name}</p> 
          <p style="margin: 0; margin-bottom: 15px;">Gracias por registrarte en nuestra app.</p> 
          <p style="margin: 0; margin-bottom: 15px;">Tu código de confirmación es:</p> 
          <div style="width: auto; border: 1px solid #dad8de; padding: 10px; font-size: 24px; text-align: center; background-color: #faf9fa;">${code}</div>
        </div>
      </div>
      </div>
      </div>
    `
  }

  const info = await transport.sendMail(mailOptions)
  console.log(nodemailer.getTestMessageUrl(info))

  return info
}

module.exports = sendMail
