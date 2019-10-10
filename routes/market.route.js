var express = require('express') ; 
var router = express.Router() ;
var controller = require('../controllers/market.controllers') ; 
router.get('/:tab',controller.market) ; 
router.get('/checkOut/:id',controller.checkOut) ; 
router.post('/checkOut/:id',controller.postCheckOut) ; 
router.post('/postComment/:id/:idUser',controller.postComment) ; 
module.exports = router ; 