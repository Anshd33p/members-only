const { Router } = require('express');
const membershipController = require('../controllers/membershipController');
const membershipRouter = Router();

membershipRouter.get('/', membershipController.checkMembershipStatus);
membershipRouter.post('/', membershipController.updateMembershipStatus);

module.exports = membershipRouter;