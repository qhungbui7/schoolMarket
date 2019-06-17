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
    //res.redirect('/market')
}