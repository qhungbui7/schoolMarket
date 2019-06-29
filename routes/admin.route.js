var express = require('express') ; 
var router = express.Router() ; 
var controllers = require('../controllers/admin.controllers') ; 
var shortid = require('shortid') ; 




router.get('/',controllers.index);
router.get('/logout',controllers.logout) ; 
router.get('/accept/:id',controllers.acptItem) ; 
router.get('/decline/:id',controllers.decItem) ; 
router.get('/profile',controllers.renderProfile) ; 
router.get('/history/:date',controllers.renderHistory) ;
router.get('/manageUsers',controllers.renderUsers) ; 
router.get('/onSale',controllers.renderOnSale) ; 
router.get('/waitingAccept',controllers.renderWaitingAccept) ;

router.post('/editProfile',controllers.changeProfile) ; 
router.post('/changePass',controllers.changePass) ; 

module.exports = router ;  