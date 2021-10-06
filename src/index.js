const app = require('./App');

(async () => {
  try {
    await require('./database/connection')
    //server
    app.listen(process.env.PORT, () => {
      console.log(`Server listen on port ${process.env.PORT}`)
    })
  } catch (err) {
    console.log(err.message)
  }
})();

