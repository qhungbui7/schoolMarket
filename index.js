//dotENV
require('dotenv').config() ; 


//CONSTANT
const PORT = process.env.PORT ; 
const HOST = process.env.HOST ;
const ENCRYPTEDCOOKIE = process.env.ENCRYPTEDCOOKIE ; 

//EXPRESS
var express = require('express') ;
var app = express() ; 

// CONFIG SOCKET.IO
var server = require('http').Server(app) ; 
var io = require('socket.io')(server) ; 


// MODULES
var bodyParser = require('body-parser') ; 
var cookieParser = require('cookie-parser') ; 


//REQUIRE ROUTES
var userRoute = require('./routes/user.route') ; 
var adminRoute = require('./routes/admin.route') ; 
var marketRoute = require('./routes/market.route') ; 
//


//MIDDLEWARES
var authMiddleware = require('./middlewares/auth.middleware') ; 


    app.use(express.static('public')) ; 
    app.set('view engine','pug') ; 
    app.set('views','./views') ;  
    
    app.use(bodyParser.json()) ;
    app.use(bodyParser.urlencoded({extended : true})) ;
    app.use(cookieParser(ENCRYPTEDCOOKIE)) ; 
    
    app.use('/user',userRoute) ;
    app.use('/admin',authMiddleware.reqAuth,adminRoute) ; 
    app.use('/market',authMiddleware.reqAuth,marketRoute) ; 

app.get('/',function(req,res){
    res.render('index.pug') ; 
})

// SOCKET PART
require('./realTimeProcessor')(io) ; 



server.listen(PORT,function(){
    console.log(`Server is listening on port ${PORT} `) ; 
});