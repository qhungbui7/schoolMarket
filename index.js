//dotENV
require('dotenv').config() ; 


//CONSTANT
/*const PORT = process.env.PORT ; 
const HOST = process.env.HOST ;
const ENCRYPTEDCOOKIE = process.env.ENCRYPTEDCOOKIE ; 
*/
const PORT=80 ;
const HOST='167.179.89.227'
const ENCRYPTEDCOOKIE='#!czx$$!@ER@23123c348XZCr3cbt2resvxer$23^52#41212$23%^@23412';


//EXPRESS
var express = require('express') ;
var app = express() ; 

// CONFIG SOCKET.IO
var server = require('http').Server(app) ; 
var io = require('socket.io')(server) ; 


// MODULES
var bodyParser = require('body-parser') ; 
var cookieParser = require('cookie-parser') ; 
var clear = require('clear') ; 
var db = require('./db.js') ; 
var intervalPro = require('./intervalTimeProcessor') ; 
var subFunction = require('./controllers/subFunction') ;
//REQUIRE ROUTES
var userRoute = require('./routes/user.route') ; 
var adminRoute = require('./routes/admin.route') ; 
var marketRoute = require('./routes/market.route') ;
var rentRoute = require('./routes/rent.route') ;  
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
app.use('/rent',authMiddleware.reqAuth,rentRoute) ; 


//INDEX
app.get('/',function(req,res){
    let isLog = req.signedCookies.id ; 
    res.render('index.pug',{isLog}) ; 
})
//FAQs 
app.get('/faqs',function(req,res){
    let isLog = req.signedCookies.id ; 
    let admin = db.get('users').find({id : 'admin'}).value() ; 
    res.render('faqs.pug',{admin,isLog}) ; 
});
//Terms
app.get('/terms',function(req,res){
    let isLog = req.signedCookies.id ; 
    res.render('terms.pug',{isLog}) ; 
});

//404
app.use(function(req, res, next){
    res.status(404).render('404', {title: "Sorry, page not found"});
});

// SOCKET PART
require('./realTimeProcessor')(io) ; 

//Time
setInterval(function(){
    intervalPro.refreshUnvalidatedUser() ; 
},10000)

server.listen(PORT,function(){
    console.log(`Server is listening on port ${PORT}`) ; 
});