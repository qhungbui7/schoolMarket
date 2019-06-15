var express = require('express') ; 
var router = express.Router() ;
var controller = require('../controllers/market.controllers') ; 
router.get('/',controller.market) ; 



module.exports = router ; 