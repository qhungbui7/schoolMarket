var db = require('../db') ; 
var subFunction = require('./subFunction') ; 
var nodemailer = require('../nodemailer') ; 
module.exports.market = function(req,res){
    let customer = res.locals.user ; 
    let tab = req.params.tab ;
    let type ;
    if (tab === 'all'){
        type = 'TẤT CẢ' ; 
        var data = db.get('items').filter((element)=>{
           return (db.get('users').find({id : element.owner}).value().status === 'Normal')
        }).filter({status : 'On sale'}).value() ; 
        res.render('market/index.pug',{data ,type,customer}) ; 
        return ; 
    }
    else {
        if (tab === 'food') type = 'THỰC PHẨM' ;   
        if (tab === 'deco') type = 'TRANG TRÍ' ;   
        if (tab === 'fashion') type = 'THỜI TRANG' ;   
        if (tab === 'digital') type = 'THIẾT BỊ ĐIỆN TỬ' ;   
        if (tab === 'others') type = 'KHÁC' ;   

        var data = db.get('items').filter((element)=>{
            return (db.get('users').find({id : element.owner}).value().status === 'Normal')
         }).filter({status : 'On sale' , type}).value() ; 
        res.render('market/index.pug',{data ,type,customer}) ; 
        return ;
    }
    
}
module.exports.checkOut = function(req,res){
    let customer = res.locals.user ; 
    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    let user = db.get('users').find({id : item.owner}).value() ; 
    //MO DU LIEU NAY CAN DUOC GUI TOI USER.DASHBOARD QUEUE PLZZZZZZZZZZ !
    //ĐÃ GỬI Ở PHẦN REALTIME
    res.render('market/checkOut.pug',{item,user,customer}) ; 
    
}
module.exports.postCheckOut = function(req,res){
    
    let customer = req.body ; 
    if (customer.id ==='') customer.id = 'anonymous' ; 

    let item = db.get('items').find({idItem : req.params.id}).value() ; 
    let date = subFunction.getDay() ; 
    let time =  subFunction.getTime() ; 
    db.get('history').push({
        action : 'Buy - Sell' ,
        item : item , 
        objectInfo : customer , 
        subject : item.owner,
        object : customer.id, 
        date , 
        time 
    }).write() ; 
    //nodemailer.send(customer,item) ; 

    setTimeout(function(){
        res.redirect('/market/checkOut/' + req.params.id) ; 
    }, 2000);


}