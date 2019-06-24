var db = require('./db') ; 
//var cookieParser = require('cookie-parser') ; 
var controllers = require('./controllers/realtime.controllers') ; 
module.exports = function(io){
    let mapList = [] ; 
    io.on('connection',function(socket){
        /*console.log(`${socket.id} kết nối`) ;*/
        socket.on('disconnect',function() {
            console.log(`${socket.id} disconnect`) ; 
            for (let i = 0 ; i < mapList.length ; i++){
                if (socket.id === mapList[i].socketId){
                    mapList.splice(i,1) ; 
                }
            }
        });
        socket.on('online',function(userId){
            mapList.push({
                socketId : socket.id,
                customId : userId 
            })
            console.log(`${userId} connect`, socket.id) ;
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

            let seller = mapList.find(function(element){
                return element.customId === temp.owner ;
            });
            db.get('users')
                .find({id : seller.socketId})
                .assign({queue})
                .write() ; 
            
            io.to(`${seller.socketId}`).emit('customerSendData',data) ; 
        });
        socket.on('userRemoveRequest',function(){
            setTimeout(function(){
                let waitingAccept = db.get('items').filter({status : 'Waiting accept'}).value() ;          

                var admin = mapList.find(function(element){
                    return element.customId === 'admin' ;
                });
                console.log('admin : ', admin.socketId) ;
                console.log(waitingAccept) ;  
                io.to(`${admin.socketId}`).emit('displayNewRequest',waitingAccept) ; 
            },2000) ; 
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
