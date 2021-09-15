const express = require('express')
const app = express()
const api = require('./routes')

//Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/v1', api)

module.exports = app
