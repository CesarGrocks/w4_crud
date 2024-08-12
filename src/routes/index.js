const express = require('express');
const routerUser = require('./user.router');
const routerToDo = require('./todo.router');
const { verifyJwt } = require('../utils/verifyJWT');
const router = express.Router();

// rutas 
router.use('/users', routerUser)
router.use('/todos', verifyJwt, routerToDo)

module.exports = router;