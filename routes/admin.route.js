var express = require('express') ; 
var router = express.Router() ; 
var controllers = require('../controllers/admin.controllers') ; 

var shortid = require('shortid') ; 
router.get('/',controllers.index);
router.get('/logout',controllers.logout) ; 
router.get('/accept/:id',controllers.acptItem) ; 
//router.get('/decline/:index',controllers.decItem) ; 



module.exports = router ;  