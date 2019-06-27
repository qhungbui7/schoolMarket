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

// Waiting accept of admin
router.get('/manage/waitingAccept',authMiddleware.reqAuth,controller.waitingAccept) ; 
router.get('/manage/formRequestAdmin',authMiddleware.reqAuth,controller.formRequestAdmin) ; 
// Queue the request of customer
router.get('/manage/queue',authMiddleware.reqAuth,controller.renderQueue) ; 
router.get('/userRemoveRequest/:idItem',authMiddleware.reqAuth,controller.userRemoveRequest) ; 

//On sale
router.get('/manage/onSaleItem',authMiddleware.reqAuth,controller.renderOnSaleItem) ; 

//History user 
router.get('/manage/userHistory/:date',authMiddleware.reqAuth,controller.renderUserHistory) ; 



router.post('/login',controller.postLogin) ; 
router.post('/register',controller.postRegister) ;  
router.post('/requestAdmin',authMiddleware.reqAuth,controller.requestAdmin) ; 
router.post('/manage/findDayUserHistory',authMiddleware.reqAuth,controller.findDayUserHistory) ; 
module.exports = router ;