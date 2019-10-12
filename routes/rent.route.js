var express = require('express') ; 
var router = express.Router() ;
var controller = require('../controllers/rent.controllers') ; 
router.get('/:tab',controller.rent) ; 
router.get('/checkOut/:id',controller.checkOut) ; 
router.post('/checkOut/:id',controller.postCheckOut) ; 
router.post('/postComment/:id/:idUser',controller.postComment) ; 
module.exports = router ; 