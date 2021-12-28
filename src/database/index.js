const dbConfig = require('../config/database');
const Sequelize = require('sequelize');
const User = require('../models/User');
const Token = require('../models/Token');

const connection = new Sequelize(dbConfig);

User.init(connection);
Token.init(connection);

module.exports = connection;