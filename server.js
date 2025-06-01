const express = require('express')
const sequelize = require('sequelize')
const dotenv = require('dotenv').config()
const cookieParser = require('cookie-parser')
const { testConnection } = require('./src/models')
const {db} = require('./src/models')
const userRoutes = require('./src/routes/userRoutes')

const PORT = process.env.PORT || 3000

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


//synchronizing the database and forcing it to false so we dont lose data
db.sequelize.sync({ alter: true }).then(() => {
    console.log("db has been re sync")
})

//routes for the user API
app.use('/api/users', userRoutes)

//listening to server connection
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`)); 

