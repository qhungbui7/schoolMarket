var db = require('../db') ; 
module.exports.market = function(req,res){
    let data = db.get('items').filter({status : 'Đang bán'}).value() ; 
    res.render('market/index.pug',{data}) ; 
}
module.exports.checkOut = function(req,res){
    let customer = res.locals.user ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    let user = db.get('users').find({id : item.owner}).value() ; 
    delete user.pass
    res.render('market/checkOut.pug',{item,user,customer}) ; 
}
module.exports.postCheckOut = function(req,res){
    /*
    {   
        name,
        email,
        phone,
        facebook,
        amount,
        dateReceive 
    }
    */
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    db.get('history').push({action : 'Buy' , item : item , from : req.body , to : item.owner }).write() ; 
    //console.log(req.params ,' ' , req.body)  ;
    res.redirect('/market') ; 
}