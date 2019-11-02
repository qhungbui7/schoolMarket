var express = require('express') ; 
var router = express.Router() ;
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.jpg') //Appending .jpg
  }
})

var upload = multer({ storage: storage });

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
router.get('/manage/waitingRentAccept',authMiddleware.reqAuth,controller.waitingRent) ; 
router.get('/manage/formRequestAdmin',authMiddleware.reqAuth,controller.formRequestAdmin) ; 
router.get('/manage/formRentAdmin',authMiddleware.reqAuth,controller.formRentAdmin) ; 
// Queue the request of customer
router.get('/manage/queue',authMiddleware.reqAuth,controller.renderQueue) ; 
router.get('/userRemoveRequest/:idItem',authMiddleware.reqAuth,controller.userRemoveRequest) ; 
router.get('/userRemoveRentRequest/:idItem',authMiddleware.reqAuth,controller.userRemoveRentRequest) ; 
router.get('/manage/shipped/:index',authMiddleware.reqAuth,controller.shipped); 

//Delivered
router.get('/manage/delivered',authMiddleware.reqAuth,controller.renderDelivered) ; 


router.get('/userRemoveItem/:idItem',authMiddleware.reqAuth,controller.userRemoveItem);
//On sale
router.get('/manage/onSaleItem',authMiddleware.reqAuth,controller.renderOnSaleItem) ; 

//History user 
router.get('/manage/userHistory/:date',authMiddleware.reqAuth,controller.renderUserHistory) ; 

//profile 
router.get('/manage/profile',authMiddleware.reqAuth,controller.renderProfile) ; 



router.post('/login',controller.postLogin) ; 
router.post('/register', upload.array('avatar', 12), controller.postRegister) ;  
router.post('/requestAdmin',authMiddleware.reqAuth,upload.single('avatar'),controller.requestAdmin) ;
router.post('/requestRentAdmin',authMiddleware.reqAuth,upload.single('avatar'),controller.requestRentAdmin) ;
router.post('/manage/findDayUserHistory',authMiddleware.reqAuth,controller.findDayUserHistory) ; 
router.post('/manage/editProfile',authMiddleware.reqAuth,controller.editProfile) ; 
router.post('/manage/changePass',authMiddleware.reqAuth,controller.changePass) ; 
module.exports = router ;