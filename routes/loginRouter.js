const {Router}= require('express');
const loginRouter = Router();
const passport = require('passport');
const loginController = require('../controllers/loginController');



loginRouter.get('/', loginController.loginUser);
loginRouter.post('/', loginController.loginPost);

module.exports = loginRouter;