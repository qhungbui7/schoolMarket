var express = require('express') ; 
var router = express.Router() ; 
var controllers = require('../controllers/admin.controllers') ; 
var shortid = require('shortid') ; 



// Common task
router.get('/',controllers.index);
router.get('/usage',controllers.renderUsage) ; 
router.get('/logout',controllers.logout) ; 

// Waiting accept item
router.get('/waitingAccept',controllers.renderWaitingAccept) ;
router.get('/accept/:id',controllers.acptItem) ; 
router.get('/decline/:id',controllers.decItem) ; 

// Profile
router.get('/profile',controllers.renderProfile) ; 

router.post('/editProfile',controllers.changeProfile) ; 
router.post('/changePass',controllers.changePass) ; 

// History server
router.get('/history/:date',controllers.renderHistory) ;
router.post('/findDayHistory',controllers.findDay) ; 
router.get('/clearAllHistory',controllers.clearAllHistory) ; 

// Manage users 
router.get('/manageUsers',controllers.renderUsers) ; 
router.get('/eliminate/:id',controllers.eliminate) ; 

// On sale
router.get('/onSale',controllers.renderOnSale) ; 
router.get('/removeItem/:idItem',controllers.removeItem) ;




module.exports = router ;  