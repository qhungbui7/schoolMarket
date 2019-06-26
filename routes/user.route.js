var express = require('express') ; 
var router = express.Router() ;
var db = require('../db') ; 
var controller = require('../controllers/user.controllers') ; 
var authMiddleware = require('../middlewares/auth.middleware') ; 
router.get('/login',controller.login) ;
router.get('/logout',controller.logout) ; 
router.get('/register',controller.register) ; 
router.get('/dashboard',authMiddleware.reqAuth,controller.dashboard) ; 
router.get('/manage',authMiddleware.reqAuth,controller.manage) ; 
router.get('/manage/waitingAccept',authMiddleware.reqAuth,controller.waitingAccept) ; 
router.get('/formRequestAdmin',authMiddleware.reqAuth,controller.formRequestAdmin) ; 
router.get('/userRemoveRequest/:idItem',authMiddleware.reqAuth,controller.userRemoveRequest) ; 

router.post('/login',controller.postLogin) ; 
router.post('/register',controller.postRegister) ;  
router.post('/requestAdmin',authMiddleware.reqAuth,controller.requestAdmin) ; 

module.exports = router ;