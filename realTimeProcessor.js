//Server on event lớn nhất là 'connection' 
//Lúc này vẫn là chưa có socket thì phải là io.on, param duy nhất cho callback là socket
var db = require('./db') ; 
var controllers = require('./controllers/realtime.controllers') ; 
module.exports = function(io){
    io.on('connection',function(socket){
        console.log(`${socket.id} kết nối`) ;
        socket.on('disconnect',function() {
        console.log(`${socket.id} đã thoát`) ; 
        });
        //socket.on('checkOut',controllers.checkOut) ; 
        socket.on('checkOut',function(data){
            socket.emit('customerSendData',data) ; 
        });
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
