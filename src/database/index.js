const dbConfig= require('../config/database');
const Sequelize = require('sequelize');
const User = require('../models/User');

const connection = new Sequelize(dbConfig);

User.init(connection);

module.exports = connection;