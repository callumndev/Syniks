const { database, username, password, options } = require( '../config/database.json' );

const Sequelize = require('sequelize')
const sequelize = new Sequelize( database, username, password, options );


module.exports = sequelize;