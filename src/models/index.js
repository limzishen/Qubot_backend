const {Sequelize, DataTypes, PostgresDialect } = require('sequelize'); 
const dotenv = require('dotenv').config(); 

const sequelize = new Sequelize({
    dialect: 'postgres',
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: process.env.DB_PORT,
    ssl: true,
    clientMinMessages: 'notice',
}); 

async function testConnection() {
    try {
    await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}; 

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

//connecting to model
db.users = require('./userModel') (sequelize, DataTypes); 

//exporting the module
module.exports = {db, testConnection};
