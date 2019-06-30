var db = require('../db') ; 
var subFunction = require('./subFunction') ; 
var nodemailer = require('../nodemailer') ; 
module.exports.market = function(req,res){
    let data = db.get('items').filter({status : 'On sale'}).value() ; 
    res.render('market/index.pug',{data}) ; 
}
module.exports.checkOut = function(req,res){
    let customer = res.locals.user ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    let user = db.get('users').find({id : item.owner}).value() ; 
    //MO DU LIEU NAY CAN DUOC GUI TOI USER.MANAGE QUEUE PLZZZZZZZZZZ !
    //Đã gửi ở phần realtime
    res.render('market/checkOut.pug',{item,user,customer}) ; 
}
module.exports.postCheckOut = function(req,res){
    let customer = req.body ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
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
    //nodemailer.send(customer,item) ; 


    res.redirect('/market') ; 
}