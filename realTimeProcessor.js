var db = require('./db') ; 
var subFunction = require('./controllers/subFunction') ; 
//var cookieParser = require('cookie-parser') ; 
var controllers = require('./controllers/realtime.controllers') ; 
module.exports = function(io){
    let mapList = [] ; 
    io.on('connection',function(socket){
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
        socket.on('checkOut',function(data,idItem,clientId){ 

            let temp = db.get('items').find({idItem}).value() ; 

            var client = mapList.find(function(element){
                return element.customId === client ;
            });
            //check Fill date
            if (!data.dateReceive && clientId) {
                io.to(`${socket.id}`).emit('plsFillDate') ; 
                return ; 
            } ;  
            //check amount 0
            if (data.amount === '0' && clientId){
                io.to(`${socket.id}`).emit('amount0') ; 
                return ; 
            }
            //check amount
            if (data.amount > temp.amount  && clientId) {
                io.to(`${socket.id}`).emit('soldOut') ; 
                return ; 
            } ;  

            // decrease the amount of item and update new amount
            temp.amount -= data.amount
            db.get('items')
                .find({id : idItem})
                .assign({amount : temp.amount})
                .write() ; 
            socket.emit('updateNewAmount',temp.idItem,temp.amount) ;

            //push history
            /*let customer = data ; 
            let item = temp ; 
            let date = subFunction.getDay() ; 
            let time =  subFunction.getTime() ; 
            db.get('history').push({
                action : 'Buy - Sell' ,
                item : item , 
                objectInfo : customer , 
                subject : customer.id,
                object : item.owner, 
                date , 
                time 
            }).write() ; 
            */

            //push data to queue of user
            let queue = db.get('users').find({id : temp.owner}).value().queue ; 
            data.idItem = idItem ; 
            data.nameItem = temp.nameItem ; 
            data.cost = temp.priceItem * data.amount  ;
            data.status = 'Đang giao' ; 
            queue.push(data) ; 
            db.get('users')
                .find({id : temp.owner})
                .assign({queue})
                .write() ; 


            // Check seller con online khong    
            let seller = mapList.find(function(element){
                return element.customId === temp.owner ;
            });
            io.to(`${socket.id}`).emit('buySucc') ; 
            if (seller){
                io.to(`${seller.socketId}`).emit('customerSendData',data) ; 
            }
        });
        socket.on('userRemoveRequest',function(){
            setTimeout(function(){
                let waitingAccept = db.get('items').filter({status : 'Waiting accept'}).value() ;          

                var admin = mapList.find(function(element){
                    return element.customId === 'admin' ;
                });
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
