var db = require('./db') ; 
var subFunction = require('./controllers/subFunction') ; 
var controllers = require('./controllers/realtime.controllers') ; 
//var cookieParser = require('cookie-parser') ; 
module.exports = function(io){
    let mapList = [] ; 
    io.on('connection',function(socket){
        socket.on('online',controllers.online);
        socket.on('disconnect',controllers.disconnect);
        socket.on('joinItemRoom',controllers.joinItemRoom);
        socket.on('checkOut',controllers.checkOut);
        socket.on('userRemoveRequest',controllers.userRemoveRequest);
    }) ; 
}





/*
//client
script(src ='https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js') ; 
script(src = '/socket.io/socket.io.js') 
script.
    var socket = io.connect('http://localhost') ; //event connection bat cai nay
    $(document).ready(function(){
        alert('cc') ; 
    });
*/
