const {Router} = require('express');
const membersOnlyController = require('../controllers/membersOnlyController');
const membersOnlyRouter = Router();

const ensureMember = (req, res, next) => {
   if(!req.user){
    return res.redirect('/login');
   }
   if(!req.user.member){
    return res.redirect('/member');
   }
   next();
};

membersOnlyRouter.get('/', ensureMember, membersOnlyController.getMembersOnlyPage);
membersOnlyRouter.post('/', ensureMember, membersOnlyController.addMessage);
membersOnlyRouter.post('/delete/:id', ensureMember, membersOnlyController.deleteMessage);
module.exports = membersOnlyRouter;