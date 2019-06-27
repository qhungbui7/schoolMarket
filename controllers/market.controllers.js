var db = require('../db') ; 
var nodemailer = require('../nodemailer') ; 
module.exports.market = function(req,res){
    let data = db.get('items').filter({status : 'On sale'}).value() ; 
    res.render('market/index.pug',{data}) ; 
}
module.exports.checkOut = function(req,res){
    let customer = res.locals.user ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    let user = db.get('users').find({id : item.owner}).value() ; 
    delete user.pass
    //MO DU LIEU NAY CAN DUOC GUI TOI USER.DASHBOARD QUEUE PLZZZZZZZZZZ !
    //ĐÃ GỬI Ở PHẦN REALTIME
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
    var currentdate = new Date(); 
    var date = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear()  ;
                
    var time =  currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
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