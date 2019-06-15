//CONSTANT
const PORT = 80 ; 
const HOST = 'localhost' ;

//EXPRESS
var express = require('express') ;
var app = express() ; 

//REDIS


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
    app.use(cookieParser('#!czx$$!@ER@23123c348XZCr3cbt2resvxer$23^52#41212$23%^@23412')) ; 
    
    app.use('/user',userRoute) ;
    app.use('/admin',authMiddleware.authAdmin,adminRoute) ; 
    app.use('/market',authMiddleware.reqAuth,marketRoute) ; 

app.get('/',function(req,res){
    res.render('index.pug') ; 
})

// SOCKET PART
require('./realTimeProcessor')(io) ; 



server.listen(PORT,function(){
    console.log(`Server is listening on port ${PORT} `) ; 
});