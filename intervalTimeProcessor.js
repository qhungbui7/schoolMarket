var subFunction = require('./controllers/subFunction') ; 
var db = require('./db') ;
module.exports.refreshUnvalidatedUser = function(){
    let date = subFunction.getDay() ; 
    let time = subFunction.getTime() ;
    let temp = new Date() ; 
    let deadline = temp.getTime() ; 
    db.get('unvalidatedUsers')
        .remove(user => (user.die < deadline))
        .write() ; 
    /*console.log(date) ;
    console.log(time) ;  
    setTimeout(function(){
        clear() ; 
    },900);*/
}