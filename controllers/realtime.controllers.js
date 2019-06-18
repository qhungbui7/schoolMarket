module.exports.checkOut = function(data){
    //console.log(data) ; 
    socket.emit('customerSendData',data) ; 
}