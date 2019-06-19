var db = require('../db') ; 
var nodemailer = require('../nodemailer') ; 
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
        id,
        name,
        email,
        phone,
        facebook,
        amount,
        dateReceive 
    }
    */
    let customer = req.body ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    db.get('history').push({action : 'Buy' , item : item , from : customer , to : item.owner }).write() ; 

    
    nodemailer.send(customer,item) ; 


    res.redirect('/market') ; 
}