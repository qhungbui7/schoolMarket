//Server on event lớn nhất là 'connection' 
//Lúc này vẫn là chưa có socket thì phải là io.on, param duy nhất cho callback là socket
var db = require('./db') ; 
module.exports = function(io){
    io.on('connection',function(socket){
        console.log(`${socket.id} ket noi`) ;
        socket.on('disconnect',function(){
        console.log(`${socket.id} da thoat`) ; 
        });
        
        socket.on('adminRenderIndex',function(){
            let data = db.get('items').value() ; 
            socket.emit('sendAdminDataItem',data) ; 
        });
    });
}