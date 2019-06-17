var express = require('express') ; 
var router = express.Router() ;
var controller = require('../controllers/market.controllers') ; 
router.get('/',controller.market) ; 
router.get('/checkOut/:id',controller.checkOut) ; 
//router.post('/checkOut',controller.checkOut) ; 
module.exports = router ; 