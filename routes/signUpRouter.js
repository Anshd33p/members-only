const { Router } = require('express');
const signUpRouter = Router();
const db = require('../db/queries');
const controller = require('../controllers/signUpController');


signUpRouter.get('/', controller.getSignUpPage);
signUpRouter.post('/', controller.createUserPost);



module.exports = signUpRouter;