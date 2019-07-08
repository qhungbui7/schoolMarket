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

//CONFIG
app.use(express.static('public')) ; 
app.set('view engine','pug') ; 
app.set('views','./views') ;  

app.use(bodyParser.json()) ;
app.use(bodyParser.urlencoded({extended : true})) ;
app.use(cookieParser(ENCRYPTEDCOOKIE)) ; 

app.use('/user',userRoute) ;
app.use('/admin',authMiddleware.reqAuth,adminRoute) ; 
app.use('/market',authMiddleware.reqAuth,marketRoute) ; 


//INDEX
app.get('/',function(req,res){
    res.render('index.pug') ; 
})

//404
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

//FAQs 
app.get('/faqs',function(req,res){
    res.render('faqs.pug') ; 
});
//Terms
app.get('/terms',function(req,res){
    res.render('terms.pug') ; 
});


// SOCKET PART
require('./realTimeProcessor')(io) ; 



server.listen(PORT,function(){
    console.log(`Server is listening on port ${PORT}`) ; 
});