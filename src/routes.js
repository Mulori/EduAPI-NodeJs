const express = require('express');
const EduController = require('./controllers/EduController');
const UserController = require('./controllers/UserController');
const routes = express.Router();

//Edu
routes.get('/edu', EduController.index);

//Aqui coloca as rotas;
routes.get('/user', UserController.UserByEmail);


module.exports = routes;