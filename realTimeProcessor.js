var db = require('./db') ; 
//var cookieParser = require('cookie-parser') ; 
var controllers = require('./controllers/realtime.controllers') ; 
module.exports = function(io){
    let mapList = [] ; 
    io.on('connection',function(socket){
        /*console.log(`${socket.id} kết nối`) ;*/
        socket.on('disconnect',function() {
        console.log(`${socket.id} đã thoát`) ; 
        });
        socket.on('online',function(userId){
            mapList.push({
                socketId : socket.id,
                customId : userId 
            })
            console.log(`${socket.id} kết nối`) ;
        });
        socket.on('checkOut',function(data,idItem){
            
            if (!data.dateReceive) return ;  

            let temp = db.get('items').find({idItem}).value() ; 

            let queue = db.get('users').find({id : temp.owner}).value().queue ; 


            data.idItem = idItem ; 
            data.nameItem = temp.nameItem ; 
            data.cost = temp.priceItem * data.amount  ;
            queue.push(data) ; 
            console.log(queue) ; 

            seller = mapList.find(function(element){
                return element.customId === temp.owner ;
            });
            db.get('users')
                .find({id : seller.socketId})
                .assign({queue})
                .write() ; 
            
            io.to(`${seller.socketId}`).emit('customerSendData',data) ; 
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
