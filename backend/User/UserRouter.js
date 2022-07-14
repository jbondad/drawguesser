

const userController = require('./UserController');
const express = require('express');
const userRouter = express.Router();

userRouter.post('/register', userController.register);
userRouter.post('/login', userController.login);

module.exports = userRouter;